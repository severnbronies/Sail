const MySql = require("./MySql.js");

function parseResults()

function getAllMeets(){
  MySql.query(`SELECT * FROM wp_posts WHERE post_type = 'meet'`).then(result=>
  )
}
