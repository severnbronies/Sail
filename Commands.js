const Command = require("./Ship/Command.js");
const Meets = require("./DataAccess/Meets.js");


const START_WELCOME_MESSAGE = `
Hello, I am SailBot, the helpbot for the severnbronies chat.
For a list of my commands try /help.
You can message me either in private or in @severnbronies
`;

function notImplemented(paramaters,message){
  Command.basicReply("Sorry but this method is not yet implemented.",message);
}


module.exports = function(commandSource){
  /*Commands TODO:
    nextMeet
    votes
  */

  //Start command
  new Command("start",commandSource)
    .addHandler(null,null,function(paramaters,message){
      Command.basicReply(START_WELCOME_MESSAGE,message);
    },Command.nArgs(0,1));

  //Upcoming command
  new Command("upcoming",commandSource)
    .addHandler("","Posts the next upcoming meet",function(parmaters,message){
      Meets.getUpcomingMeets().then(upcoming=>{
        let reply = upcoming.length?
          upcoming.map(m=>m.asMarkdown()).join("\n"):
          "They are no announced meets coming up";
        message.connection.sendMessage({
            chat_id:message.chat.id,
            //reply_to_message_id:message.message_id,
            parse_mode:"Markdown",
            text:reply,
            disable_web_page_preview:true,
            display_notification:true
          });
      });
    },Command.nArgs(0))
    .addHandler("_location(s)_","Filters the meets to the given locations",notImplemented,Command.atleastArgs(1));

  //Easter egg
  new Command("⬆⬆⬇⬇⬅➡⬅➡ba",commandSource)
    .addHandler(null,null,function(paramaters,message){
      message.connection.sendPhoto({
        chat_id:message.chat.id,
        photo:"https://derpicdn.net/img/view/2015/7/11/934995.png",
        caption:"Do ships need sails?"
      });
    },Command.nArgs(0));
};
