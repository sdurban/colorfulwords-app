import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {File} from "@ionic-native/file";
import {Media} from "@ionic-native/media";
import {DatabaseService} from "../../../providers/DatabaseService";

@Component({
  selector: 'add-items',
  templateUrl: 'addItem.html'
})
export class AddItemsPage {
  readonly path:string;
  image = { id: '', title: '', path: ''};
  sound = { id: '', title: '', path: ''};

  constructor(public database: DatabaseService, public viewCtrl: ViewController, public fileSystem: File, public media: Media) {
    this.path = this.fileSystem.dataDirectory;
  }
}
