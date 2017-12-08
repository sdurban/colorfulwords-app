import { Component } from '@angular/core';
import { DatabaseService} from "../../providers/DatabaseService";
import {ModalController, Nav, NavParams} from "ionic-angular";
import {LoadingProvider} from "../../providers/loadingprovider";
import {KidProvider} from "../../providers/KidProvider";
import {AddItemsPage} from "./addItem/addItem";

@Component({
  selector: 'page-item',
  templateUrl: 'items.html'
})
export class ItemsPage {
  boardID: number;
  titleBoard: string;
  items:Array<Item>;

  constructor(public database: DatabaseService, public modalCtrl: ModalController, public loading: LoadingProvider, public modeApp: KidProvider, public navParams: NavParams, public nav: Nav) {
    this.items = [];
    this.boardID = navParams.get('boardID');
    this.titleBoard = navParams.get('titleBoard');
    this.loading.show('loading_items').then(() => {
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
    this.nav.push(AddItemsPage, {'boardID': this.boardID}).then(() => {
      this.loadItems(this.boardID);
    });
  }
}

