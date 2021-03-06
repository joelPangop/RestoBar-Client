import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {HomePage} from './home.page';
import {TablePageModule} from '../components/table/table.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
        {
            path: '',
            component: HomePage
        }
    ]),
    TablePageModule
],
    declarations: [HomePage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {
}
