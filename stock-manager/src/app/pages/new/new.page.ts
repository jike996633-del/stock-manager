/**
 * NewPage - Create a new stock record + show featured items.
 *
 * Uses template-driven forms (ngModel + #name="ngModel") for
 * validation. The featured items appear in a horizontal carousel
 * above the form.
 *
 * Author: Tianjie Zhou
 */
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToggle,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonNote,
  IonSpinner,
  IonText,
  ToastController
} from '@ionic/angular/standalone';

import { StockService } from '../../core/services/stock.service';
import {
  StockRecord,
  StockDraft,
  STOCK_CATEGORIES,
  STOCK_STATES,
  blankDraft
} from '../../core/models/stock-record';
import { HelpInfoComponent } from '../../shared/help-info/help-info.component';

@Component({
  selector: 'sm-new',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToggle,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonNote,
    IonSpinner,
    IonText,
    HelpInfoComponent
  ],
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss']
})
export class NewPage implements OnInit {
  public readonly categoryOptions = STOCK_CATEGORIES;
  public readonly stateOptions = STOCK_STATES;

  /** Draft object bound to the ngModel controls. */
  public draft: StockDraft = blankDraft();

  /** Featured records shown in the carousel. */
  public readonly featured = signal<StockRecord[]>([]);
  public readonly loadingFeatured = signal<boolean>(false);
  public readonly submitting = signal<boolean>(false);

  /** Validation pattern for names - letters/numbers/basic punctuation. */
  public readonly namePattern = /^[A-Za-z0-9][A-Za-z0-9 _\-./()]*$/;

  /** Help popover copy. */
  public readonly helpText: string =
    'Fill every required field. Item names must be unique on the ' +
    'server. Turn on the "Featured" toggle to highlight the new ' +
    'record in the carousel and in the Browse tab.';

  private readonly stock = inject(StockService);
  private readonly toastCtrl = inject(ToastController);

  public ngOnInit(): void {
    void this.reloadFeatured();
  }

  /** Reload the featured list from the REST endpoint. */
  public async reloadFeatured(): Promise<void> {
    this.loadingFeatured.set(true);
    try {
      const all = await this.stock.fetchAll();
      this.featured.set(all.filter((r) => r.featured));
    } catch (err) {
      await this.toast(this.describe(err), 'danger');
    } finally {
      this.loadingFeatured.set(false);
    }
  }

  /** Submit handler for the template-driven form. */
  public async submit(form: NgForm): Promise<void> {
    if (form.invalid) {
      form.control.markAllAsTouched();
      await this.toast(
        'Please correct the highlighted fields first.',
        'warning'
      );
      return;
    }
    this.submitting.set(true);
    try {
      const created = await this.stock.addRecord(this.draft);
      await this.toast(`Created "${created.name}" successfully.`, 'success');
      // Reset form state and draft object.
      form.resetForm();
      this.draft = blankDraft();
      await this.reloadFeatured();
    } catch (err) {
      await this.toast(this.describe(err), 'danger');
    } finally {
      this.submitting.set(false);
    }
  }

  private describe(err: unknown): string {
    return err instanceof Error ? err.message : 'Unexpected error';
  }

  private async toast(
    message: string,
    color: 'success' | 'danger' | 'warning'
  ): Promise<void> {
    const t = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await t.present();
  }
}
