/**
 * ShellPage - mandatory Ionic Tabs shell hosting the 4 main pages.
 * Author: Tianjie Zhou
 */
import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'sm-shell',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" color="light">
        <ion-tab-button tab="list">
          <ion-icon name="cube-outline"></ion-icon>
          <ion-label>Browse</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="new">
          <ion-icon name="add-outline"></ion-icon>
          <ion-label>New</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="manage">
          <ion-icon name="pencil-outline"></ion-icon>
          <ion-label>Manage</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="about">
          <ion-icon name="information-circle-outline"></ion-icon>
          <ion-label>About</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
})
export class ShellPage {}
