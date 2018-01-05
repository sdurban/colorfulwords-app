import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {PinDialog} from "@ionic-native/pin-dialog";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class KidProvider {
  public readonly ADULT_MODE = 0;
  public readonly KID_MODE = 1;
  public status: number;
  public pin:string = '0000';

  public constructor(public storage: Storage, public pinDialog: PinDialog, public translate: TranslateService) {
    this.status = this.ADULT_MODE;
    this.storage.get('pin').then((val) => {
      if(val != null)
        this.pin = val;
    })
  }

  /**
   * Checks if pin inserted is correct then go to adult mode.
   */
  public goAdult() {
    this.translate.stream(['enterpinout', 'okpin', 'cancelpin']).subscribe(data => {
      this.pinDialog.prompt(data['enterpinout'], data['enterpinout'], [data['okpin'], data['cancelpin']]).then((result:any) => {
        if(result.input1 == this.pin)
          this.status = this.ADULT_MODE;
      });
    });
  }

  /**
   * Checks if pin is setted and then go to kid mode.
   */
  public goKid() {
    if(this.pin == '0000') {
      this.setPin().then(() => {
        this.status = this.KID_MODE;
      })
    } else {
      this.status = this.KID_MODE;
    }
  }

  /**
   * Triggers PIN modal and gets data from it saving in storage for next uses.
   *
   * @returns {Promise}
   */
  public setPin() {
    return new Promise((resolve, reject) => {
      this.translate.stream(['enternewpin', 'okpin', 'cancelpin']).subscribe(data => {
        this.pinDialog.prompt(data['enternewpin'], data['enternewpin'], [data['okpin'], data['cancelpin']]).then((result:any) => {
          if(result.buttonIndex == 1) {
            this.storage.set('pin', result.input1).then(() => {
              this.pin = result.input1;
              resolve();
            });
          } else {
            reject();
          }
        });
      });
    });
  }
}
