// Initial global variable declarations
var characters = [];
var wins = 0;
var numberOfGuesses = 12;
var lettersGuessed = [];
var displayedCharacter = [];
var randomCharacter = "";
var characterImagePath = ""
var randomCharacterArray = []; // can I delete this?
var stopGame = false;

// Make initial API call
var request = new XMLHttpRequest()
request.open('GET', 'https://api.got.show/api/characters/', true)
request.onload = function() {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response)
  if (request.status >= 200 && request.status < 400) {
    data.forEach(character => {
   
      if (character.pageRank > 200 && character.imageLink){
        characters.push({
          name: character.name,
          image: "https://api.got.show" + character.imageLink
        });
      }
    })
    console.log(data);
  } else {
    console.log('error')
  }
}
request.send()


// Utility Functions
function resetGame () {
  // Reset variables from previous games
  numberOfGuesses = 12;
  lettersGuessed = [];
  randomCharacter = "";
  randomCharacterArray = [];
  displayedCharacter = [];
  stopGame = false;
  randomNumber = Math.floor(Math.random() * characters.length)
  randomCharacter = characters[randomNumber].name;
  characterImagePath = "https://api.got.show/" + characters[randomNumber].imageLink;
  console.log(characterImagePath);
  console.log(randomCharacter);
  
  // "https://api.got.show" + character.imageLink
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
  var characterImage = document.createElement("img");
  characterImage.src = characterImagePath
  console.log("You lost!");
  $('#play-again-modal').modal('show');
  document.getElementById('modal-title').innerText = "Sorry, you lost.  The correct Answer was...";
  document.getElementById('modal-body').innerText = randomCharacter;
  lettersGuessed = [];
  
}

function winScenario(){
  var imageElement = document.getElementById('modal-body');
  var characterImage = document.createElement("img");
  characterImage.src = characterImagePath
  console.log("You won!");  
  wins += 1;
  $('#play-again-modal').modal('show');
  document.getElementById('modal-title').innerText = "Congratulations, you won! The correct Answer was..." + randomCharacter;
  document.getElementById('modal-body').innerText = randomCharacter;
  document.getElementById('wins').innerHTML = "Wins: " + wins;
  imageElement.append(characterImage);
}

// Main Game 
function newGame () {
console.log("this is being logged");
 resetGame();
 formatDisplayedCharacter(randomCharacter);
 document.onkeyup = function(event){
  var keyPressed = event.key;
  preventSpacebarDefault(event);
  evaluateGuess(keyPressed);
 };
}
