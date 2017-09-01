import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Platform,Events} from 'ionic-angular';
import { HomePage } from '../home/home';
import { UtilitesProvider } from '../../providers/utilites/utilites';
import { Http } from '@angular/http';

/**
 * Generated class for the UsersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  userData:any = [];
  socket;
  loginUser ;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform :Platform,
    public utilites:UtilitesProvider,
    public http:Http,
    public events:Events) {
    this.platform.ready().then(()=>{
      this.socket = this.utilites.getSocketRef();
      this.loginUser = this.utilites.getLoginUser();
      console.log("====this.loginUser ====",this.loginUser)
      this.getUserData();
      this.socket.on("chating", (msg) => {
            console.log("chating",msg);
            this.events.publish('chating',msg)
      });
      this.socket.on("newUser", () => {
          this.getUserData();
      });
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
  }

  chat(toUserId){
    this.navCtrl.push(HomePage,{toUserId:toUserId})
  }

  getUserData(){
    this.http.get('http://192.168.1.117:3000/getUser').map(res => res.json()).subscribe(data => {
      console.log("==data",data)
      // this.userData =data;

      for(let i=0;i<data.length;i++){
        if(data[i] !== this.loginUser){
            this.userData.push(data[i])
        }
      }

    },(err)=>{
    });
  }
}
