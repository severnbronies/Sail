const EventEmitter = require('events');

class PollSource extends EventEmitter {
  constructor(connection){
    super();
    this.connection = connection;
    this.timeout = 500;
    this.polling = false;
    this.lastMessageId = null;
  }

  start(){
    if(!this.polling){
      this.polling = true;
      this.pollForever();
    }
  }

  stop(){
    if(!this.polling){
      this.polling = false;
    }
  }

  pollForever(){
    if(this.polling){
      this.poll().then(this.pollForever.bind(this));
    }
  }

  poll(){
    return this.connection.getUpdates({
      offset:this.lastMessageId+1,
      timeout:this.timeout
    }).then(updates=>updates.forEach(this.emitUpdate.bind(this)))
    .catch(console.error.bind(console));
  }

  emitUpdate(update){
    const messageType = Object.keys(update).find(n=>n !== "update_id");
    const message = update[messageType];
    const messageId = update.update_id;
    if(messageId > this.lastMessageId){
      this.lastMessageId=messageId;
    }
    message.update_id = messageId;
    message.connection = this.connection;
    this.emit(messageType,message);
  }
}
module.exports = PollSource;
