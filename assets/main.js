// Initial global variable declarations
var characters = [];
var wins = 0;
var numberOfGuesses = 12;
var lettersGuessed = [];
var displayedCharacter = [];
var randomCharacter = "";
var characterImagePath = ""
var randomCharacterArray = []; 
var audio = new Audio('assets/music/GameOfThronesTheme.mp3');


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
  } else {
    console.log('An error was experienced while loading the character data');
  }
}
request.send()

// Utility Functions
// Reset variables from previous games
function resetGame() {
  numberOfGuesses = 12;
  lettersGuessed = [];
  randomCharacter = "";
  randomCharacterArray = [];
  displayedCharacter = [];
  randomNumber = Math.floor(Math.random() * characters.length)
  randomCharacter = characters[randomNumber].name;
  characterImage = characters[randomNumber].image;
  $("#begin-button").html('Play Again');
  $('#play-again-modal').modal('hide');
  document.getElementById('guessesRemaining').innerText = numberOfGuesses;
  document.getElementById('wordToGuess').innerText = "_".repeat(randomCharacter.length);
  // The character selected is logged so that win scenarios can be tested easily.
  console.log(randomCharacter);
}

// Format the chracter to display underscores and spaces. Spaces are given to the user so they don't need to use a guess on them.
function formatDisplayedCharacter(randomCharacter){
  randomCharacterArray = randomCharacter.split('');
  for(i= 0; i <randomCharacterArray.length; i++){
    if (randomCharacterArray[i] === " ") {
      displayedCharacter.push(" ")
    } else {
    displayedCharacter.push("_")
    }
  }
}

// Determine  if the user's guess matches any letters in the hidden word.
function determineIfMatch(userGuess){
  for(i=0; i < displayedCharacter.length; i++){
    if(userGuess === randomCharacterArray[i] || userGuess.toUpperCase() === randomCharacterArray[i]){
      displayedCharacter[i] = userGuess;
    }
  }
  if (randomCharacterArray.indexOf(userGuess) == -1 && numberOfGuesses > 0) {
    numberOfGuesses = numberOfGuesses -1;
  }
}

function determineIfWinner(){
  if (numberOfGuesses === 0){
    displayResults("Lose");
  } else if (displayedCharacter.join('').toUpperCase() === randomCharacterArray.join('').toUpperCase()) {
    displayResults("Win");
  } 
}

function evaluateGuess(keyPressed){
  var userGuess = ""
  var eligibleGuesses = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  if (keyPressed !=="Meta"){
    userGuess = keyPressed;
  }
  if (eligibleGuesses.includes(userGuess)){
    // If the letter hasn't been guessed, add it to the lettersGuessed array.
    if (!lettersGuessed.includes(userGuess)){
      lettersGuessed.push(userGuess);
    }
  }
  determineIfMatch(userGuess);
  determineIfWinner();
  //Update the UI with the guessed letters and the answers
  document.getElementById('guessesRemaining').innerText = numberOfGuesses;
  document.getElementById('wordToGuess').innerText = displayedCharacter.join('');
  document.getElementById('lettersGuessed').innerHTML = lettersGuessed.join('');
}

// This function is needed to prevent the spacebar from restarting the game accidentally
function preventSpacebarDefault(event){
  if ( event.which === 32 ) {
    event.preventDefault();
  }
}

// Upate the modal depending on if the user won or lost.
function displayResults(result){
  $('#play-again-modal').modal('show');
  if (result ==="Lose"){
    document.getElementById('modal-title').innerText = "Sorry, you lost.  The correct Answer was..." + randomCharacter;
  } else if (result==="Win"){
    document.getElementById('modal-title').innerText = "Congratulations, You Won!  You correctly guess " + randomCharacter;
    wins += 1;
    document.getElementById('wins').innerText = "Wins: " + wins;
  }
  $("#character-image").attr("src", characterImage);
  audio.play();
  setTimeout(function () {
      audio.pause();
    }, 3000);
  lettersGuessed = [];
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
