import { Component } from '@angular/core';
import { DatabaseService} from "../../providers/DatabaseService";
import {ModalController} from "ionic-angular";
import {AddBoardPage} from "./addBoard/addBoard";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  boards:Array<Board>;

  constructor(public database: DatabaseService, public modalCtrl: ModalController) {
    this.database.getAllBoards().then(data => {

    });
  }

  addBoard() {
    let addBoardModal = this.modalCtrl.create(AddBoardPage);

    addBoardModal.present();
  }
}

