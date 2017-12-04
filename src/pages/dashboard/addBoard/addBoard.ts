import {DatabaseService} from "../../../providers/DatabaseService";
import {Component} from "@angular/core";

@Component({
  selector: 'add-board',
  templateUrl: 'addboard.html'
})
export class AddBoardPage {
  board = { title: '', dimension: 0};

  constructor(public database: DatabaseService) {

  }

  createBoard() {
    this.database.createBoard(this.board.title, this.board.dimension).then(() => {

    });
  }
}
