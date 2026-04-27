/**
 * ListPage - Browse + Search
 *
 * Renders every stock record as a card tile. The user can type an
 * exact name in the searchbar and tap "Fetch" to hit the server's
 * `/<name>` endpoint. The page uses Angular signals for state.
 *
 * Author: Tianjie Zhou
 */
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  IonText,
  ToastController
} from '@ionic/angular/standalone';

import { StockService } from '../../core/services/stock.service';
import { StockRecord } from '../../core/models/stock-record';
import { HelpInfoComponent } from '../../shared/help-info/help-info.component';

@Component({
  selector: 'sm-list',
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
    IonSearchbar,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonChip,
    IonRefresher,
    IonRefresherContent,
    IonText,
    HelpInfoComponent
  ],
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss']
})
export class ListPage implements OnInit {
  /** Full record set returned by the backend. */
  public readonly records = signal<StockRecord[]>([]);
  /** Currently bound searchbar text. */
  public readonly query = signal<string>('');
  /** In-flight flag for any pending REST call. */
  public readonly busy = signal<boolean>(false);
  /** Last error message (null when no error). */
  public readonly errorMsg = signal<string | null>(null);
  /** Record returned by the exact-name "Fetch" action. */
  public readonly spotlight = signal<StockRecord | null>(null);

  /** Computed visible list = filtered by query substring. */
  public readonly visible = computed<StockRecord[]>(() => {
    const needle = this.query().trim().toLowerCase();
    const all = this.records();
    if (!needle) {
      return all;
    }
    return all.filter((r) => r.name.toLowerCase().includes(needle));
  });

  /** Help text shown in the popover. */
  public readonly helpText: string =
    'Type any fragment of a name to filter the tiles below. Use the ' +
    '"Fetch" button to download a single record via its exact name. ' +
    'Pull the page down to refresh the whole list.';

  private readonly stock = inject(StockService);
  private readonly toastCtrl = inject(ToastController);

  public ngOnInit(): void {
    void this.refresh();
  }

  /** Reload everything from the backend. */
  public async refresh(): Promise<void> {
    this.busy.set(true);
    this.errorMsg.set(null);
    try {
      const all = await this.stock.fetchAll();
      this.records.set(all);
    } catch (err) {
      this.errorMsg.set(this.describe(err));
    } finally {
      this.busy.set(false);
    }
  }

  /** Refresher event handler. */
  public async onPull(event: Event): Promise<void> {
    try {
      const all = await this.stock.fetchAll();
      this.records.set(all);
      this.errorMsg.set(null);
    } catch (err) {
      this.errorMsg.set(this.describe(err));
    } finally {
      (event.target as HTMLIonRefresherElement).complete();
    }
  }

  /** Exact-name lookup against GET /{name}. */
  public async fetchOne(): Promise<void> {
    const needle = this.query().trim();
    if (needle.length === 0) {
      await this.toast('Please type an exact item name first.', 'warning');
      return;
    }
    this.busy.set(true);
    try {
      const record = await this.stock.findByName(needle);
      this.spotlight.set(record);
    } catch (err) {
      this.spotlight.set(null);
      await this.toast(this.describe(err), 'danger');
    } finally {
      this.busy.set(false);
    }
  }

  /** Clear the spotlight card. */
  public dismissSpotlight(): void {
    this.spotlight.set(null);
  }

  /** Map a UI state to a .sm-pill modifier class. */
  public pillClass(state: StockRecord['state']): string {
    switch (state) {
      case 'In Stock':     return 'sm-pill sm-pill--ok';
      case 'Low Stock':    return 'sm-pill sm-pill--warn';
      case 'Out of Stock': return 'sm-pill sm-pill--bad';
      default:             return 'sm-pill';
    }
  }

  /** Safe string extraction from unknown errors. */
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
