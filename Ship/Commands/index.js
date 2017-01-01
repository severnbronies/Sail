function bindCommands(commandMap,messageSource){
  Object.keys(commandMap).forEach(name=>{
    require(`./${commandMap[name]}.js`).bind(name,messageSource);
  });
}
module.exports = {bindCommands};
