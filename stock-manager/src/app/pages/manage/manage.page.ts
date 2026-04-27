/**
 * ManagePage - Update / Delete by Name.
 *
 * Flow:
 *   1. Type name -> "Load" -> GET /<name>.
 *   2. Edit fields of the template-driven form.
 *   3. "Save" issues PUT /<name> with the merged payload.
 *   4. "Delete" prompts a confirmation alert then issues DELETE /<name>.
 *
 * Author: Tianjie Zhou
 */
import { Component, inject, signal } from '@angular/core';
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
  IonNote,
  IonSpinner,
  IonSearchbar,
  IonText,
  IonBadge,
  AlertController,
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
  selector: 'sm-manage',
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
    IonNote,
    IonSpinner,
    IonSearchbar,
    IonText,
    IonBadge,
    HelpInfoComponent
  ],
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss']
})
export class ManagePage {
  public readonly categoryOptions = STOCK_CATEGORIES;
  public readonly stateOptions = STOCK_STATES;

  /** Name typed into the top searchbar. */
  public readonly lookupName = signal<string>('');
  /** Record currently loaded (null before a successful "Load"). */
  public readonly current = signal<StockRecord | null>(null);
  /** Async flags. */
  public readonly loading = signal<boolean>(false);
  public readonly saving = signal<boolean>(false);
  public readonly deleting = signal<boolean>(false);
  /** Last inline error for the lookup step. */
  public readonly errorMsg = signal<string | null>(null);

  /** Draft object bound to the edit form. */
  public draft: StockDraft = blankDraft();

  public readonly helpText: string =
    'Type an existing item name exactly, tap "Load" to pull its ' +
    'record, change anything and press "Save" to persist. ' +
    '"Delete" removes the record (the server refuses to delete "Laptop").';

  private readonly stock = inject(StockService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  /** GET /{name} and populate the form. */
  public async load(): Promise<void> {
    const name = this.lookupName().trim();
    if (name.length === 0) {
      this.errorMsg.set('Please enter a name first.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set(null);
    try {
      const record = await this.stock.findByName(name);
      this.current.set(record);
      this.draft = {
        name: record.name,
        category: record.category,
        quantity: record.quantity,
        price: record.price,
        supplier: record.supplier,
        state: record.state,
        featured: record.featured,
        note: record.note ?? ''
      };
    } catch (err) {
      this.current.set(null);
      this.errorMsg.set(this.describe(err));
    } finally {
      this.loading.set(false);
    }
  }

  /** PUT /{originalName} with the current draft. */
  public async save(form: NgForm): Promise<void> {
    const existing = this.current();
    if (!existing) {
      return;
    }
    if (form.invalid) {
      form.control.markAllAsTouched();
      await this.toast(
        'Please correct the highlighted fields first.',
        'warning'
      );
      return;
    }
    this.saving.set(true);
    try {
      const updated = await this.stock.updateRecord(existing.name, this.draft);
      this.current.set(updated);
      await this.toast(`Updated "${updated.name}".`, 'success');
    } catch (err) {
      await this.toast(this.describe(err), 'danger');
    } finally {
      this.saving.set(false);
    }
  }

  /** Confirm + DELETE /{name}. */
  public async remove(): Promise<void> {
    const existing = this.current();
    if (!existing) {
      return;
    }
    const name = existing.name;
    const confirm = await this.alertCtrl.create({
      header: 'Delete record',
      subHeader: `"${name}"`,
      message: 'This action cannot be undone. Proceed?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive' }
      ]
    });
    await confirm.present();
    const result = await confirm.onDidDismiss();
    if (result.role !== 'destructive') {
      return;
    }

    this.deleting.set(true);
    try {
      await this.stock.removeRecord(name);
      await this.toast(`Deleted "${name}".`, 'success');
      this.current.set(null);
      this.draft = blankDraft();
      this.lookupName.set('');
    } catch (err) {
      await this.toast(this.describe(err), 'danger');
    } finally {
      this.deleting.set(false);
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
