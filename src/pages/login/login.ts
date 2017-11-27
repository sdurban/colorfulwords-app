import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController, Loading, AlertController } from "ionic-angular";
import { AuthService } from "../../providers/auth-service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  readonly basePathBackground:string;
  readonly extensionBackground:string;
  currentBackground:number = 0;
  backgroundElement:string;
  context:string;
  registerCredentials = { email: '', password: '', repeatpassword: '' };
  loading:Loading;

  constructor(public navCtrl: NavController, public translate: TranslateService, public loadingCtrl: LoadingController, private auth: AuthService, private nav: NavController, private alertCtrl: AlertController) {
    this.context = "login";
    this.extensionBackground ='.jpg';
    this.basePathBackground = '/assets/imgs/login-page/';
    this.currentBackground = 1;
    this.backgroundElement = this.basePathBackground+this.currentBackground+this.extensionBackground;
    setInterval(() => {
      this.currentBackground++;

      if(this.currentBackground > 3) {
        this.currentBackground = 1;
      }

      this.backgroundElement = this.basePathBackground+this.currentBackground+this.extensionBackground;
    }, 10000);
  }

  changeLanguage(lang:string) {
    this.translate.use(lang);
  }

  changeContext(context:string) {
    this.context = context;
  }

  login() {
    this.translate.get('loginloading_string').subscribe(
      value => {
        this.loading = this.loadingCtrl.create({
          content: value,
          dismissOnPageChange: true
        });

        this.loading.present();

        this.auth.login(this.registerCredentials).subscribe(
          value => {
            if(value) {
              this.nav.setRoot('dashboard');
            } else {
              this.loading.dismissAll();
              this.translate.get('loginerror_string').subscribe(
                value => {
                  let alert = this.alertCtrl.create({
                    title: value,
                    buttons: ['OK']
                  });
                  alert.present(prompt);
              });
            }
          },
          err => {
            this.loading.dismissAll();
            this.translate.get(err).subscribe(
              value => {
                let alert = this.alertCtrl.create({
                  title: value,
                  buttons: ['OK']
                });
                alert.present(prompt);
              });
          },
          () => {
            console.log("WUT");
          }
        )
      }
    )
  }

  register() {
    this.translate.get('')
  }
}
