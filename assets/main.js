// When game is done - remove alerts and instead pop a modal
// clear letters on game end rather than game begin for losing games
// Update button text 'play again?'
// Initial Setup of variables
// Disable Begin button after initial game launch

// var characters = [
//   "Eddard Stark", "Robert Baratheon", "Jaime Lannister", "Catelyn Stark", "Cersei Lannister",  "Daenerys Targaryen",  "Jorah Mormont", "Viserys Targaryen", "Jon Snow", "Sansa Stark", "Arya Stark", "Robb Stark", "Theon Greyjoy", "Bran Stark", "Joffrey Baratheon", "Sandor Clegane", "Tyrion Lannister", "Khal Drogo", "Petyr Baelish", "Davos Seaworth", "Samwell Tarly", "Stannis Baratheon", "Melisandre", "Jeor Mormont",
//   "Bronn", "Varys", "Shae", "Margaery Tyrell", "Tywin Lannister", "Talisa Maegyr", "Ygritte", "Gendry", "Tormund Giantsbane", "Brienne of Tarth", "Ramsay Bolton", "Gilly", "Daario Naharis", "Missandei", "Ellaria Sand", "Tommen Baratheon", "Jaqen Hghar", "Roose Bolton"];
var characters = [];
var wins = 0;
var numberOfGuesses = 12;
var lettersGuessed = [];
var displayedCharacter = [];
var randomCharacter = "";
var randomCharacterArray = [];
var stopGame = false;

// Make initial API call
var request = new XMLHttpRequest()
request.open('GET', 'https://api.got.show/api/characters/', true)
request.onload = function() {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response)
  if (request.status >= 200 && request.status < 400) {
    data.forEach(character => {
      if (character.pageRank > 200){
        console.log(character.name)
        console.log("https://api.got.show" + character.imageLink);
        characters.push({
          name: character.name,
          image: "https://api.got.show" + character.imageLink
        });
      }
    })
  } else {
    console.log('error')
  }
  console.log(characters);
}
request.send()


// Utility Functions
function resetGame () {
  numberOfGuesses = 12;
  lettersGuessed = [];
  randomCharacter = "";
  randomCharacterArray = [];
  displayedCharacter = [];
  stopGame = false;
  randomCharacter = characters[Math.floor(Math.random() * characters.length)].name;
  $('#play-again-modal').modal('hide');
  document.getElementById('guessesRemaining').innerText = numberOfGuesses;
  document.getElementById('wordToGuess').innerText = "_ ".repeat(randomCharacter.length);
}

function formatDisplayedCharacter(randomCharacter){
  randomCharacterArray = randomCharacter.split('');
  for(i= 0; i <randomCharacterArray.length; i++){
    displayedCharacter.push("_ ")
  }
}

function determineIfMatch(userGuess){
  for(i=0; i < displayedCharacter.length; i++){
    if(userGuess === randomCharacterArray[i] || userGuess.toUpperCase() === randomCharacterArray[i]){
      displayedCharacter[i] = userGuess;
    }
  }
  console.log(displayedCharacter);
}

function determineIfWinner(){
  if (numberOfGuesses <= 0){
    loseScenario();
  } else if (displayedCharacter.join('').toUpperCase() === randomCharacterArray.join('').toUpperCase()) {
    winScenario();
  } 
}

function evaluateGuess(keyPressed){
  var userGuess = ""

  if (keyPressed !=="Meta"){
    userGuess = keyPressed;
  }
  if (!lettersGuessed.includes(userGuess)){
    lettersGuessed.push(userGuess);
    numberOfGuesses -= 1;
  }
  determineIfMatch(userGuess);
  determineIfWinner();
  //Update the UI with the guessed letters and the answers
  document.getElementById('guessesRemaining').innerText = numberOfGuesses;
  document.getElementById('wordToGuess').innerText = displayedCharacter.join('');
  document.getElementById('lettersGuessed').innerHTML = lettersGuessed.join('');
}

// This function is needed to allow the spacebar to be used as a valid guess
// and preventing it from submitting the button which will reset the game.
function preventSpacebarDefault(event){
  if ( event.which === 32 ) {
    event.preventDefault();
  }
}

function loseScenario(){
  console.log("You lost!");
  $('#play-again-modal').modal('show');
  document.getElementById('modal-title').innerText = "Sorry, you lost.  The correct Answer was...";
  document.getElementById('modal-body').innerText = randomCharacter;
  lettersGuessed = [];
  
}

function winScenario(){
  console.log("You won!");  
  wins += 1;
  $('#play-again-modal').modal('show');
  document.getElementById('modal-title').innerText = "Congratulations, you won! The correct Answer was...";
  document.getElementById('modal-body').innerText = randomCharacter;
  document.getElementById('wins').innerHTML = "Wins: " + wins;
}

// Main Game 
function newGame () {
 resetGame();
 formatDisplayedCharacter(randomCharacter);
 document.onkeyup = function(event){
  var keyPressed = event.key;
  preventSpacebarDefault(event);
  evaluateGuess(keyPressed);
 };
}
