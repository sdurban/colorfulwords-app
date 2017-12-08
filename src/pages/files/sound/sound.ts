import { Component } from '@angular/core';
import {ModalController, Nav, NavParams} from "ionic-angular";
import {DatabaseService} from "../../../providers/DatabaseService";
import {AddSoundPage} from "./addSound/addSound";
import {LoadingProvider} from "../../../providers/loadingprovider";
import {Media} from "@ionic-native/media";

@Component({
  selector: 'page-sound',
  templateUrl: 'sound.html'
})
export class SoundPage {
  sounds:File[];

  constructor(public databaseService: DatabaseService, public navParams: NavParams, public nav: Nav, public loading: LoadingProvider, public modalCtrl: ModalController, public media: Media) {
    this.loadSound();
  }

  loadSound() {
    return new Promise(resolve => {
      this.databaseService.getAllSounds().then(data => {
        this.sounds = data;
      })
    })
  }

  addSound() {
    let addSoundModal = this.modalCtrl.create(AddSoundPage, {}, {"enableBackdropDismiss": false});
    addSoundModal.present().then(() => {
      this.loadSound();
    });
  }

  playSound(path) {
    let sound = this.media.create(path);
    sound.play();
  }

  removeSound(id) {
    this.databaseService.deleteFile(id).then(() => {
      this.loadSound();
    });
  }
}

