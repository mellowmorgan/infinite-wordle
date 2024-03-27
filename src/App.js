import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import {words} from 'popular-english-words'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfettiExplosion from 'react-confetti-explosion';
import raw from './wordlist.txt';

function App() {

  const fineMaleNames = 
    ['any', 'art', 'august', 'bank', 'bar', 'barn', 'base', 'bat', 'bear', 'bent', 'bill', 'bond', 'bone', 'boy', 'car', 'care', 'case', 'chance', 'chase', 'chip', 'clay', 'court', 'cross', 'dean', 'drew', 'early', 'even', 'fair', 'far', 'flint', 'field', 'ford', 'forest', 'free', 'gene', 'gray', 'grace', 'gun', 'had', 'hall', 'hill', 'hunt', 'hunter', 'jack', 'job', 'land', 'lane', 'law', 'lay', 'lance', 'lion', 'major', 'man', 'mark', 'mile', 'mill', 'muffin', 'my', 'north', 'page', 'park', 'pen', 'port', 'price', 'read', 'red', 'rice', 'rich', 'ring', 'rock', 'rocky', 'rod', 'salmon', 'sanders', 'saw', 'say', 'see', 'shadow', 'sky', 'son', 'town', 'trace', 'trip', 'wait', 'wash', 'way', 'west', 'will', 'win', 'wolf', 'wood', 'worth', 'yard']
  const fineFemaleNames = 
    ['bee', 'bell', 'bill', 'bird', 'candy', 'carry', 'dawn', 'deny', 'doll', 'dot', 'else', 'fern', 'gene', 'glad', 'grace', 'gray', 'happy', 'honor', 'hope', 'joy', 'lane', 'lucky', 'may', 'melody', 'muffin', 'page', 'pen', 'pet', 'rose', 'row', 'scarlet', 'star', 'storm', 'vanessa', 'velvet']
  const spuriousWordsFound = ['cfded', 'wsdot','moran', 'leeds', 'miami', 'boise', 'paris']
  
  const namesMale = require( '@stdlib/datasets-male-first-names-en' );
  const namesFemale = require( '@stdlib/datasets-female-first-names-en' );
  const [nameListMale, setNameListMale] = useState(new Set(namesMale().map((name)=> name.toLowerCase()).filter((name) => !fineMaleNames.includes(name))));
  const [nameListFemale, setNameListFemale] = useState(new Set(namesFemale().map((name)=> name.toLowerCase()).filter((name) => !fineFemaleNames.includes(name))));

  const [wordList,setWordList] = useState([])
  const [correctWord, setCorrectWord] = useState('');
  const [word, setWord] = useState('');

  //sanitize our dictionary
  const [dictionary, setDictionary] = useState(words.getMostPopular(100000).filter((word) => word.length === 5 && ((!spuriousWordsFound.includes(word)) && (!nameListMale.has(word) && !nameListFemale.has(word)))));

  const [tries, setTries] = useState(0);
  const [spot, setSpot] = useState(1);
  const [gameWon, setGameWon] = useState(false)
  const keyboardKeys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"];
  const [disabled, setDisabled] = useState(false);


  useEffect(() => {
    async function fetchWords () {
      // Call then() after using fetch to pass the result into a callback that saves state
  
      fetch(raw)
      .then(response => response.text())
  .then(text => setWordList(text.split('\n')));
    }
    if (wordList.length === 0){
      fetchWords();
    }
    if (wordList.length > 0 && correctWord === ''){
      setCorrectWord(wordList[Math.floor(Math.random()*wordList.length)]);
    }
  });

  function handleClick(selectedLetter) {
    if (selectedLetter === "DEL" && spot>1){ 
      letterSet(spot-1,'');
      setSpot(spot-1)
      setWord(word.slice(0, -1));

    }else if (selectedLetter === 'ENTER' && spot<6){
      notify("Please enter more letters");
 
    }else if (selectedLetter === 'ENTER' && spot===6){
     checkIfCorrect();

    }else if (selectedLetter && selectedLetter !== 'DEL' && selectedLetter !== 'ENTER' && (0===spot || spot<6)){   
      letterSet(spot, selectedLetter);
      setSpot(spot+1);
      setWord(word+selectedLetter);
    }
  }   

  function checkIfCorrect(){
    if(word.toLowerCase() === correctWord){
      notify("You got it!");
      transformTiles();
      disableKeyboard();
      setGameWon(true)
    
    }else{
      if (!(dictionary.includes(word.toLowerCase()))){
        notify("NOT AN ACCEPTED WORD");
      }else{
        if (tries===5){
          notify('GAMEOVER. Correct Word: '+ correctWord);
          //Todo disable buttons?
        }
        transformTiles();
        setSpot(1);
        setWord('');
        setTries(tries+1);
      }
    }
  }

  function disableKeyboard(){
    setDisabled(true);
  }
  
  function transformTiles(){
    var correctLetterGuesses = [];
    const correctWordArr = correctWord.split('');
    word.toLowerCase().split('').map(function(letter, index) {
      if (letter === correctWordArr[index]){
        letterSet(index+1, letter.toUpperCase(), "rgb(88, 163, 81)")
        correctLetterGuesses.push(letter);
        keyboardKeySet(letter,"rgb(88, 163, 81)")
      }else{
        keyboardKeySet(letter,"darkgray")
      }
    });
    
    word.toLowerCase().split('').map(function(letter, index) {
      if (letter === correctWordArr[index]){
        //already dealt with do nothing
      }else if (letter !== correctWordArr[index] && correctWordArr.includes(letter)){
        if (countElement(letter, correctLetterGuesses) < countElement(letter,correctWord.split(''))){
          letterSet(index+1, letter.toUpperCase(), "rgb(224, 208, 85)")
          correctLetterGuesses.push(letter);
        }else{ 
          letterSet(index+1, letter.toUpperCase(), "darkgray");
        }
  
        if (word.toLowerCase().charAt(index) !== correctWord.charAt(index)){
          keyboardKeySet(letter,"rgb(224, 208, 85)");
        }
      }
      else{
        letterSet(index+1, letter.toUpperCase(), "darkgray");
        keyboardKeySet(letter,"darkgray")
      }
    });
  }

  function countElement(l, arr){
    var count = 0
    arr.map((e)=>{
      if (e===l){
        count++;
      }
    });
    return count
  } 

  function keyboardKeySet(letter, color){
    const keyboardKey = document.getElementById(letter.toUpperCase());
    if(color==="rgb(88, 163, 81)" || (keyboardKey.style.backgroundColor !== "rgb(88, 163, 81)")){ 
      keyboardKey.style.backgroundColor = color;
    }
  }

  function letterSet(spot, selectedLetter, color){
    if(spot===1){
      const box = document.getElementById(String(tries+1)+'-'+String(spot));
      box.textContent = selectedLetter;
      box.style.backgroundColor = color;
    }else if(spot===2){
      const box = document.getElementById(String(tries+1)+'-'+String(spot));
      box.textContent = selectedLetter;
      box.style.backgroundColor = color;
    }else if(spot===3){
      const box = document.getElementById(String(tries+1)+'-'+String(spot));
      box.textContent = selectedLetter;
      box.style.backgroundColor = color;
    }else if(spot===4){
      const box = document.getElementById(String(tries+1)+'-'+String(spot));
      box.textContent = selectedLetter;
      box.style.backgroundColor = color;
    }else if(spot===5){
      const box = document.getElementById(String(tries+1)+'-'+String(spot));
      box.textContent = selectedLetter;
      box.style.backgroundColor = color;
    }
  }
  
  const keyboardFirstLine = keyboardKeys.slice(0,10).map((key) =>
     <button disabled={disabled} id={key} class="keyboard-keys" onClick={() => handleClick(key)}>{key}</button>
  );
  const keyboardSecondLine = keyboardKeys.slice(10,19).map((key) =>
    <button disabled={disabled} id={key} class="keyboard-keys" onClick={() => handleClick(key)}>{key}</button>
  );
  const keyboardThirdLine = keyboardKeys.slice(19, keyboardKeys.length).map((key) =>{
    if (key === "DEL" || key === "ENTER"){
      return <button disabled={disabled} id={key} class="keyboard-keys enter-delete" onClick={() => handleClick(key)}>{key}</button>
    }else{
      return <button disabled={disabled} id={key} class="keyboard-keys" onClick={() => handleClick(key)}>{key}</button>
    }
});
  const notify = (text) => toast(text);
  const sixLines = [1,2,3,4,5,6].map((number) =>
    <div class="line" id="try-{number}">
      <div id={number+'-1'} class="letter-tiles"></div>
      <div id={number+'-2'} class="letter-tiles"></div>
      <div id={number+'-3'} class="letter-tiles"></div>
      <div id={number+'-4'} class="letter-tiles"></div>
      <div id={number+'-5'} class="letter-tiles"></div>
   </div>
  );

  return (

    <div>
      <nav>
        <span class="nav-center">Infinite Wordle</span>
      </nav>
      <div style={{ display:"flex", justifyContent:"center"}}>{gameWon && <ConfettiExplosion height={'100vh'} width={window.innerWidth} particleCount={200} />}</div>
      <div class="holder-lines" >
        {sixLines}
      </div>

      <div class="holder-keyboard"> 
        <div class="keyboard-line">{keyboardFirstLine }</div>
        <div class="keyboard-line">{keyboardSecondLine }</div>
        <div class="keyboard-line">{keyboardThirdLine }</div>
        <div>
        <button style={{display:"none"}} onClick={notify}></button>
        <ToastContainer position="top-center" autoClose={2500} hideProgressBar={true} closeOnClick theme="dark" style={{ fontSize:"16px", top:0, display:"flex", justifyContent:"center" }}  />
      </div>
      </div>
    </div>
  );
}

export default App;