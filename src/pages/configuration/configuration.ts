import {Component} from '@angular/core';
import {KidProvider} from "../../providers/KidProvider";
import {TranslateService} from "@ngx-translate/core";
import {Globalization} from "@ionic-native/globalization";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html'
})
export class ConfigurationPage {
  language: string;

  constructor(public kidMode: KidProvider, public translate: TranslateService, public globalization: Globalization, public storage: Storage) {
    this.storage.get('language').then((val) => {
      if(val != null) {
        this.language = val;
      } else {
        if (typeof window['cordova'] !== "undefined") {
          this.globalization.getPreferredLanguage().then((lang:any) => {
            if (lang.substring(0, 3) == "es-") {
              this.language = 'es';
            } else if (lang.substring(0, 3) == 'en-') {
              this.language = 'en'
            }
          });
        }
      }
    });
  }

  setPin() {
    this.kidMode.setPin();
  }

  chgLanguage() {
    this.storage.set('language', this.language);
    this.translate.use(this.language);
  }
}
