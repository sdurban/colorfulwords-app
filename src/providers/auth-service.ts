import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { ServerProvider } from "./serverprovider";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthService {
  currentUser: User;

  constructor(private serverProvider: ServerProvider) { }

  public login(credentials) {
    //TODO: ADD empty values
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("missingdata_string");
    } else {
      return Observable.create(observer => {
        this.serverProvider.login(credentials)
          .then((response) => {
            this.currentUser = new User(response['name'], response['email']);
            observer.next(true);
            observer.complete();
          })
          .catch((reject) => {
            Observable.throw("errorlogin_string");
        });
      });
    }
  }

  public register(credentials) {
    //TODO: ADD empty values
    if (credentials.email === null || credentials.email == "" || credentials.password === null || credentials.repeatpassword == null) {
      return Observable.throw("missingdata_string");
    } else if (credentials.password != credentials.repeatpassword) {
      return Observable.throw("passwordmissmatch_string");
    } else {
      return Observable.create(observer => {
        this.serverProvider.register(credentials)
          .then(response => {
            this.currentUser = new User('', credentials['email']);
            observer.next(true);
            observer.complete();
          })
          .catch(reject => {
            Observable.throw("errorregister_string");
          });
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
