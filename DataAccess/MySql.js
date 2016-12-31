const MySql = require("mysql");
const config = require("./config.json");

const pool = MySql.createPool(config.mysql);

function getConnection(){
  return new Promise(good=>pool.getConnection((err,con)=>{
    if (err){
      throw err;
    }
    good(con);
  }));
}

function query(sql,values){
  return new Promise(good=>pool.query(sql,values,(err,results,fields)=>{
    if (err){
      throw err;
    }
    good({results,fields});
  }));
}

function queryStream(sql,values){
  return pool.query(sql,values).stream({highWaterMark:10});
}

module.exports = {getConnection,query,queryStream,pool};
