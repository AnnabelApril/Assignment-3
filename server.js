var express = require('express');
var app = express();

var server = require('http').Server(app);

var io = require('socket.io')(server);

var chance = require('chance').Chance();

const pattern_1 = ['Hi my name is Annabel, nice to meet you', 'Hello', 'How is your day', 'Talk to me'];
const pattern_2 = ['How are you doing?', 'I feel happy', 'Are you ok'];
const pattern_3 = ['Tell me a story', 'Can we be friends?', 'I agree'];
const pattern_4 = ['Could you elaborate?', 'Time?', 'Location'];

function matches(msg, array_of_patterns) {

  var msg_lower = msg.toLowerCase();

  for(var i = 0; i < array_of_patterns.length; i++) {

    var pattern_lower = array_of_patterns[i].toLowerCase();

    if(msg_lower.search(pattern_lower) > -1) {

    return true;

    }
  }
    return false;
}

function choice(array) {

  var index = chance.natural({'min': 0, 'max': array.length - 1});  // **** NOTE: 'max': array.length - 1

    return array[index];
}

function maybe(array) {

  if( chance.bool() ) {

    return choice(array);

  } else {

    return '';

  }
}


function pattern_1_answer() {
    return choice(['Nice to meet you too!', 'Good', 'Fine']) + '. ' + choice(['How are you?', 'Your turn!', 'I know everything...']);
}

function pattern_2_answer() {

  switch(choice([1, 2, 3]))
  {
    case 1:
      return choice(['I see', 'interesting', 'Well']) + ', ' + 'I have been' + ' ' 
        + maybe(['hopefully', 'fucking', 'absolutely', 'overly']) + ' ' 
        + choice(['depressed', 'elated', 'emotional', 'energetic', 'bitchy', 'snappy', 'partying', 'working'])
        + choice('.', '...');
    case 2:
      return choice(['So', 'Excuse me', 'What', 'Finaly']) + ', ' + 'now' + ' ' + 'you' + ' ' + choice(['begin', 'choose', 'want', 'agree', 'start']) + ' ' + 'to '
        + choice(['talk to', 'see eye to eye with', 'console', 'be faithfull to']) + ' me' 
        + choice('.', '!');
    case 3:
      return choice(['how dare you', "I don't care", 'please stop']) + choice('!', '?') + choice('!!', '?') + choice('!!!','?');
  }
}

function pattern_3_answer() {
  switch(choice([1,2]))
  {
    case 1:
      return choice(['Lets see', 'Maybe', 'one day']) + ', ' + 'I will ' + choice(['follow', 'take', 'hold']) + ' ' + 'a' + ' '
      + choice(['dog', 'bike', 'bal', 'car', 'boat', 'hovercraft']) + ' ' + 'around the' + ' ' + choice(['world', 'globe'])
      + choice('.', '!', '...');
    case 2: 
      return choice(['Yes', 'Maybe?', 'How about no']);
  }
}

function pattern_4_answer() {
  return choice(['None of your business', 'shhhhhh']) + ' ' + 'guess' + ' ' + 'I am' + ' ' 
  + choice([ 'so', 'too', 'very']) + ' ' 
  + choice(['mysterious', 'shy', 'stupid']) + '.';
}

function default_answer() {

  switch(choice([1,2]))
  {
    case 1:
      return choice(['Error', '?????????', 'Page not found', 'What are you saying']);
    case 2: 
      return choice(['Start', 'Game']) + ' ' + 'over...';
  }
}

function answer(msg) {

  if(matches(msg, pattern_1)) { 

    return pattern_1_answer();

  } else if(matches(msg, pattern_2)) {

    return pattern_2_answer();

  } else if(matches(msg, pattern_3)) {

   return pattern_3_answer();

  } else if(matches(msg, pattern_4)) {

   return pattern_4_answer();

 } else {

    return default_answer();
  }

}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
io.on('connection', function(socket) {

  console.log('got a connection');
 
  socket.on('message from human', function(msg) {

    console.log('got a human message: ' + msg);

    var response = answer(msg);                      

    io.emit('message from robot', response);

  });

  socket.on('disconnet', function() {

    console.log('got a disconnection');
    
  });

});

server.listen(8088, function () {
  console.log('listening on port: ' + 8088);
});