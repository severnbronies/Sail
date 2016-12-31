const Source = require("./Ship/PollSource.js");
const Connection = require("./Ship/Connection.js");
const MessageRouter = require("./Ship/MessageRouter.js");
const CommandSource = require("./Ship/CommandSource.js");

const helpCommand = require("./Ship/Commands/Help.js");
const bindOurCommands = require("./Commands.js");

const config = require("./config.json");

const connection = new Connection(config.auth.id,config.auth.key);
const source = new Source(connection);
const messageSource = new MessageRouter(source);

let commandSource;

console.log("Pinging telegram to check connection and get out username...");
connection.getMe().then(me=>{
  console.log(`> Response. We are "${me.username}".`);
  console.log("> Binding commands to command source.");
  commandSource = new CommandSource(messageSource,me.username);
  helpCommand.bind("help",commandSource);
  bindOurCommands(commandSource);
  console.log("> Starting message source.");
  source.start();
});

process.on('unhandledRejection', err => {
  console.log(`${new Date()} WARN: Unandled error in promise:`,err);
});
