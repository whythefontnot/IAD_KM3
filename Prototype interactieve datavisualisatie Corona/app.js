const http = require('http');

const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./coviddb.db', sqlite3.OPEN_READ, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});
// localhost:3000
const express = require('express')
const app = express()
const port = 3000
const path = require('path');
// / gaat naar index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/web/index.html'));
});
// deze gaat naar styles.css
app.get('/styles.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/web/styles.css'));
});
// URL voor query met datum
app.get('/query/:date', (request, response) => {
  let dateToSelect = request.params.date;
  console.log(`Received request for date ${dateToSelect}`);
  let sql = `select Total_reported as 'total', Hospital_admission as 'hospital', Deceased as 'dead', Municipality_code as 'code', Municipality_name as 'name' from gemeente_cumulatief where date(Date_of_report) =
             date('${dateToSelect}')`;
    // zoeken in database
    db.all(sql, [], (err, rows) => {
        if (err) {
          response.status(400).json({"error":err.message});
          return;
        }
        response.json({
            "message":"success",
            "data":rows
        })
      });
})
// zoekt info over maximum aantallen in database
app.get('/max/', (request, response) => {
  let sql = `select
            MAX(Total_reported) as 'max_total',
            MAX(Hospital_admission) as 'max_hospital',
            MAX(Deceased) as 'max_dead'
            from gemeente_cumulatief`;

  console.log(sql);
// zoeken in database + message terug geven
  db.get(sql, [], (err, row) => {
      if (err) {
        response.status(400).json({"error":err.message});
        return;
      }
      response.json({
          "message":"success",
          "data": {
            "max_total": row.max_total,
            "max_hospital" : row.max_hospital,
            "max_dead": row.max_dead
          }
      })
    });
})
// start de app
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
