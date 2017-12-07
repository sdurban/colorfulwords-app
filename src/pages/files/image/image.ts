import { Component } from '@angular/core';
import {Nav, NavParams} from "ionic-angular";
import {DatabaseService} from "../../../providers/DatabaseService";

@Component({
  selector: 'page-image',
  templateUrl: 'image.html'
})
export class ImagePage {
  images:File[];

  constructor(public databaseService: DatabaseService, public navParams: NavParams, public nav: Nav) {

  }

  loadImages() {

  }

  addImage() {

  }
}

