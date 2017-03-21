const fetch = require("node-fetch");

const ENDPOINT = "https://api.telegram.org/bot";

class Connection {
  constructor(botId,botKey){
    this.botId = botId;
    this.botKey = botKey;
  }

  //TODO: raise erros when there is a connection issue
  fireRequest(method,request){
    return fetch(`${ENDPOINT}${this.botId}:${this.botKey}/${method}`,{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify(request)
    }).then(r=>r.json()).then(r=>{
      if(r.ok){
        return r.result;
      }
      throw {
	        error_code:r.error_code,
        description:r.description
      };
    });
  }
}

[
  "getMe",
  "getUpdates",
  "sendMessage",
  "Formatting options",
  "forwardMessage",
  "sendPhoto",
  "sendAudio",
  "sendDocument",
  "sendSticker",
  "sendVideo",
  "sendVoice",
  "sendLocation",
  "sendVenue",
  "sendContact",
  "sendChatAction",
  "getUserProfilePhotos",
  "getFile",
  "kickChatMember",
  "leaveChat",
  "unbanChatMember",
  "getChat",
  "getChatAdministrators",
  "getChatMembersCount",
  "getChatMember"
].forEach(method=>Connection.prototype[method]=function(request){
  return this.fireRequest(method,request);
});

module.exports=Connection;
