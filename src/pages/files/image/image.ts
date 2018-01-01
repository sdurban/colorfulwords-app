import {Component, NgZone} from '@angular/core';
import {ModalController, NavController, NavParams, Platform, ViewController} from "ionic-angular";
import {DatabaseService} from "../../../providers/DatabaseService";
import {LoadingProvider} from "../../../providers/loadingprovider";
import {AddImagePage} from "./addImage/addImage";
import {File} from "@ionic-native/file";

@Component({
  selector: 'page-image',
  templateUrl: 'image.html'
})
export class ImagePage {
  images:FileModel[];
  isModal:Boolean = false;

  constructor(public databaseService: DatabaseService, public navParams: NavParams, public nav: NavController, public loading: LoadingProvider, public modalCtrl: ModalController, public fileSystem: File,  public _navParams: NavParams, public view: ViewController, public _ngZone: NgZone, public platform: Platform) {
    if(this._navParams.get("select") == 1) {
      this.isModal = true;
    }
    this.loadImages();
  }

  loadImages() {
    this.images = [];
    return new Promise(success => {
      this.databaseService.getAllImages().then((data:any) => {
        this._ngZone.run(() => {
          this.images = data;
          success();
        });
      })
    });
  }

  addImage() {
    let addSoundModal = this.modalCtrl.create(AddImagePage, {}, {"enableBackdropDismiss": false});

    addSoundModal.onDidDismiss(() => {
      this.loadImages();
    });

    addSoundModal.present();
  }

  removeImage(id:number) {
    return new Promise(success => {
      this.databaseService.deleteFile(id).then(() => {
        this.loadImages();
        success();
      })
    })
  }

  getFullPath(path:string) {
    return ((this.platform.is('android') ? this.fileSystem.externalDataDirectory : this.fileSystem.dataDirectory) + "images/" + path).replace(/^file:\/\//, '');
  }

  returnImage(image:FileModel) {
    if(this.isModal) {
      this.view.dismiss({'image': image});
    }
  }
}

