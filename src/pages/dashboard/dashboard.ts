import { Component } from '@angular/core';
import { DatabaseService} from "../../providers/DatabaseService";
import {ModalController} from "ionic-angular";
import {AddBoardPage} from "./addBoard/addBoard";
import {LoadingProvider} from "../../providers/loadingprovider";
import {KidProvider} from "../../providers/KidProvider";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  boards:Array<Board>;

  constructor(public database: DatabaseService, public modalCtrl: ModalController, public loading: LoadingProvider, public modeApp: KidProvider) {
    this.boards = [];
    this.loading.show('board_loading').then(() => {
      this.loadBoards().then(() => {
        this.loading.dismiss();
      });
    })
  }

  addBoard() {
    let addBoardModal = this.modalCtrl.create(AddBoardPage);

    addBoardModal.present().then(() => {
      this.loading.show('board_reloading').then(() => {
        this.loadBoards().then(() => {
          this.loading.dismiss();
        });
      });
    });
  }

  loadBoards() {
    return new Promise((resolve, reject) => {
      this.database.getAllBoards().then((data:any) => {
        this.boards = data;
      });
    })
  }
}

