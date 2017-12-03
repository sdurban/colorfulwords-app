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
        name TEXT,
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

  }

  getAllBoards() {

  }

  getFileBoards(board:number) {

  }

  getReferencedSound(item:number) {

  }

  createFile(name:string, path:string, type:string) {

  }

  createItem(id_photo:number, id_sound:number) {

  }

  deleteItem(id_photo:number, id_sound:number) {

  }

  assignItemBoard(item:number) {

  }

  removeItemBoard(item:number) {

  }
}
