import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DepensePage } from './depense.page';

const routes: Routes = [
  {
    path: '',
    component: DepensePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DepensePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DepensePageModule {}
