import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {App, Config, Loading, LoadingController} from "ionic-angular";

@Injectable()
export class LoadingProvider extends LoadingController {
  loading: Loading;

  public constructor(_app: App, config: Config, public translate: TranslateService) {
    super(_app, config);
  }

  show(message) {
    return new Promise(resolve => {
      this.translate.get(message).subscribe(
        value => {
          this.loading = this.create({
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
