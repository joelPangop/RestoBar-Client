import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TablePage } from './table.page';
import {CreateCommandePageModule} from '../create-commande/create-commande.module';
import {CreateCommandePage} from '../create-commande/create-commande.page';

const routes: Routes = [
  {
    path: '',
    component: TablePage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,

        RouterModule.forChild(routes)
    ],
    exports: [
        TablePage
    ],
    declarations: [TablePage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TablePageModule {}
