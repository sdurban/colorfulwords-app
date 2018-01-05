import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  /**
   * Creates the database and tables.
   *
   * @param {Platform} platform
   * @param {SQLite} sqlite
   */
  constructor(private platform:Platform, private sqlite:SQLite) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'colorfultalk.db',
        location: 'default'
      })
        .then((db:SQLiteObject) => {
          this.database = db;
          this.createTables().then(() => {
            this.dbReady.next(true);
          });
        })

    });
  }

  /**
   * Checks if database is ready (is created and has tables created)
   *
   * @returns {Promise}
   */
  private isReady(){
    return new Promise((resolve, reject) => {
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

  /**
   * Creates all database tables
   *
   * @returns {Promise}
   */
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
        id_server INTEGER,
        title TEXT,
        field1 INTEGER,
        field2 INTEGER,
        FOREIGN KEY(field1) REFERENCES File(id),
        FOREIGN KEY(field2) REFERENCES File(id)
        );`, {}).then(() => {
            this.database.executeSql(
              `CREATE TABLE IF NOT EXISTS Board (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_server INTEGER,
            title TEXT
            );`, {})
          }).then(() => {
            this.database.executeSql(
              `CREATE TABLE IF NOT EXISTS BoardItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_server INTEGER,
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

  /**
   * Updates File id_server from given id
   *
   * @param {number} id
   * @param {number} id_server
   * @returns {Promise<void>}
   */
  updateFileUpload(id:number, id_server:number) {
    return this.isReady().then(() => {
      this.database.executeSql("UPDATE File SET id_server = ? WHERE id = ?", [id_server, id]).then(() => {
        return true;
      }).catch(err => {
        return false;
      });
    })
  }

  /**
   * Updates Item id_server from given id
   *
   * @param {number} id
   * @param {number} id_server
   * @returns {Promise<void>}
   */
  updateItemUpload(id:number, id_server:number) {
    return this.isReady().then(() => {
      this.database.executeSql("UPDATE Item SET id_server = ? WHERE id = ?", [id_server, id]).then(() => {
        return true;
      }).catch(err => {
        return false;
      });
    })
  }

  /**
   * Updates Board id_server from given id
   *
   * @param {number} id
   * @param {number} id_server
   * @returns {Promise<void>}
   */
  updateBoard(id:number, id_server:number) {
    return this.isReady().then(() => {
      this.database.executeSql("UPDATE Board SET id_server = ? WHERE id = ?", [id_server, id]).then(() => {
        return true;
      }).catch(err => {
        return false;
      });
    })
  }

  /**
   * Updates BoardItems id_server from given id
   *
   * @param {number} id
   * @param {number} id_server
   * @returns {Promise<void>}
   */
  updateBoardItems(id:number, id_server:number) {
    return this.isReady().then(() => {
      this.database.executeSql("UPDATE BoardItems SET id_server = ? WHERE id = ?", [id_server, id]).then(() => {
        return true;
      }).catch(err => {
        return false;
      });
    })
  }

  /**
   * Inserts new board with given title.
   *
   * @param {string} title
   * @returns {Promise<boolean>}
   */
  createBoard(title:string) {
    return this.isReady().then(() => {
      return this.database.executeSql("INSERT INTO Board(title) VALUES (?)", [title])
        .then(() => {
          return true;
        }).catch(err => {
          return false;
        })
    });
  }

  /**
   * Return all boards with first item and files in it.
   *
   * @returns {Promise<Board[]>}
   */
  getAllBoards() {
    return this.isReady().then(() => {
      return this.database.executeSql("SELECT Board.*, File.path, MIN(BoardItems.id) FROM Board" +
        " LEFT JOIN BoardItems ON BoardItems.boardID = Board.id" +
        " LEFT JOIN Item ON Item.id = BoardItems.itemID" +
        " LEFT JOIN File ON Item.field1 = File.id" +
        " GROUP BY Board.id" +
        " ORDER BY title", {}).then(data => {
        let boards:Board[] = [];

        for(let i=0; i< data.rows.length; i++){
          let item:Board = <Board>{};
          item.id = data.rows.item(i).id;
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

  /**
   * Returns all items from a given boardid.
   *
   * @param {number} board
   * @returns {Promise<Item[]>}
   */
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

            items.push(item);
          }

          return items;
        }).catch(err => {
          return err
      })
    })
  }

  /**
   * Deletes File with given id.
   *
   * @param {number} id
   * @returns {Promise<boolean>}
   */
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

  /**
   * Creates item with given parameters
   *
   * @param {string} title
   * @param {number} id_photo
   * @param {number} id_sound
   * @returns {Promise}
   */
  createItem(title:string, id_photo:number, id_sound:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("INSERT INTO Item(title, field1, field2) VALUES (?, ?, ?)", [title, id_photo, id_sound])
        .then((results) => {
          return results.insertId;
        }).catch(err => {
          return false;
        })
    });
  }

  /**
   * Get all files in the app.
   *
   * @returns {Promise<FileModel[]>}
   */
  getAllFiles() {
    return this.isReady().then(() => {
      return this.database.executeSql("SELECT * FROM File ORDER BY title", {}).then(data => {
        let items:FileModel[] = [];

        for(let i=0; i < data.rows.length; i++) {
          let item:FileModel = <FileModel>{};

          item.id = data.rows.item(i).id;
          item.id_server = data.rows.item(i).id_server;
          item.title = data.rows.item(i).title;
          item.path = data.rows.item(i).path;
          item.type = data.rows.item(i).type;

          items.push(item);
        }

        return items;
      });
    });
  }

  /**
   * Get single file from given id.
   *
   * @param {number} id
   * @returns {Promise<FileModel[]>}
   */
  getFile(id:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("SELECT * FROM File WHERE id = ? ORDER BY title", [id]).then(data => {
        let items:FileModel[] = [];

        for(let i=0; i < data.rows.length; i++) {
          let item:FileModel = <FileModel>{};

          item.id = data.rows.item(i).id;
          item.id_server = data.rows.item(i).id_server;
          item.title = data.rows.item(i).title;
          item.path = data.rows.item(i).path;
          item.type = data.rows.item(i).type;

          items.push(item);
        }

        return items;
      });
    });
  }

  /**
   * Get alls images in the app
   *
   * @returns {Promise<FileModel[]>}
   */
  getAllImages() {
    return this.isReady().then(() => {
      return this.database.executeSql("SELECT * FROM File WHERE type = 'IMAGE' ORDER BY title", {}).then(data => {
        let items:FileModel[] = [];

        for(let i=0; i < data.rows.length; i++) {
          let item:FileModel = <FileModel>{};

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

  /**
   * Get all sounds in the app
   *
   * @returns {Promise<FileModel[]>}
   */
  getAllSounds() {
    return this.isReady().then(() => {
      return this.database.executeSql("SELECT * FROM File WHERE type = 'SOUND' ORDER BY title", {}).then(data => {
        let items:FileModel[] = [];

        for(let i=0; i < data.rows.length; i++) {
          let item:FileModel = <FileModel>{};

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

  /**
   * Creates a files with given parameters
   *
   * @param {string} name
   * @param {string} path
   * @param {string} type
   * @param {number} id_server
   * @returns {Promise<boolean>}
   */
  createFile(name:string, path:string, type:string, id_server:number = 0) {
    return this.isReady().then(() => {
      return this.database.executeSql("INSERT INTO File(id_server, type, title, path) VALUES (?, ?, ?, ?)", [id_server, type, name, path])
        .then(() => {
          return true;
        }).catch(err => {
          return false;
      })
    })
  }

  /**
   * Assigns custom itemID to a board.
   *
   * @param {number} item
   * @param {number} board
   * @param {number} position
   * @returns {Promise<boolean>}
   */
  assignItemBoard(item:number, board:number, position:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("INSERT INTO BoardItems(boardID, itemID, position) VALUES (?, ?, ?)", [board, item, position])
        .then(() => {
          return true;
        }).catch((err) => {
          return err
      })
    })
  }

  /**
   * Removes given itemid from board.
   *
   * @param {number} item
   * @param {number} board
   * @returns {Promise<void>}
   */
  removeItemBoard(item:number, board:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("DELETE FROM BoardItems WHERE boardID = ? AND itemID = ?", [board, item])
        .then(() => {
          this.deleteItem(item).then(() => {
            return true;
          })
        }).catch((err) => {
          return err
      })
    });
  }

  /**
   * Deletes item from database.
   *
   * @param {number} itemID
   * @returns {Promise<boolean>}
   */
  deleteItem(itemID:number) {
    return this.isReady().then(() => {
      return this.database.executeSql("DELETE FROM Item WHERE id = ?", [itemID])
        .then(() => {
          return true;
        }).catch((err) => {
          return err
        })
    })
  }

  /**
   * Delete all information from all tables.
   *
   * @returns {Promise<void>}
   */
  deleteAll() {
    return this.isReady().then(() => {
      return this.database.executeSql("DELETE FROM BoardItems", []).then(() => {
        this.database.executeSql("DELETE FROM Board", []).then(() => {
          this.database.executeSql("DELETE FROM Item", []).then(() => {
            this.database.executeSql("DELETE FROM File", []).then(() => {
              return true;
            })
          })
        })
      })
    })
  }
}
