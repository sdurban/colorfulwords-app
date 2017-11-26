import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { Globalization } from '@ionic-native/globalization';

@Component({
  templateUrl: 'app.html'
})
export class ColorfullTalk {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, translate: TranslateService, globalization: Globalization) {
    platform.ready().then(() => {
      translate.setDefaultLang('ca');
      if(typeof window['cordova'] !== "undefined") {
        globalization.getPreferredLanguage().then((res) => {
          translate.use(res.value);
        });
        statusBar.styleDefault();
        splashScreen.hide();
      }
    });
  }
}

