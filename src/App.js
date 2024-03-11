import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import {words} from 'popular-english-words'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const namesMale = require( '@stdlib/datasets-male-first-names-en' );
  const namesFemale = require( '@stdlib/datasets-female-first-names-en' );
  const [nameListMale, setNameListMale] = useState(new Set(namesMale().map((name)=> name.toLowerCase())));
  
  const [nameListFemale, setNameListFemale] = useState(new Set(namesFemale().map((name)=> name.toLowerCase())));
  const [word, setWord] = useState('');
  const [dictionary, setDictionary] = useState( words.getMostPopular(100000).filter((word) => word.length === 5 && !(nameListMale.has(word)) && !(nameListFemale.has(word))));

  const [tries, setTries] = useState(0);
  const [spot, setSpot] = useState(1);

  const keyboardKeys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"];
  const [disabled, setDisabled] = useState(false);

  const [popularWords, setPopularWords] = useState(words.getMostPopular(8000).filter((popularWord) => popularWord.length === 5 && !(nameListMale.has(popularWord)) && !(nameListFemale.has(popularWord))));
  const [correctWord, setCorrectWord] = useState(popularWords[Math.floor(Math.random()*popularWords.length)]);
  //secret
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
    if(color=="rgb(88, 163, 81)" || (keyboardKey.style.backgroundColor !== "rgb(88, 163, 81)")){ 
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
    if (key == "DEL" || key == "ENTER"){
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
      <nav><span class="nav-center">Infinite Wordle</span></nav>
   
      <div class="holder-lines" >
        {sixLines}
      </div>

      <div class="holder-keyboard"> 
        <div class="keyboard-line">{keyboardFirstLine }</div>
        <div class="keyboard-line">{keyboardSecondLine }</div>
        <div class="keyboard-line">{keyboardThirdLine }</div>
        <div>
        <button style={{display:"none"}} onClick={notify}></button>
        <ToastContainer position="top-center" autoClose={8000} hideProgressBar={true} closeOnClick theme="dark" />
      </div>
      </div>
    </div>
  );
}

export default App;