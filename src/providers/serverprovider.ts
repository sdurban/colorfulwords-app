import { ENV } from '@app/env';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";
import {Device} from "@ionic-native/device";

@Injectable()
export class ServerProvider {
  urlAPI = ENV.apiURL;
  headers:HttpHeaders;

  constructor(private storage: Storage, private http: HttpClient, private device: Device) {
    this.headers = new HttpHeaders();
    storage.get('bearer').then((bearer) => {
      if(bearer) {
        let info = bearer;
        this.headers.append('Authorization', 'Bearer '+info);
      }
      if((<any>window).cordova) {
        this.headers.append('MachineDescription', this.device.manufacturer+this.device.model);
      } else {
        this.headers.append('MachineDescription', 'BrowserDemo');
      }
    });
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
      this.http.post(this.urlAPI+'user/login', JSON.stringify(credentials), {headers: this.headers}).subscribe(data => {
        if(data['error'] == 0) {
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
}
