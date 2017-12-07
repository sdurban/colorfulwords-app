import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(private platform:Platform, private sqlite:SQLite) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'colorfultalk.db',
        location: 'default'
      })
        .then((db:SQLiteObject)=>{
          this.database = db;
          this.createTables().then(()=>{
            this.dbReady.next(true);
          });
        })

    });
  }

  private isReady(){
    return new Promise((resolve, reject) =>{
      if(this.dbReady.getValue()){
        resolve();
      }
      else{
        this.dbReady.subscribe((ready)=>{
          if(ready){
            resolve();
          }
        });
      }
    })
  }

  private createTables(){
    return new Promise(resolve => {
      this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS File (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_server INTEGER,
        type CHAR(5),
        title TEXT,
        path TEXT
      );`
        , {})
        .then(() => {
          this.database.executeSql(
            `CREATE TABLE IF NOT EXISTS Item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        field1 INTEGER,
        field2 INTEGER,
        FOREIGN KEY(field1) REFERENCES File(id),
        FOREIGN KEY(field2) REFERENCES File(id)
        );`, {}).then(() => {
            this.database.executeSql(
              `CREATE TABLE IF NOT EXISTS Board (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            dimension TEXT
            );`, {})
          }).then(() => {
            this.database.executeSql(
              `CREATE TABLE IF NOT EXISTS BoardItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            boardID INTEGER REFERENCES Board(id),
            itemID INTEGER REFERENCES Item(id),
            position INTEGER
            );`, {}).then(() => {
              resolve();
            })
          })
        }).catch((err) => console.log("Error detected creating tables", err));
    });
  }

  createBoard(title:string, dimension:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("INSERT INTO Board(title, dimension) VALUES (?, ?)", [title, dimension])
        .then(() => {
          return true;
        }).catch(err => {
          return false;
        })
    });
  }

  getAllBoards() {
    return this.isReady().then(() => {
      return this.database.executeSql("SELECT Board.*, File.path FROM Board" +
        " LEFT JOIN BoardItems ON BoardItems.boardID = Board.id AND position = 0" +
        " LEFT JOIN Item ON Item.id = BoardItems.itemID" +
        " LEFT JOIN File ON Item.field1 = File.id" +
        " ORDER BY title", {}).then(data => {
        let boards:Board[] = [];

        for(let i=0; i< data.rows.length; i++){
          let item:Board = <Board>{};
          item.id = data.rows.item(i).id;
          item.dimension = data.rows.item(i).dimension;
          item.title = data.rows.item(i).title;
          item.main_image = data.rows.item(i).path;

          boards.push(item);
        }

        return boards;
      }).catch(err => {
        return err;
      });
    })
  }

  getItemsBoard(board:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("SELECT Item.id, Item.title, FileImg.path as imgpath, FileSound.path as soundpath, BoardItems.position FROM  " +
        "BoardItems " +
        "LEFT JOIN Item ON BoardItems.itemID = Item.id " +
        "LEFT JOIN File AS FileImg ON Item.field1 = FileImg.id " +
        "LEFT JOIN File AS FileSound ON Item.field2 = FileSound.id " +
        "WHERE BoardItems.boardID = ? " +
        "ORDER BY BoardItems.position DESC", [board])
        .then(data => {
          let items:Item[] = [];

          for(let i=0; i < data.rows.length; i++) {
            let item:Item = <Item>{};

            item.id = data.rows.item(i).id;
            item.title = data.rows.item(i).title;
            item.imagePath = data.rows.item(i).imgpath;
            item.soundPath = data.rows.item(i).soundpath;
            item.order = data.rows.item(i).position;
          }

          return items;
        }).catch(err => {
          return err
      })
    })
  }

  deleteFile(id:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("DELETE FROM File WHERE id = ?", [id])
        .then(() => {
          return true;
        }).catch(err => {
          return false;
        })
    })
  }

  createItem(id_photo:number, id_sound:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("INSERT INTO Item(field1, field2) VALUES (?, ?)", [id_photo, id_sound])
        .then(() => {
          return true;
        }).catch(err => {
          return false;
        })
    });
  }


  deleteItem(id_photo:number, id_sound:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("DELETE FROM Item WHERE field1 = ? AND field2 = ?", [id_photo, id_sound])
        .then(() => {
          return true;
        }).catch((err) => {
          return err
        })
    })
  }

  getAllImages() {
    return this.isReady().then(() => {
      return this.database.executeSql("SELECT * FROM File WHERE type = 'IMAGE' ORDER BY title", {}).then(data => {
        let items:File[] = [];

        for(let i=0; i < data.rows.length; i++) {
          let item:File = <File>{};

          item.id = data.rows.item(i).id;
          item.title = data.rows.item(i).title;
          item.path = data.rows.item(i).path;
          item.type = data.rows.item(i).type;

          items.push(item);
        }

        return items;
      });
    });
  }

  getAllSounds() {
    return this.isReady().then(() => {
      return this.database.executeSql("SELECT * FROM File WHERE type = 'SOUND' ORDER BY title", {}).then(data => {
        let items:File[] = [];

        for(let i=0; i < data.rows.length; i++) {
          let item:File = <File>{};

          item.id = data.rows.item(i).id;
          item.title = data.rows.item(i).title;
          item.path = data.rows.item(i).path;
          item.type = data.rows.item(i).type;

          items.push(item);
        }

        return items;
      });
    });
  }

  createFile(name:string, path:string, type:string) {
    return this.isReady().then(() => {
      return this.database.executeSql("INSERT INTO File(id_server, type, title, path) VALUES (0, ?, ?, ?)", [type, name, path])
        .then(() => {
          return true;
        }).catch(err => {
          return false;
      })
    })
  }

  assignItemBoard(item:number, board:number, position:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("INSERT INTO BoardsItem(boardID, itemID, position) VALUES (?, ?, ?)", [item, board, position])
        .then(() => {
          return true;
        }).catch((err) => {
          return err
      })
    })
  }

  removeItemBoard(item:number, board:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("DELETE FROM BoardsItem WHERE boardID = ? AND itemID = ?", [item, board])
        .then(() => {
          return true;
        }).catch((err) => {
          return err
      })
    });
  }
}
