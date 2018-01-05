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

  /**
   * Load/Updates images showed in the page.
   *
   * @returns {Promise}
   */
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

  /**
   * Loads AddImagePage controller as modal and shows.
   */
  addImage() {
    let addSoundModal = this.modalCtrl.create(AddImagePage, {}, {"enableBackdropDismiss": false});

    addSoundModal.onDidDismiss(() => {
      this.loadImages();
    });

    addSoundModal.present();
  }

  /**
   * Deletes file from database
   *
   * @param id
   */
  removeImage(id:number) {
    //TODO: Delete from filesystem
    return new Promise(success => {
      this.databaseService.deleteFile(id).then(() => {
        this.loadImages();
        success();
      })
    })
  }

  /**
   * ```NEEDS REFACTOR``` Gives the urlpath of an image asset.
   *
   * @param {string} path
   * @returns {string}
   */
  getFullPath(path:string) {
    //TODO: Needs refactor into service
    return ((this.platform.is('android') ? this.fileSystem.externalDataDirectory : this.fileSystem.dataDirectory) + "images/" + path).replace(/^file:\/\//, '');
  }

  /**
   * If this view is loaded as a modal returns the Image selected.
   *
   * @param {FileModel} image
   */
  returnImage(image:FileModel) {
    if(this.isModal) {
      this.view.dismiss({'image': image});
    }
  }
}

