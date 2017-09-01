import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , Platform} from 'ionic-angular';
declare var io;
import { UsersPage} from '../users/users';
import { UtilitesProvider } from '../../providers/utilites/utilites';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  socketHost;
  socket;
  userName;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public utilites : UtilitesProvider) {
    this.socketHost = "http://192.168.1.117:3000";
    this.platform.ready().then(()=>{
      this.socket = io(this.socketHost);
      this.utilites.setSocketRef(this.socket)

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    this.socket.emit("register",this.userName,(callback)=>{
        if(callback){
          this.utilites.setLoginUser(this.userName)
          this.navCtrl.setRoot(UsersPage);
        }else{
          alert("User exits")
        }
    })
  }

}
