var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';


router.post('/', function (req, res) {
  var petInfo = req.body;
  console.log(petInfo);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    client.query('INSERT INTO pets (name, breed, color, owner_id)'
                + 'VALUES ($1, $2, $3, $4)',
                [petInfo.pet_name,petInfo.pet_color,petInfo.pet_breed,petInfo.owner_id],
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


router.get('/', function (req, res) {
  // Retrieve pets from database
  console.log("reached get request");
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('SELECT first_name,last_name, name, breed, color, pets.id '+
                'FROM pets JOIN owners ON pets.owner_id = owners.id;',
                function (err, result) {
          done(); // closes connection, I only have 10!

          if (err) {
            res.sendStatus(500);
          }
            res.send(result.rows);
    });
  });
});

router.put('/:id', function(req,res){
  var id = req.params.id;
  console.log("we are here shit");
  console.log('put body is',id);

  var pet = req.body;
  console.log(pet);

  pg.connect(connectionString, function(err,client,done){
    if(err){
      res.sendStatus(500);
    }

    client.query('UPDATE pets '+
                  'SET VALUES name = $1, ' +
                  'breed = $2, '+
                  'color = $3, '+
                  'WHERE id = $4;',

                  [pet.name,pet.breed,pet.color,id],

                  function(err,result){
                    done();
                  if(err){
                    console.log('err',err);
                    res.sendStatus(500);
                  } else{
                    res.sendStatus(200);
                  }
                });
  });
});

module.exports = router;
