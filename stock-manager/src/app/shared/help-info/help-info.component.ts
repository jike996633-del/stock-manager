/**
 * HelpInfoComponent
 *
 * Re-usable help widget rendered as a compact icon button inside the
 * page toolbar. Tapping it opens an Ionic Popover anchored to the
 * button that shows a title + tip bullets (one bullet per sentence
 * in the supplied `text` input). Each bullet has a teal checkmark
 * icon so the popover looks richer than a plain alert dialog.
 *
 * Author: Tianjie Zhou
 */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  PopoverController
} from '@ionic/angular/standalone';

@Component({
  selector: 'sm-help-info',
  standalone: true,
  imports: [IonButton, IonIcon],
  template: `
    <ion-button
      class="sm-help-pill"
      fill="solid"
      shape="round"
      size="small"
      color="light"
      (click)="open($event)"
      aria-label="Open help">
      <ion-icon slot="start" name="help-circle-outline"></ion-icon>
      Help
    </ion-button>
  `,
  styles: [`
    .sm-help-pill {
      --color: var(--ion-color-primary);
      --background: #ffffff;
      --background-activated: #eafaf5;
      --background-hover: #f0fbf7;
      --box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      font-weight: 600;
      letter-spacing: 0.3px;
      margin-right: 6px;
    }
  `]
})
export class HelpInfoComponent {
  /** One or more sentences; the popover splits them into tip bullets. */
  @Input({ required: true }) public text!: string;
  /** Optional title shown at the top of the popover. */
  @Input() public title: string = 'Help';

  constructor(private readonly popoverCtrl: PopoverController) {}

  /** Anchor a popover to the tapped button. */
  public async open(event: Event): Promise<void> {
    const popover = await this.popoverCtrl.create({
      component: HelpPopoverBody,
      componentProps: {
        title: this.title,
        tips: this.splitIntoTips(this.text)
      },
      event,
      showBackdrop: true,
      alignment: 'end',
      side: 'bottom',
      size: 'auto',
      cssClass: 'sm-help-popover'
    });
    await popover.present();
  }

  /** Split the supplied text into individual tip sentences. */
  private splitIntoTips(raw: string): string[] {
    return raw
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
}

/**
 * HelpPopoverBody - the card shown inside the popover.
 *
 * Kept in the same file because it is an implementation detail of
 * `HelpInfoComponent` and never rendered directly by a page.
 */
@Component({
  standalone: true,
  imports: [CommonModule, IonContent, IonList, IonItem, IonLabel, IonIcon],
  template: `
    <ion-content class="ion-padding help-pop">
      <div class="head">
        <ion-icon name="sparkles-outline" color="primary"></ion-icon>
        <h3>{{ title }}</h3>
      </div>
      <ion-list lines="none" class="tips">
        <ion-item *ngFor="let tip of tips" color="none">
          <ion-icon
            slot="start"
            name="checkmark-outline"
            color="primary"
            size="small">
          </ion-icon>
          <ion-label class="ion-text-wrap">
            <p>{{ tip }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    :host { display: block; min-width: 260px; max-width: 320px; }
    .help-pop { --background: #f6fffb; }
    .head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 2px 4px 10px;
      border-bottom: 1px solid rgba(15, 159, 138, 0.15);
      margin-bottom: 8px;
    }
    .head h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: var(--ion-color-primary);
    }
    .tips ion-item {
      --min-height: 32px;
      --padding-start: 0;
    }
    .tips p {
      font-size: 13px;
      line-height: 1.4;
    }
  `]
})
export class HelpPopoverBody {
  @Input() public title: string = 'Help';
  @Input() public tips: string[] = [];
}

