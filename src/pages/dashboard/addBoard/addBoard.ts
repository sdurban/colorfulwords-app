import {DatabaseService} from "../../../providers/DatabaseService";
import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";

@Component({
  selector: 'add-board',
  templateUrl: 'addboard.html'
})
export class AddBoardPage {
  board = { title: ''};

  constructor(public database: DatabaseService, public viewCtrl: ViewController) {

  }

  createBoard() {
    this.database.createBoard(this.board.title).then(() => {
      this.viewCtrl.dismiss();
    });
  }
}
