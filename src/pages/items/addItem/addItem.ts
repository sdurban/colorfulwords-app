import {Component, NgZone} from "@angular/core";
import {ModalController, NavController, NavParams, Platform} from "ionic-angular";
import {File} from "@ionic-native/file";
import {Media} from "@ionic-native/media";
import {DatabaseService} from "../../../providers/DatabaseService";
import {SoundPage} from "../../files/sound/sound";
import {ImagePage} from "../../files/image/image";

@Component({
  selector: 'add-items',
  templateUrl: 'addItem.html'
})
export class AddItemsPage {
  readonly path:string;
  boardID:number;
  callback:any;
  title: string = '';
  image:FileModel;
  sound:FileModel;
  soundSelected:Boolean = false;
  imageSelected:Boolean = false;
  position:number = 0;

  constructor(public database: DatabaseService, public fileSystem: File, public media: Media, public modalCtrl: ModalController,  public _ngZone: NgZone, public nav: NavController, public _navParams: NavParams, public platform: Platform) {
    this.boardID =  this._navParams.get('boardID');
    this.callback = this._navParams.get('reloadItems');
    this.position = this._navParams.get('position');
    this.path = this.fileSystem.dataDirectory;
  }

  getFullPathImage(path:string) {
    return ((this.platform.is('android') ? this.fileSystem.externalDataDirectory : this.fileSystem.dataDirectory) + "images/" + path).replace(/^file:\/\//, '');
  }

  getFullPathSound(path:string) {
    return ((this.platform.is('android') ? this.fileSystem.externalDataDirectory : this.fileSystem.dataDirectory) + "sounds/" + path).replace(/^file:\/\//, '');
  }

  playSound($event, path:string) {
    $event.stopPropagation();
    let sound = this.media.create(this.getFullPathSound(path));
    sound.play();
  }

  goSound() {
    this.sound = <FileModel>{};
    let soundModal = this.modalCtrl.create(SoundPage, {'select': 1}, {"enableBackdropDismiss": false});

    soundModal.onDidDismiss(data => {
      this._ngZone.run(() => {
        this.sound = data.sound;
        this.soundSelected = true;
      });
    });

    soundModal.present();
  }

  goImage() {
    this.image = <FileModel>{};
    let imageModal = this.modalCtrl.create(ImagePage, {'select': 1}, {"enableBackdropDismiss": false});

    imageModal.onDidDismiss(data => {
      this._ngZone.run(() => {
        this.image = data.image;
        this.imageSelected = true;
      });
    });

    imageModal.present();
  }

  createItem() {
    if(this.title != '' && this.image.id != null && this.sound.id != null) {
      this.database.createItem(this.title, this.image.id, this.sound.id).then(itemID => {
        this.database.assignItemBoard(itemID, this.boardID, this.position).then(() => {
          this.nav.pop();
        });
      });
    }
  }
}
