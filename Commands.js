const Command = require("./Ship/Command.js");

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
    .addHandler("","Posts the next upcoming meet",notImplemented,Command.nArgs(0))
    .addHandler("{location}...","Posts the next upcoming meet at any of the given locations",notImplemented,Command.atleastArgs(1));

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
