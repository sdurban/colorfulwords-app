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
import {DashboardPage} from "../pages/dashboard/dashboard";
import {SQLite} from "@ionic-native/sqlite";
import {DatabaseService} from "../providers/DatabaseService";
import {AddBoardPage} from "../pages/dashboard/addBoard/addBoard";
import {LoadingProvider} from "../providers/loadingprovider";
import {CapitalizeFirstPipe} from "../pipes/capitalize";
import {KidProvider} from "../providers/KidProvider";
import {FileTransfer} from "@ionic-native/file-transfer";
import {ItemsPage} from "../pages/items/items";
import {ImagePage} from "../pages/files/image/image";
import {SoundPage} from "../pages/files/sound/sound";
import {FilesPage} from "../pages/files/files";
import {File} from "@ionic-native/file";
import {AddSoundPage} from "../pages/files/sound/addSound/addSound";
import {Media} from "@ionic-native/media";
import {Camera} from "@ionic-native/camera";
import {AddImagePage} from "../pages/files/image/addImage/addImage";
import {FilePath} from "@ionic-native/file-path";
import {AddItemsPage} from "../pages/items/addItem/addItem";


@NgModule({
  declarations: [
    ColorfullTalk,
    CapitalizeFirstPipe,
    LoginPage,
    DashboardPage,
    AddBoardPage,
    ItemsPage,
    ImagePage,
    SoundPage,
    FilesPage,
    AddSoundPage,
    AddImagePage,
    AddItemsPage
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
    LoginPage,
    DashboardPage,
    AddBoardPage,
    ItemsPage,
    ImagePage,
    SoundPage,
    FilesPage,
    AddSoundPage,
    AddImagePage,
    AddItemsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Globalization,
    Device,
    File,
    FileTransfer,
    Media,
    Camera,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    ServerProvider,
    SQLite,
    DatabaseService,
    LoadingProvider,
    KidProvider
  ]
})
export class AppModule {}

export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
