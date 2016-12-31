const MySql = require("./MySql.js");

class Meet{
  constructor(obj){
    Object.keys(obj).forEach(k=>this[k]=obj[k]);
  }

  asMarkdown(){
    return `*${this.post_title}* ${this.meet_start_time}\n_${this.guid}_`;
  }

}
Meet.fromObjArray = function(objArray){
  return objArray.map(o=>new Meet(o));
};

function getAllMeets(){
  return MySql.query(`SELECT * FROM wp_posts WHERE post_type = 'meet'`)
    .then(results=>Meet.fromObjArray(results.results));
}

function getUpcomingMeets(){
  return MySql.query(`
    SELECT meta_value AS meet_start_time, wp_posts.*
    FROM wp_postmeta LEFT JOIN wp_posts ON post_id=ID
    WHERE meta_key = 'meet_start_time' AND CAST(meta_value AS DATE) > CURDATE()
  `).then(results=>Meet.fromObjArray(results.results));
}

module.exports = {getAllMeets,getUpcomingMeets};
