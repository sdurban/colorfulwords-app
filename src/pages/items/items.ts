import {Component, NgZone} from '@angular/core';
import { DatabaseService} from "../../providers/DatabaseService";
import {ModalController, NavController, NavParams, Platform} from "ionic-angular";
import {LoadingProvider} from "../../providers/loadingprovider";
import {KidProvider} from "../../providers/KidProvider";
import {AddItemsPage} from "./addItem/addItem";
import {File} from "@ionic-native/file";
import {Media} from "@ionic-native/media";

@Component({
  selector: 'page-item',
  templateUrl: 'items.html'
})
export class ItemsPage {
  boardID: number;
  titleBoard: string;
  items:Array<Item>;
  position:number = 0;

  constructor(public database: DatabaseService, public modalCtrl: ModalController, public loading: LoadingProvider, public modeApp: KidProvider, public navParams: NavParams, public nav: NavController, public _ngZone: NgZone, public fileSystem: File, public media: Media, public platform: Platform) {
    this.items = [];
    this.boardID = navParams.get('boardID');
    this.titleBoard = navParams.get('titleBoard');
    this.loading.show('loading_items').then(() => {
      this.loadItems().then(() => {
        this.loading.dismiss();
      });
    })
  }

  loadItems() {
    return new Promise(success => {
      this.database.getItemsBoard(this.boardID).then((data:any) => {
        this._ngZone.run(() => {
          this.items = data;
          this.position = data.length;
          success();
        });
      });
    });
  }

  addItem() {
    this.nav.push(AddItemsPage, {'boardID': this.boardID, 'reloadItems': this});
  }

  getFullPathImage(path:string) {
    return (this.fileSystem.dataDirectory + "images/" + path).replace(/^file:\/\//, '');
  }

  getFullPathSound(path:string) {
    return ((this.platform.is('android') ? this.fileSystem.externalDataDirectory : this.fileSystem.dataDirectory) + "sounds/" + path).replace(/^file:\/\//, '');
  }

  playSound(path:string) {
    let sound = this.media.create(this.getFullPathSound(path));
    sound.play();
  }

  removeItemBoard(itemID:number) {
    this.database.removeItemBoard(itemID, this.boardID).then(() => {
      this.loadItems();
    })
  }

  ionViewDidEnter() {
    this.loadItems();
  }
}

