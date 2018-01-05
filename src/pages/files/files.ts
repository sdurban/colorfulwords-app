import { Component } from '@angular/core';
import {Nav, NavParams} from "ionic-angular";
import {SoundPage} from "./sound/sound";
import {ImagePage} from "./image/image";

@Component({
  selector: 'page-files',
  templateUrl: 'files.html'
})
export class FilesPage {
  constructor(public nav: Nav, public navParams: NavParams) { }

  /**
   * Loads SoundPage controller
   */
  goSound() {
    this.nav.push(SoundPage);
  }

  /**
   * Loads Image controller
   */
  goImage() {
    this.nav.push(ImagePage);
  }
}
