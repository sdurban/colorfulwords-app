import {Component, NgZone} from '@angular/core';
import {ModalController, NavController, NavParams, Platform, ViewController} from "ionic-angular";
import {DatabaseService} from "../../../providers/DatabaseService";
import {AddSoundPage} from "./addSound/addSound";
import {LoadingProvider} from "../../../providers/loadingprovider";
import {Media} from "@ionic-native/media";
import {File} from "@ionic-native/file";

@Component({
  selector: 'page-sound',
  templateUrl: 'sound.html'
})
export class SoundPage {
  sounds:FileModel[];
  isModal: Boolean = false;

  constructor(public databaseService: DatabaseService, public navParams: NavParams, public nav: NavController, public loading: LoadingProvider, public modalCtrl: ModalController, public media: Media, public fileSystem: File,  public _navParams: NavParams, public view: ViewController, public _ngZone: NgZone, public platform: Platform) {
    if(this._navParams.get("select") == 1) {
      this.isModal = true;
    }
    this.loadSound();
  }

  loadSound() {
    this.sounds = [];
    return new Promise(resolve => {
      this.databaseService.getAllSounds().then(data => {
        this._ngZone.run(() => {
          this.sounds = data;
        });
      })
    })
  }

  addSound() {
    let addSoundModal = this.modalCtrl.create(AddSoundPage, {'select': 0}, {"enableBackdropDismiss": false});

    addSoundModal.onDidDismiss(() => {
      this.loadSound();
    });

    addSoundModal.present();
  }

  playSound(path) {
    let sound = this.media.create(this.getFullPath(path));
    sound.play();
  }

  removeSound(id) {
    this.databaseService.deleteFile(id).then(() => {
      this.loadSound();
    });
  }

  getFullPath(path:string) {
    return ((this.platform.is('android') ? this.fileSystem.externalDataDirectory : this.fileSystem.dataDirectory) + "sounds/" + path).replace(/^file:\/\//, '');
  }

  returnSound(sound:FileModel) {
    if(this.isModal) {
      this.view.dismiss({'sound': sound});
    }
  }
}

