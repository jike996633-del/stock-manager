/**
 * RootComponent - top-level shell that hosts the Ionic router outlet
 * and registers every ionicon used across the Stock Manager.
 * Author: Jiutai Yu
 */
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cubeOutline,
  addOutline,
  pencilOutline,
  informationCircleOutline,
  searchOutline,
  helpCircleOutline,
  sparklesOutline,
  sparkles,
  trashBinOutline,
  cloudDownloadOutline,
  checkmarkOutline,
  closeOutline,
  warningOutline,
  layersOutline,
  pricetagOutline,
  businessOutline,
  reloadOutline
} from 'ionicons/icons';

@Component({
  selector: 'sm-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class RootComponent {
  constructor() {
    addIcons({
      cubeOutline,
      addOutline,
      pencilOutline,
      informationCircleOutline,
      searchOutline,
      helpCircleOutline,
      sparklesOutline,
      sparkles,
      trashBinOutline,
      cloudDownloadOutline,
      checkmarkOutline,
      closeOutline,
      warningOutline,
      layersOutline,
      pricetagOutline,
      businessOutline,
      reloadOutline
    });
  }
}
