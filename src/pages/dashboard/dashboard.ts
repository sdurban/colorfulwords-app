import {Component, NgZone} from '@angular/core';
import { DatabaseService} from "../../providers/DatabaseService";
import {LoadingController, ModalController, Nav, Platform} from "ionic-angular";
import {AddBoardPage} from "./addBoard/addBoard";
import {LoadingProvider} from "../../providers/loadingprovider";
import {KidProvider} from "../../providers/KidProvider";
import {ItemsPage} from "../items/items";
import {File} from "@ionic-native/file";
import {ServerProvider} from "../../providers/serverprovider";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  boards:Array<Board>;

  constructor(public serverprovider: ServerProvider, public database: DatabaseService, public modalCtrl: ModalController, public loading: LoadingProvider, public modeApp: KidProvider, public nav: Nav, public _ngZone: NgZone, public fileSystem: File, public loadingCtrl: LoadingController, public platform: Platform) {
    this.boards = [];
    this.loading.show('board_loading').then(() => {
      this.loadBoards().then(() => {
        this.loading.dismiss();
      });
    })
  }

  addBoard() {
    let addBoardModal = this.modalCtrl.create(AddBoardPage);

    addBoardModal.onDidDismiss(() => {
      this.loadBoards();
    });

    addBoardModal.present();
  }

  loadBoards() {
    this.boards = [];
    return new Promise((resolve, reject) => {
      this.database.getAllBoards().then((data:any) => {
        this._ngZone.run(() => {
          this.boards = data;
          resolve();
        });
      });
    })
  }

  goBoard(boardID:number, boardName:string) {
    this.nav.push(ItemsPage, {'boardID': boardID, 'titleBoard': boardName});
  }

  getFullPathImage(path:string) {
    return ((this.platform.is('android') ? this.fileSystem.externalDataDirectory : this.fileSystem.dataDirectory) + "images/" + path).replace(/^file:\/\//, '');
  }

  ionViewDidEnter() {
    this.loadBoards();
  }

  syncData() {

  }
}
