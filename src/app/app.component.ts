import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from "../pages/dashboard/dashboard";
import { Globalization } from '@ionic-native/globalization';
import { Storage } from "@ionic/storage";
import {KidProvider} from "../providers/KidProvider";
import {FilesPage} from "../pages/files/files";
import {DatabaseService} from "../providers/DatabaseService";
import {File} from "@ionic-native/file";
import {ConfigurationPage} from "../pages/configuration/configuration";

@Component({
  templateUrl: 'app.html'
})
export class ColorfullTalk {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;

  pages: Array<{title: string, component: any, bottom:boolean, event:string}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, translate: TranslateService, globalization: Globalization, public storage: Storage, public modeApp: KidProvider, public database: DatabaseService, public file: File) {
    this.setUpPages();

    platform.ready().then(() => {
      translate.setDefaultLang('ca');
      this.setUpLanguage(storage, globalization, translate).then(() => {
        this.setRootPage(storage).then(() => {
          statusBar.hide();
          splashScreen.hide();
        })
      });
    });
  }
  setUpPages() {
    this.pages = [
      { title: 'boards_title', component: DashboardPage, bottom: false, event: null},
      { title: 'assets_title', component: FilesPage, bottom: false, event: null},
      { title: 'configuration_title', component: ConfigurationPage, bottom: false, event: null},
      { title: 'logout_title', component: LoginPage, bottom: true, event: 'Logout'},
    ];
  }

  setUpLanguage(storage:Storage, globalization:Globalization, translate:TranslateService) {
    return new Promise((resolve) => {
      storage.get('language').then((val) => {
        if(val != null) {
          translate.use(val);
          resolve();
        } else {
          if(typeof window['cordova'] !== "undefined") {
            globalization.getPreferredLanguage().then((res) => {
              var lang: string = res.value;
              if (lang.substring(0, 3) == "es-") {
                lang = 'es';
              } else if (lang.substring(0, 3) == 'en-') {
                lang = 'en'
              }
              translate.use(lang);
              resolve()
            });
          } else {
            resolve();
          }
        }
      });
    });
  }

  setRootPage(storage:Storage) {
    return new Promise((resolve) => {
      storage.get('bearer').then((val) => {
        if(val != null && val != '') {
          this.rootPage = DashboardPage;
          resolve()
        }
      })
    });
  }

  openPage(page) {
    switch(page.event) {
      case 'Logout':
        this.destroyDatabase();
      default:
        break;
    }
    this.nav.setRoot(page.component);
  }

  destroyDatabase() {
    this.storage.remove('language');
    this.storage.remove('bearer');
    this.storage.remove('pin');
    this.database.deleteAll();
    this.file.removeRecursively(this.file.dataDirectory, "images");
    this.file.removeRecursively(this.file.dataDirectory, "sounds");
  }
}
