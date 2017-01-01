class CommandSource {
  constructor(messageSource,botUsername){
    this.botUsername = botUsername;
    this.bindings = {};
    messageSource.on("text",this.handle.bind(this));
  }

  addCommand(name,command){
    if(name in this.bindings){
      throw `Error: A command is already bound to ${name}`;
    }
    this.bindings[name] = command;
  }

  handle(message){
    let text = message.text;
    if(text.substr(0,1) !== "/"){
      return;
    }
    text = text.substr(1);
    let tokens = text.split(" ");
    let commandName = tokens.shift();
    let atAt = commandName.indexOf("@");
    if(atAt !== -1){
      if (commandName.substr(atAt+1) !== this.botUsername){
        return;
      }
      commandName = commandName.substr(0,atAt);
    }
    commandName = commandName.toLowerCase();
    if(!(commandName in this.bindings)){
      throw `Error: ${commandName} is not a known command`;
    }
    this.bindings[commandName].execute(tokens,message);
  }
}

module.exports = CommandSource;
