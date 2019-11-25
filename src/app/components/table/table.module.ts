import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {TablePage} from './table.page';

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

        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    exports: [
        TablePage
    ],
    declarations: [TablePage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TablePageModule {}
