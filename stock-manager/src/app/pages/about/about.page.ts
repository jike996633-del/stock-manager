/**
 * AboutPage - Privacy & Security information.
 *
 * Rendered as an ion-accordion-group so the user can collapse
 * individual sections on smaller screens.
 *
 * Author: Tianjie Zhou
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonIcon,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText
} from '@ionic/angular/standalone';

import { HelpInfoComponent } from '../../shared/help-info/help-info.component';

/** Shape of a privacy topic rendered inside an accordion panel. */
interface PrivacyTopic {
  id: string;
  icon: string;
  title: string;
  bullets: string[];
}

@Component({
  selector: 'sm-about',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonIcon,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonText,
    HelpInfoComponent
  ],
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss']
})
export class AboutPage {
  public readonly helpText: string =
    'This screen explains how Stock Manager handles your data, what ' +
    'security measures are in place, and what you can do to keep ' +
    'records safe on a shared device.';

  public readonly topics: PrivacyTopic[] = [
    {
      id: 'collect',
      icon: 'layers-outline',
      title: 'What we collect',
      bullets: [
        'Stock record fields (name, category, quantity, price, supplier, state, featured flag, note).',
        'No personal information about you or other users.',
        'No device data (camera, contacts, location, etc.).'
      ]
    },
    {
      id: 'transport',
      icon: 'cloud-download-outline',
      title: 'How data travels',
      bullets: [
        'All REST traffic is sent over HTTPS, encrypting data in transit.',
        'We only call the documented endpoints; no other network requests.',
        'No analytics or tracking beacons are loaded.'
      ]
    },
    {
      id: 'integrity',
      icon: 'checkmark-outline',
      title: 'Input integrity & safe actions',
      bullets: [
        'Client-side validation blocks malformed data before it is sent.',
        'Destructive actions always require a confirmation dialog.',
        'The server refuses to delete the protected "Laptop" record.'
      ]
    },
    {
      id: 'you',
      icon: 'warning-outline',
      title: 'Your responsibilities',
      bullets: [
        'Keep your device locked and avoid shared logins.',
        'Double-check names before tapping Save or Delete.',
        'Report suspicious data changes to your administrator right away.'
      ]
    }
  ];
}
