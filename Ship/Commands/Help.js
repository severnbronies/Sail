const Command = require("../Command.js");

helpCommand = new Command()
.addHandler("","Lists help on all commands",
  function(_,message){
    let commandNames = Object.keys(this.commandSource.bindings),
        result = "";
    commandNames.forEach(name=>{
      let info = buildDesciptions(name,this.commandSource.bindings[name],true);
      if(info){
        result += info;
      }
    });
    Command.basicReply(result,message);
  },Command.nArgs(0))

.addHandler("_command_","Lists detailed help for the given command",
  function(paramaters,message){
    let commandName = paramaters[0];
    let result = buildDesciptions(commandName,this.commandSource.bindings[commandName],true);
    if(result === undefined){
      throw "Error: bad command";
    }
    Command.basicReply(result,message);
  },Command.nArgs(1)
);

function buildDesciptions(name,command,deep){
  if(command === undefined){
    return;
  }
  let handlers = command.handlers;
  if(handlers[0].args === null || handlers[0].description === null){
    return;
  }
  if(handlers.length === 0){
    return deep?`/${name} - Not a known command\n`:"";
  }
  if(handlers.length === 1){
    return deep?
      `/${name} ${handlers[0].args}\n  ${handlers[0].description}\n`:
      `/${name} ${handlers[0].args}\n`;
  }
  let result = `/${name}:\n`;
  handlers.forEach(handle => result +=
    `  ${handle.args?handle.args+": ":""}${handle.description}\n`
  );
  return result;
}

module.exports = helpCommand;
