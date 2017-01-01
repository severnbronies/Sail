const Command = require("../Command.js");
const config = require("../../config.json");

const exec = require('child_process').exec;

let gitVersion;
exec('git describe', function callback(error, stdout){
   gitVersion = stdout.trim();
});

const reportString = (function(){
  if(!config.admin.issues && !config.admin.creator){
    return;
  }
  let reportString = "Report issues ";
  if(config.admin.issues){
    reportString += `on the [issue tracker](${config.admin.issues})`;
    if(config.admin.creator){
      reportString += " or ";
    }
  }
  if(config.admin.creator){
    reportString += `by contacting ${config.admin.creator}`;
  }
  return reportString;
})();

const aboutString = config.about.repo?`Visit the [project repo](${config.about.repo}) for more information`:undefined;

const strings = [aboutString,reportString].filter(n=>n!==undefined).join("\n");

const aboutCommand = new Command()
.addHandler("","Displays information about the bot",
  function(_,message){
    message.connection.sendMessage({
      chat_id:message.chat.id,
      parse_mode:"Markdown",
      text:`${config.about.botName} v${gitVersion}.\n${strings}`,
      disable_web_page_preview:true,
      display_notification:true
    });
  },Command.nArgs(0));


module.exports = aboutCommand;
