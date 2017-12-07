import { Component } from '@angular/core';
import {Nav, NavParams} from "ionic-angular";
import {DatabaseService} from "../../../providers/DatabaseService";

@Component({
  selector: 'page-sound',
  templateUrl: 'sound.html'
})
export class SoundPage {
  sound:File[];

  constructor(public databaseService: DatabaseService, public navParams: NavParams, public nav: Nav) {

  }

  loadSound() {

  }

  addSound() {

  }
}

