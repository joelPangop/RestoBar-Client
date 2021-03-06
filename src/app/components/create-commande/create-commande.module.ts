import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateCommandePage } from './create-commande.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCommandePage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
  declarations: [CreateCommandePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateCommandePageModule {}
