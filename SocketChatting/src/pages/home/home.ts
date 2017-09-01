import { Component,ViewChild } from '@angular/core';
import { NavController , Platform ,NavParams,Events,Content} from 'ionic-angular';
import { UtilitesProvider } from '../../providers/utilites/utilites';

declare var io;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  socketHost;
  socket;
  message;
  toUserId;
  messages :any= [];
  loginUser;
  typingMessage;
  typing = false;
  constructor(public navCtrl: NavController,
    public platform:Platform,
    public navParams : NavParams,
    public utilites:UtilitesProvider,
    public events:Events) {
     this.socketHost = "http://192.168.1.117:3000";
     this.platform.ready().then(()=>{
       this.toUserId = this.navParams.get('toUserId');
       this.loginUser = this.utilites.getLoginUser();
       this.events.subscribe('chating',(data)=>{
          console.log(this.toUserId)
          console.log(data.receiverId)
         if(data.senderId == this.toUserId ){
           this.messages.push(data);
           this.scrollBottom();
         }
       })
       this.socket = this.utilites.getSocketRef();
       this.socket.on('start_typing',(data)=>{
         if(data.senderId == this.toUserId ){
           this.typing = true;
         }
       })
       this.socket.on('stop_typing',(data)=>{
         if(data.senderId == this.toUserId ){
           this.typing = false;
         }
       })
        //  this.socket = io(this.socketHost);
        //  this.socket.on("chat_message", (msg) => {
        //       alert('mssg'+msg)
        //   });
     })
  }
  scrollBottom() {
    var that = this;
    setTimeout(function() {
      that.content.scrollToBottom();
    }, 300);
  }
  send(message) {
      if(message && message != "") {
          let tempData = { senderId : this.loginUser,receiverId:this.toUserId,message:message};
          this.messages.push(tempData);
          this.scrollBottom();
          this.socket.emit("chating", tempData);
      }
      this.message = "";
  }

  isTyping(){
    this.socket.emit('start_typing',{senderId:this.loginUser,receiverId:this.toUserId})
    if(this.typingMessage){
      clearTimeout(this.typingMessage)
    }
    this.typingMessage = setTimeout(()=>{
     this.socket.emit('stop_typing',{senderId:this.loginUser,receiverId:this.toUserId})
   },2000)


  }

}
