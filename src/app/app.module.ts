import { CUSTOM_ELEMENTS_SCHEMA, NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Routes } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateCommandePageModule } from './components/create-commande/create-commande.module';
import { CreateCommandePage } from './components/create-commande/create-commande.page';
import { TablePageModule } from './components/table/table.module';
import { FormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { DatePipe, LocationStrategy, PathLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ShowCommandePageModule } from './components/show-commande/show-commande.module';
import { ShowCommandePage } from './components/show-commande/show-commande.page';
import { File } from '@ionic-native/file/ngx'
import { FileTransfer } from '@ionic-native/file-transfer/ngx'
import { FileOpener } from '@ionic-native/file-opener/ngx'
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx'
import { ComparedValidatorDirective } from './services/shared/compared-validator.directive'
import { MessageService } from './services/message.service';

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    },
    whitelistedDomains: ['localhost:4000']
  }
}

@NgModule({
  declarations: [AppComponent, ComparedValidatorDirective],
  entryComponents: [CreateCommandePage, ShowCommandePage],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    TablePageModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      }
    }),
    IonicSelectableModule,
    CreateCommandePageModule,
    ShowCommandePageModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    StatusBar,
    SplashScreen,
    DatePipe,
    File,
    DocumentViewer,
    FileTransfer,
    FileOpener,
    EmailComposer,
    MessageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_BASE_HREF, useValue: "/" },
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
