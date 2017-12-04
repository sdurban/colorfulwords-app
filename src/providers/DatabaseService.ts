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

  private createTables(){
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS File (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_server INTEGER,
        type CHAR(5),
        title TEXT,
        path TEXT
      );`
      ,{})
      .then(()=>{
        this.database.executeSql(
          `CREATE TABLE IF NOT EXISTS Item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        FOREIGN KEY(field1) REFERENCES File(id),
        FOREIGN KEY(field2) REFERENCES File(id)
        );`,{} ).then(() => {
          this.database.executeSql(
            `CREATE TABLE IF NOT EXISTS Board (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(2048),
            dimension CHAR(3)
            );`,{} )
        }).then(() => {
          this.database.executeSql(
            `CREATE TABLE IF NOT EXISTS BoardItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            boardID INTEGER REFERENCES Board(id),
            itemID INTEGER REFERENCES Item(id),
            position INTEGER
            );`,{} )
        })
      }).catch((err)=>console.log("Error detected creating tables", err));
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

  getAllFiles() {
    return new Promise((resolve, reject) => {
      this.database.executeSql("SELECT * FROM File ORDER BY name", {}).then(data => {
        resolve(data);
      }).catch(err => {
        reject(err);
      })
    });
  }

  getAllBoards() {
    return new Promise((resolve, reject) => {
      this.database.executeSql("SELECT * FROM Board ORDER BY title", {}).then(data => {
        resolve(data);
      }).catch(err => {
        reject(err);
      })
    })
  }

  getItemsBoard(board:number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql("SELECT Items.* FROM BoardItems, Items WHERE Items.id = BoardItems.itemID AND BoardItems.boardID = ? ORDER BY BoardItems.position DESC", [board])
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
      })
    })
  }

  getImage(item:number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql("SELECT File.* FROM File, Items WHERE Items.id = ? AND Items.field1 = File.id", [item])
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
      })
    });
  }

  getReferencedSound(item:number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql("SELECT File.* FROM File, Items WHERE Items.id = ? AND Items.field2 = File.id", [item])
        .then(data => {
          resolve(data);
        }).catch(err => {
        reject(err);
      })
    });
  }

  createFile(name:string, path:string, type:string) {
    return new Promise((resolve, reject) => {
      this.database.executeSql("INSERT INTO File(id_server, type, name, path) VALUES (0, ?, ?, ?)", [type, name, path])
        .then(() => {
          resolve();
        }).catch(err => {
          reject();
      })
    })
  }

  createItem(id_photo:number, id_sound:number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql("INSERT INTO Item(field1, field2) VALUES (?, ?)", [id_photo, id_sound])
        .then(() => {
          resolve();
        }).catch(err => {
          reject();
      })
    });
  }


  deleteItem(id_photo:number, id_sound:number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql("DELETE FROM Item WHERE field1 = ? AND field2 = ?", [id_photo, id_sound])
        .then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
      })
    })
  }

  assignItemBoard(item:number, board:number, position:number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql("INSERT INTO BoardsItem(boardID, itemID, position) VALUES (?, ?, ?)", [item, board, position])
        .then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
      })
    })
  }

  removeItemBoard(item:number, board:number) {
    return new Promise((resolve, reject) => {
      this.database.executeSql("DELETE FROM BoardsItem WHERE boardID = ? AND itemID = ?", [item, board])
        .then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
      })
    });
  }
}
