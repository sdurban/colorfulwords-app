import {Injectable, ViewChild} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {App, Config, Loading, LoadingController, Nav} from "ionic-angular";

@Injectable()
export class LoadingProvider {
  @ViewChild(App) _app: App;
  @ViewChild(Config) config: Config;
  @ViewChild(Nav) nav: Nav;
  loading: Loading;

  public constructor(public translate: TranslateService, public loadingCtrl: LoadingController) {}

  show(message) {
    return new Promise(resolve => {
      this.translate.get(message).subscribe(
        value => {
          this.loading = this.loadingCtrl.create({
            content: value,
            dismissOnPageChange: true
          });
          resolve();
        }
      );
    })
  }

  dismiss() {
    this.loading.dismissAll();
  }
}
