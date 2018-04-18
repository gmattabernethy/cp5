const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var https = require('https');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];  
const db = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

let purchases = [];
let id = 0;

// API to get Static Watch information
app.get('/api/watch/:id', (req, res) => {
  let watch = req.params.id;
  console.log("Static Watch API Lookup for : " + watch + " has been called.")
  let validWatches = ["vostokN1","vostokAmphibia","poljotOkean"];
  if (validWatches.indexOf(watch)>=0){
    res.sendFile(path.resolve('./public/json/' + watch + '.json'));
  }else{ // Force them to look at an Amphibia
    res.sendFile(path.resolve('./public/json/vostokAmphibia.json'));
  }
});

// API to show all purchases
app.get('/api/purchases', (req, res) => {
  db('watches').select().from('purchases').then(dbpurchases => {
    res.send(dbpurchases);
  }).catch(error => {
    res.status(500).json({ error });
  });
});


// API to add a purchase
app.post('/api/purchases', (req, res) => {
  let watch = req.body.watch;
  let watchInfo = require('./public/json/' + watch + '.json');
  db('purchases').insert({name:req.body.name, email:req.body.email, address:req.body.address, city:req.body.city, st:req.body.st, zip:req.body.zip, watch:watch, watchName:watchInfo.name, text:req.body.text, price:watchInfo.price, date: new Date()}).then(purchase => {
    res.status(200).json({id:purchase[0]});
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

// API to delete a purchase
app.delete('/api/purchases/:id', (req, res) => {
  let id = parseInt(req.params.id);
  db('purchases').where('id',id).del().then(purchases => {
    res.sendStatus(200);    
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

// API to change a purchase (may not be required)
app.put('/api/purchases/:id', (req, res) => {
  let id = parseInt(req.params.id);
  db('purchases').where('id',id).update({name:req.body.name}).then(purchases => {
    res.sendStatus(200);    
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

// API to login
app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send();
  db('users').where('email',req.body.email).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash),user];
  }).spread((result,user) => {
    if (result)
      res.status(200).json({user:{username:user.username,name:user.name,id:user.id}});
    else
      res.status(403).send("Invalid credentials");
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

//API to register
app.post('/api/users', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username || !req.body.name)
    return res.status(400).send();
  db('users').where('email',req.body.email).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Email address already exists");
      throw new Error('abort');
    }
    return db('users').where('username',req.body.username).first();
  }).then(user => {
    if (user !== undefined) {
      res.status(409).send("User name already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return db('users').insert({email: req.body.email, hash: hash, username:req.body.username,
				 name:req.body.name, role: 'user'});
  }).then(ids => {
    return db('users').where('id',ids[0]).first().select('username','name','id');
  }).then(user => {
    res.status(200).json({user:user});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

app.listen(3001, () => console.log('Server listening on port 3001!'))

