import { Component } from '@angular/core';
import { DatabaseService} from "../../providers/DatabaseService";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  boards:Array<Board>;

  constructor(public database: DatabaseService) {
    this.database.getAllBoards().then(data => {

    });
  }
}
