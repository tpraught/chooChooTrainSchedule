// Initializing Firebase
var config = {
  apiKey: "AIzaSyA6Sl6wJBjWsDRFiDgkCASlO4OfQw5QxIA",
  authDomain: "choochootrainschedule.firebaseapp.com",
  databaseURL: "https://choochootrainschedule.firebaseio.com",
  projectId: "choochootrainschedule",
  storageBucket: "choochootrainschedule.appspot.com",
  messagingSenderId: "210820220222"
};
firebase.initializeApp(config);

var database = firebase.database();
var getKey = '';

// Capture Button Click
$('#addTrain').on('click', function(event) {
  event.preventDefault();

  // Grabbed values from text boxes
  var trnName = $('#name').val().trim();
  var trnDestination = $('#destination').val().trim();
  var trnTime = $('#time').val().trim();
  var trnFrequency = $('#frequency').val().trim();

  // Creating local temp object for holding train data
  var newTrain = {
    name: trnName,
    destination: trnDestination,
    time: trnTime,
    frequency: trnFrequency
  };

  // Upload train data to database
  database.ref().push(newTrain);

  // Log everything to the console
  console.log('Train: ' + newTrain.name);
  console.log('Destination: ' + newTrain.destination);
  console.log('Time: ' + newTrain.time);
  console.log('Frequency: ' + newTrain.frequency);

  // Clear field after submitting new train
  $('#name, #destination, #time, #frequency').val('');
  return false;
});

// Creating event for adding Trains to the Firebase database
// Adding the new train to a new row in the Train Schedule
database.ref().on('child_added', function(childSnapshot, prevChildKey) {
       
  console.log(childSnapshot.val());

  // Storing everything into a variable
  var trnName = childSnapshot.val().name;
  var trnDestination = childSnapshot.val().destination;
  var trnTime = childSnapshot.val().time;
  var trnFrequency = childSnapshot.val().frequency;

  // Convertiving time to make sure the train time is before the current time
  var trnTimeConverted = moment(trnTime, 'hh:mm').subtract(1, 'years');
  console.log('First train time: ' + trnTimeConverted);

  // Difference between times
  var timeDiff = moment().diff(moment(trnTimeConverted), 'minutes');
  console.log('Difference in time: ' + timeDiff);

  // Time remaining
  var timeRemainder = timeDiff % trnFrequency;

  // Minutes until next train
  var minTillNextTrain = trnFrequency - timeRemainder;
  console.log('Minutes until next train: ' + minTillNextTrain)

  // Next arrival
  var nextTrain = moment().add(minTillNextTrain, 'minutes');
  var trnNextArrival = moment(nextTrain).format('hh:mm');
  console.log('Next Arrival: ' + trnNextArrival);

  // Add each train's data into the table
  var tableData = '<tr><td>' + trnName + '</td><td>' + trnDestination + '</td><td>' +  trnFrequency + '</td><td>' + trnNextArrival + '</td><td>' + minTillNextTrain + '</td><td>' + '<button type="submit" class="removeTrn waves-effect waves-light btn" value="Remove Train"><i class="small material-icons">delete_forever</i></button>' + '</td></tr>';
  $('#schedule').prepend(tableData);
}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
});

$('body').on('click', '.removeTrn', function(){
     $(this).closest ('tr').remove();
     getKey = $(this).parent().parent().attr('id');
     database.child(getKey).remove();
});