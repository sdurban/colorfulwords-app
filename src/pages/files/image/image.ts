import { Component } from '@angular/core';
import {ModalController, Nav, NavParams} from "ionic-angular";
import {DatabaseService} from "../../../providers/DatabaseService";
import {LoadingProvider} from "../../../providers/loadingprovider";
import {AddImagePage} from "./addImage/addImage";
import {File} from "@ionic-native/file";

@Component({
  selector: 'page-image',
  templateUrl: 'image.html'
})
export class ImagePage {
  images:File[];

  constructor(public databaseService: DatabaseService, public navParams: NavParams, public nav: Nav, public loading: LoadingProvider, public modalCtrl: ModalController, public fileSystem: File) {
    this.loadImages();
  }

  loadImages() {
    return new Promise(success => {
      this.databaseService.getAllImages().then((data:any) => {
        this.images = data;
        success();
      })
    });
  }

  addImage() {
    let addSoundModal = this.modalCtrl.create(AddImagePage, {}, {"enableBackdropDismiss": false});
    addSoundModal.present().then(() => {
      this.loadImages();
    });
  }

  removeImage(id:number) {
    return new Promise(success => {
      this.databaseService.deleteFile(id).then(() => {
        success();
      })
    })
  }

  getFullPath(path:string) {
    return (this.fileSystem.dataDirectory + "images/" + path).replace(/^file:\/\//, '');
  }
}

