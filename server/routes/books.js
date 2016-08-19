var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.get('/', function (req, res) {
  // Retrieve books from database
  console.log("reached get request");
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('SELECT DISTINCT * FROM owners', function (err, result) {
      done(); // closes connection, I only have 10!

      if (err) {
        res.sendStatus(500);
      }
      res.send(result.rows);
    });
  });
});


router.post('/', function (req, res) {
  var ownerInfo = req.body;
  console.log(ownerInfo);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    client.query('INSERT INTO owners (first_name, last_name) '
                + 'VALUES ($1, $2)',
                [ownerInfo.first_name,ownerInfo.last_name],
                function (err, result) {
                  done();

                  if (err) {
                    console.log(err);
                    res.sendStatus(500);
                  } else {
                    res.sendStatus(201);
                  }
                });
  });
});

module.exports = router;
