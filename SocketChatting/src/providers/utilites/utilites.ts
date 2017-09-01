import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the UtilitesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UtilitesProvider {
  socket;
  loginUser;
  constructor(public http: Http) {
    console.log('Hello UtilitesProvider Provider');
  }

  setSocketRef(val){
    this.socket = val
  }

  getSocketRef(){
    return this.socket
  }

  setLoginUser(val){
    this.loginUser = val;
  }

  getLoginUser(){
    return this.loginUser;
  }

}
