import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { ServerProvider } from "./serverprovider";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {Storage} from "@ionic/storage";

@Injectable()
export class AuthService {
  constructor(public serverProvider: ServerProvider, public storage: Storage) { }

  /**
   * Function responsible of validating data and call login service.
   *
   * @param credentials
   */
  public login(credentials) {
    if (credentials.email === null || credentials.email == "" || credentials.password === null || credentials.password == "" ) {
      return Observable.throw("missingdata_string");
    } else {
      return Observable.create(observer => {
        this.serverProvider.login(credentials)
          .then((response) => {
            this.storage.set('user_email', credentials['email']).then(() => {
              observer.next(true);
              observer.complete();
            });
          })
          .catch((reject) => {
            observer.next(false);
            observer.complete();
        });
      });
    }
  }

  /**
   * Function responsible of validating data and call register service.
   *
   * @param credentials
   */
  public register(credentials) {
    if (credentials.email === null || credentials.email == "" || credentials.password === null || credentials.password === "" || credentials.repeatpassword == null || credentials.repeatpassword == "") {
      return Observable.throw("missingdata_string");
    } else if (credentials.password != credentials.repeatpassword) {
      return Observable.throw("passwordmissmatch_string");
    } else {
      return Observable.create(observer => {
        this.serverProvider.register(credentials)
          .then(response => {
            this.storage.set('user_email', credentials['email']).then(() => {
              observer.next(true);
              observer.complete();
            });
          })
          .catch(reject => {
            observer.next(false);
            observer.complete();
          });
      });
    }
  }

  /**
   * Returns user email.
   *
   * @returns {Promise}
   */
  public getUserInfo() {
    return new Promise((success) => {
      this.storage.get('user_email').then(data => {
        return success(data);
      })
    });
  }

  /**
   * Logout the current user.
   */
  public logout() {
    return Observable.create(observer => {
      this.storage.remove("user_email").then(() => {
        this.storage.remove('bearer').then(() => {
          observer.next(true);
          observer.complete();
        });
      });
    });
  }
}
