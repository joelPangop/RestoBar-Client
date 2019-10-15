import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {HttpClientModule} from '@angular/common/http';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CreateCommandePageModule} from './components/create-commande/create-commande.module';
import {CreateCommandePage} from './components/create-commande/create-commande.page';
import {TablePageModule} from './components/table/table.module';
import {IonicStorageModule} from '@ionic/storage';
import {FormsModule} from '@angular/forms';
import {IonicSelectableModule} from 'ionic-selectable';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [CreateCommandePage],
    imports: [BrowserModule,
        IonicModule.forRoot(),
        HttpClientModule,
        AppRoutingModule,
        TablePageModule,
        FormsModule,
        IonicStorageModule.forRoot(),
        IonicSelectableModule,
        CreateCommandePageModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
