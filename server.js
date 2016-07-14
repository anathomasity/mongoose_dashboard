// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// MODELS

var AnimalSchema = new mongoose.Schema({
 name: String,
 age: Number
})
mongoose.model('Animal', AnimalSchema); // We are setting this Schema in our Models as 'User'
var Animal = mongoose.model('Animal') // We are retrieving this Schema from our Models, named 'User'






// Routes
// Root Request
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
  	Animal.find({}, function(err, animals) {
    
    	if(err) {
	      console.log('something went wrong');
	    } else { // else console.log that we did well and then redirect to the root route
	      var animals = animals
        console.log('This are all the animals!!');
	      res.render('index', {animals: animals});
	    }

    })
    
})
// Add User Request 
app.post('/animals', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var animal = new Animal({name: req.body.name, age: req.body.age});
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  animal.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a animal!');
      res.redirect('/');
    }
  })
})

app.get("/animals/new", function(req,res) {
  res.render('new');
})

app.post("/animals/:id/destroy", function(req,res) {
  Animal.remove({_id: req.params.id}, function(err){
      if(err){
        console.log("something went wrong removing that animal.")
      }
    res.redirect('/');
  })
  
})

app.get("/animals/:id" , function(req,res) {
  Animal.findOne({_id: req.params.id}, function(err, animal) {
      var animal = animal;
      res.render("show", {animal:animal});
  })
  
})

app.get("/animals/:id/edit", function(req, res) {
    Animal.findOne({_id: req.params.id}, function(err, animal) {
      var animal = animal;
      res.render("edit", {animal:animal});
    })
})

app.post("/animals/:id", function(req,res) {
    Animal.update({_id: req.params.id}, {name:req.body.name, age:req.body.age}, function(err){
      console.log(req.body)
      if(err){
        console.log("couldn't update animal");
      }
      res.redirect("/");
    })
})



// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})