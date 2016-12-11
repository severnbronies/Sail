class Command {
  constructor(name,commandSource){
    this.handlers = [];
    this.commandSource = undefined;
    if(name !== undefined){
      this.bind(name,commandSource);
    }
  }

  addHandler(args,description,handler,checker){
    this.handlers.push({args,description,
      handler:handler.bind(this),
      checker:checker.bind(this)});
    return this;
  }

  bind(name,commandSource){
    if(commandSource === undefined){
      throw "Cannot bind to a undefined commandSource";
    }
    if(this.commandSource !== undefined){
      throw `Cannot bind command to ${name} it is already bound`;
    }
    this.commandSource = commandSource;
    this.commandSource.addCommand(name,this);
    return this;
  }

  execute(paramaters,message){
    let handle = this.handlers.find(h=>h.checker(paramaters,message));
    if(handle === undefined){
      throw `No valid command found for ${name}:${paramaters}`; //XXX Use proper error
    }
    handle.handler(paramaters,message);
    return true;
  }
}

Command.nArgs = function(minArgs,maxArgs){
  maxArgs = maxArgs === undefined?minArgs:maxArgs;
  return function(paramaters){
    return minArgs <= paramaters.length && paramaters.length <= maxArgs;
  };
};

Command.atleastArgs = function(minArgs){
  return function(paramaters){
    return minArgs <= paramaters.length;
  };
};

Command.any = ()=>true;

Command.regexArgs = function(minArgs,...regexes){
  return function(paramaters){
    if(paramaters.length < minArgs){
      return false;
    }
    return paramaters.every((p,i)=>regexes[i].test(p));
  };
};

Command.basicReply = function(reply,message){
  message.connection.sendMessage({
    chat_id:message.chat.id,
    //reply_to_message_id:message.message_id,
    parse_mode:"Markdown",
    text:reply
  });
};

Command.REGEXS = {
  INTEGER:/^[0-9]+$/,
  NUMBER:/^(?=[0-9.])[0-9]*(\.[0-9]+)?$/
};

module.exports = Command;
