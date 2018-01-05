import { ENV } from '@app/env';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import {Device} from "@ionic-native/device";
import {DatabaseService} from "./DatabaseService";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {LoadingController, Platform} from "ionic-angular";

@Injectable()
export class ServerProvider {
  urlAPI = ENV.apiURL;
  headers:HttpHeaders;

  constructor(private storage: Storage, private http: HttpClient, private device: Device, private database: DatabaseService, private transfer: FileTransfer, private fileSystem: File, private platform: Platform) {
    this.headers = new HttpHeaders();
    storage.get('bearer').then((bearer) => {
      if(bearer) {
        let info = bearer;
        this.headers = this.headers.append('Authorization', 'Bearer '+info);
      }
      if((<any>window).cordova) {
        this.headers.append('MachineDescription', this.device.manufacturer+this.device.model);
      } else {
        this.headers.append('MachineDescription', 'BrowserDemo');
      }
    });
  }

  /**
   * Handles calls to login service and records bearer returned.
   *
   * @param credentials
   * @returns {Promise} Current response
   */
  login(credentials) {
    return new Promise((resolve, reject) => {
      this.http.post(this.urlAPI+'user/login', JSON.stringify(credentials), {headers: this.headers}).subscribe(data => {
        if(data['error'] == 0) {
          this.headers = this.headers.append('Authorization', 'Bearer '+data['msg']['dataToken']);
          this.storage.set('bearer', data['msg']['dataToken']).then(() => {
            resolve(true);
          });
        } else {
          reject(-1);
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          reject(err.error.message);
        } else {
          reject(err.status);
        }
      });
    });
  }

  /**
   * Handles calls to register service and records bearer returned.
   *
   * @param credentials
   * @returns {Promise}
   */
  register(credentials) {
    return new Promise((resolve, reject) => {
      this.http.post(this.urlAPI+'user/register', JSON.stringify(credentials), {headers: this.headers}).subscribe(data => {
        if(data['error'] == 0) {
          this.storage.set('bearer', data['msg']['dataToken']).then(() => {
            resolve(true);
          });
        } else {
          reject(-1);
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
          reject(err.error.message);
        } else {
          // The backend returned an unsuccessful response code.¡
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          reject(err.status);
        }
      });
    });
  }

  /**
   * Starts the syncing process.
   *
   * @param {LoadingController} loading
   * @returns {Promise}
   */
  sync(loading:LoadingController) {
    return new Promise(resolve => {
      let loader = loading.create({
        content: 'Syncing your data...'
      });
      loader.present();
      this.syncfiles(loader).then(data => {
        resolve();
        /*this.syncboards().then(data => {
          resolve();
        })*/
      })
    });
  }

  /**
   * Syncs the files, first make a call to see diferences between app and server then download missing data,
   * and finish uploading missing data in server.
   * @param loader
   * @returns {Promise<any>}
   */
  private syncfiles(loader) {
    return new Promise((resolve, reject) => {
      this.database.getAllFiles().then(files => {
        let dataFiles:object = {files: files};
        this.http.post(this.urlAPI + 'update/syncfiles', JSON.stringify(dataFiles), {headers: this.headers}).subscribe(data => {
          loader.setContent("Downloading data from server...");
          this.downloadfiles(loader, data['msg']['download']).then(() => {
            loader.setContent("Uploading data from server...");
            this.uploadfile(loader, data['msg']['upload']).then(() => {
              loader.dismiss();
            })
          })
        });
      });
    });
  }

  /**
   * Takes an array of items to download and resolve recursively. First download first item and then call itself with
   * shifted array of items.
   *
   * @param loader Loading message context
   * @param arr_download Array with items to download
   * @param resolve promise result passed for recursivity.
   */
  private downloadfiles(loader, arr_download, resolve = null) {
    if(resolve == null) {
      return new Promise((resolve, reject) => {
        this.downloadfiles(loader, arr_download, resolve);
      });
    }
    if(arr_download.length == 0) {
      return resolve();
    }

    let file = arr_download[0];

    loader.setContent("Downloading file " + file.name + "...");

    let fileTransfer: FileTransferObject = this.transfer.create();

    let filePath:string = this.fileSystem.dataDirectory;

    if(this.platform.is('android')) {
      filePath = this.fileSystem.externalDataDirectory;
    } else {
      filePath = this.fileSystem.dataDirectory;
    }

    if(file.type == 'IMAGE') {
      filePath = filePath + '/images/';
    } else {
      filePath = filePath + '/sounds/';
    }


    fileTransfer.onProgress((data) => {
      loader.setContent("Downloading file " + file.name + Math.ceil((data.loaded / data.total) * 100) +" %")
    });

    filePath = filePath + file.path;

    fileTransfer.download(this.urlAPI + 'update/download/'+file.id, filePath, true, {headers: {
        "Authorization": this.headers.get('Authorization')
      }}).then(() => {
        this.database.createFile(file.name, file.path, file.type, file.id).then(() => {
          arr_download.shift();
          this.downloadfiles(loader, arr_download, resolve);
        })
    })
  }

  /**
   * Takes an array of items to upload and resolve recursively. First upload first item and then call itself with
   * shifted array of items.
   *
   * @param loader Loading message context
   * @param arr_upload Array with items to upload
   * @param resolve promise result passed for recursivity.
   */
  private uploadfile(loader, arr_upload, resolve = null) {
    if(resolve == null) {
      return new Promise((resolve, reject) => {
        this.uploadfile(loader, arr_upload, resolve);
      });
    }
    if(arr_upload.length == 0) {
      return resolve();
    }
    this.database.getFile(arr_upload[0]).then(data => {
      let files:FileModel[] = data;
      let file = files[0];

      let options:FileUploadOptions = {
        fileKey: 'files',
        fileName: file.path,
        headers: {
          "Authorization": this.headers.get('Authorization')
        },
        chunkedMode: false
      };


      loader.setContent("Uploading file " + file.title + "...");

      let fileTransfer: FileTransferObject = this.transfer.create();

      let filePath:string = "";

      if(this.platform.is('android')) {
        filePath = this.fileSystem.externalDataDirectory;
      } else {
        filePath = this.fileSystem.dataDirectory;
      }

      if(file.type == 'IMAGE') {
        filePath = filePath + '/images/';
      } else {
        filePath = filePath + '/sounds/';
      }

      filePath = filePath + file.path;

      fileTransfer.onProgress((data) => {
        loader.setContent("Uploading file " + file.title + Math.ceil((data.loaded / data.total) * 100) +" %")
      });

      fileTransfer.upload(filePath, this.urlAPI + 'update/upload', options).then((data) => {
        this.http.post(this.urlAPI + 'update/uploadassignid', JSON.stringify(file), {headers: this.headers}).subscribe(data => {
          this.database.updateFileUpload(file.id, data['msg']['id_server']).then(data => {
            arr_upload.shift();
            this.uploadfile(loader, arr_upload, resolve);
          })
        })
      });

    });
  }

  /*private syncboards() {
   return new Promise((resolve, reject) => {
      this.syncfiles().then(data => {
        resolve();
      })
   });
  } */
}
