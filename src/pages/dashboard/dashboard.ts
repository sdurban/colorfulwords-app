import {Component, NgZone} from '@angular/core';
import { DatabaseService} from "../../providers/DatabaseService";
import {ModalController, Nav} from "ionic-angular";
import {AddBoardPage} from "./addBoard/addBoard";
import {LoadingProvider} from "../../providers/loadingprovider";
import {KidProvider} from "../../providers/KidProvider";
import {ItemsPage} from "../items/items";
import {File} from "@ionic-native/file";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  boards:Array<Board>;

  constructor(public database: DatabaseService, public modalCtrl: ModalController, public loading: LoadingProvider, public modeApp: KidProvider, public nav : Nav, public _ngZone: NgZone, public fileSystem: File) {
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
    return (this.fileSystem.dataDirectory + "images/" + path).replace(/^file:\/\//, '');
  }
}
