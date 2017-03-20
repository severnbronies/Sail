const MySql = require("./MySql.js");
const entities = require("entities");
const moment = require("moment");
const phpUnserialize = require('php-unserialize').unserialize;

class Meet{
  constructor(obj){
    Object.keys(obj).forEach(k=>this[k]=entities.decodeHTML(obj[k]));
  }

  loadMetaData(){
    let meta = {};
    return MySql.query(`
      SELECT meta_key,meta_value
      FROM wp_postmeta
      WHERE post_id=?
      AND meta_key NOT LIKE "\\_%"
    `,[this.ID]).then(results=>{
      results.results.forEach(row=>meta[row.meta_key]=row.meta_value);

      this.meet_start_time = meta.meet_start_time;
      this.meet_end_time = meta.meet_end_time;
      return getLocationTable();
    }).then(locationTable => {
      let usedLocations = {};
      let locData = phpUnserialize(meta.meet_location);
      Object.keys(locData).forEach(k=>
        usedLocations[locationTable[locData[k]]] = 1
      );

      this.meet_locations = Object.keys(usedLocations);
      console.log(this.meet_locations);
      if(this.meet_locations.length === 0){
        this.meet_location = "no specified location";
      } else if (this.meet_locations.length === 1){
        this.meet_location = this.meet_locations[0];
      } else {
        let body = this.meet_locations.slice(0,-1);
        let tail = this.meet_locations[this.meet_locations.length-1];
        this.meet_location = `${body.join(", ")}, and ${tail}`;
      }
    });
  }

  asMarkdown(){
    return `[${this.post_title}](${this.guid}) ${moment(this.meet_start_time).calendar()} in ${this.meet_location}`;
  }

}
Meet.fromObjArray = function(objArray){
  let meetArray = objArray.map(o=>new Meet(o));
  return Promise.all(meetArray.map(o=>o.loadMetaData())).then(()=>meetArray);
};

function intercepts(as,bs){
  bs = bs.map(b=>b.toLowerCase());
  as = as.map(a=>a.toLowerCase());
  return as.some(a=>bs.includes(a));
}

function getUpcomingMeetsAt(locations){
  return getUpcomingMeets().then(meets=>meets.filter(m=>intercepts(locations,m.meet_locations)));
}

function getUpcomingMeets(){
  return MySql.query(`
    SELECT meta_value AS meet_start_time, wp_posts.*
    FROM wp_postmeta LEFT JOIN wp_posts ON post_id=ID
    WHERE meta_key = 'meet_start_time'
    AND post_type = 'meet'
    AND post_status = 'publish'
    AND CAST(meta_value AS DATE) >= CURDATE()
    ORDER BY meta_value ASC;
  `).then(results=>Meet.fromObjArray(results.results));
}


let locationTable;
function updateLocationTable(){
  console.log("Updating meet location table...");
  return MySql.query(`
    SELECT post_id, meta_value
    FROM wp_postmeta
    WHERE meta_key = 'location_locality'
  `).then(results=>{
    locationTable = {};
    results.results.forEach(row=>locationTable[row.post_id]=row.meta_value);
    console.log("Meet location table updated...");
    return locationTable;
  });
}
updateLocationTable();

function getLocationTable(update){
  if(locationTable === undefined || update){
    return updateLocationTable();
  } else {
    return Promise.resolve(locationTable);
  }
}

module.exports = {getUpcomingMeets,getUpcomingMeetsAt,getLocationTable};
