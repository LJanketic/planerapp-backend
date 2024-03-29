#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Note = require('./models/note')
var User = require('./models/user')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var notes = []

function userCreate(first_name, last_name, username, cb) {
  userdetail = { first_name: first_name, last_name: last_name, username: username }
  
  var user = new User(userdetail);
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}

function noteCreate(title, user, date_created, status, cb) {
  notedetail = { 
    title: title,
    user: user,
    date_created: date_created,
    status: status
  }
    
  var note = new Note(notedetail);    
  note.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New note: ' + note);
    notes.push(note)
    cb(null, note)
  }  );
}


/* function bookInstanceCreate(book, imprint, due_back, status, cb) {
  bookinstancedetail = { 
    book: book,
    imprint: imprint
  }    
  if (due_back != false) bookinstancedetail.due_back = due_back
  if (status != false) bookinstancedetail.status = status
    
  var bookinstance = new BookInstance(bookinstancedetail);    
  bookinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING BookInstance: ' + bookinstance);
      cb(err, null)
      return
    }
    console.log('New BookInstance: ' + bookinstance);
    bookinstances.push(bookinstance)
    cb(null, book)
  }  );
} */

function createNotes(cb) {
    async.parallel([
        function(callback) {
            noteCreate('Do the laundry', users[0], 'In progress', callback);
        },
        function(callback) {
            noteCreate('Take out the dog', users[1], 'In progress', callback);
        },
        function(callback) {
            noteCreate('Play the piano', users[2], 'In progress', callback);
        },
        function(callback) {
            noteCreate('Water the flowers', users[3], 'Finished', callback);
        },
        function(callback) {
            noteCreate('Take a nap', users[4], 'Yet to happen', callback);
        },
        function(callback) {
            noteCreate('Test note 1', users[1], 'Yet to happen', callback);
        },
        function(callback) {
            noteCreate('Test note 2', users[2], 'Finished', callback)
        }
        ],
        cb);
}


/* function createBookInstances(cb) {
    async.parallel([
        function(callback) {
          bookInstanceCreate(books[0], 'London Gollancz, 2014.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[1], ' Gollancz, 2011.', false, 'Loaned', callback)
        },
        function(callback) {
          bookInstanceCreate(books[2], ' Gollancz, 2015.', false, false, callback)
        },
        function(callback) {
          bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Maintenance', callback)
        },
        function(callback) {
          bookInstanceCreate(books[4], 'New York, NY Tom Doherty Associates, LLC, 2015.', false, 'Loaned', callback)
        },
        function(callback) {
          bookInstanceCreate(books[0], 'Imprint XXX2', false, false, callback)
        },
        function(callback) {
          bookInstanceCreate(books[1], 'Imprint XXX3', false, false, callback)
        }
        ],
        // Optional callback
        cb);
} */



async.series([
    createNotes,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Users: '+users);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




