

// board setup - hide stuff that needs to be hidden, show stuff that needs to be shown

// Add something to shift focus away from the button so the space bar doesn't reset the game.
// Inform user how many guesses they have left
// Increment the count and update the image
// New Game Buttom
// manage game state function on every guess
// new game / start a guess initiates game state function and board setup 
// keep tabs on letters guessed - inform user but don't penalize if they have already guessed that letter

var characters = [
  "Eddard Stark", "Robert Baratheon", "Jaime Lannister", "Catelyn Stark", "Cersei Lannister",  "Daenerys Targaryen",  "Jorah Mormont", "Viserys Targaryen", "Jon Snow", "Sansa Stark", "Arya Stark", "Robb Stark", "Theon Greyjoy", "Bran Stark", "Joffrey Baratheon", "Sandor Clegane", "Tyrion Lannister", "Khal Drogo", "Petyr Baelish", "Davos Seaworth", "Samwell Tarly", "Stannis Baratheon", "Melisandre", "Jeor Mormont",
  "Bronn", "Varys", "Shae", "Margaery Tyrell", "Tywin Lannister", "Talisa Maegyr", "Ygritte", "Gendry", "Tormund Giantsbane", "Brienne of Tarth", "Ramsay Bolton", "Gilly", "Daario Naharis", "Missandei", "Ellaria Sand", "Tommen Baratheon", "Jaqen Hghar", "Roose Bolton"];

var allowedGuesses = 10;
  var numberOfGuesses = 0;

var lettersGuessed = [];
var randomCharacter = "";

function pickRandomCharacter () {
  return characters[Math.floor(Math.random() * characters.length)];
}

function newGame () {
 randomCharacter = pickRandomCharacter();
 console.log(randomCharacter);
 console.log("_".repeat(randomCharacter.length));
 document.getElementById('wordToGuess').innerText = "_ ".repeat(randomCharacter.length);
 document.onkeyup = function(event){
  var keyPressed = event.key;
  evaluateGuess(keyPressed);
 };
}

function evaluateGuess(keyPressed){
  if (keyPressed !=="Meta"){
    var userGuess = keyPressed;
  } 
  var displayUserGuesses = "";
  if (!lettersGuessed.includes(userGuess)){
    lettersGuessed.push(userGuess);
    displayUserGuesses += "  " + lettersGuessed;
    console.log(lettersGuessed);
  } else {
    alert("You already guessed: " + userGuess + " Please guess again.");
  }
  
  document.getElementById('lettersGuessed').innerText = "You guessed: " + displayUserGuesses;

}
