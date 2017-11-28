import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Globalization } from '@ionic-native/globalization';
import { IonicStorageModule } from '@ionic/storage';
import {Device} from "@ionic-native/device";

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AuthService } from '../providers/auth-service';
import { ServerProvider} from "../providers/serverprovider";
import { ColorfullTalk } from './app.component';
import { LoginPage } from '../pages/login/login';


@NgModule({
  declarations: [
    ColorfullTalk,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ColorfullTalk),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (setTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ColorfullTalk,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Globalization,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    ServerProvider
  ]
})
export class AppModule {}

export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
