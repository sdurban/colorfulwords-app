import { Component } from '@angular/core';
import { DatabaseService} from "../../providers/DatabaseService";
import {ModalController, NavParams} from "ionic-angular";
import {LoadingProvider} from "../../providers/loadingprovider";
import {KidProvider} from "../../providers/KidProvider";

@Component({
  selector: 'page-item',
  templateUrl: 'items.html'
})
export class ItemsPage {
  boardID: number;
  titleBoard: string;
  items:Array<Item>;

  constructor(public database: DatabaseService, public modalCtrl: ModalController, public loading: LoadingProvider, public modeApp: KidProvider, public navParams: NavParams) {
    this.items = [];
    this.boardID = navParams.get('boardID');
    this.titleBoard = navParams.get('titleBoard');
    this.loading.show('').then(() => {
      this.loadItems(this.boardID).then(() => {
        this.loading.dismiss();
      });
    })
  }

  loadItems(boardID:number) {
    return new Promise(success => {
      this.database.getItemsBoard(boardID).then((data:any) => {
        this.items = data;
        success();
      });
    });
  }

  addItem() {

  }
}

