import React, { Component } from 'react';
import './App.css';



const words=['money',
             'booklin',
             'house',
             'bread',
             'bottle',
             'lorry',
             'vendor',
             'rat'
           ];


class App extends Component {
  constructor(props){
    super(props);
    this.state={ lives:7,
                 gameWord:'',
                 gameBoard:[],
                 gameStartButton:'',
                 gameEnd: false,
                 gameBoardText:'Can you guess the word?'
               }
  }

  toggleGame(){
    this.setState({ gameEnd: !this.state.gameEnd})
    if (this.state.gameEnd === true){
      this.initiateGameState();
    }
  }

  hint(){
    let livesCopy = JSON.parse(JSON.stringify(this.state.lives));
    let gameBoardCopy= JSON.parse(JSON.stringify(this.state.gameBoard));
    let hintValueIndex = Math.floor(Math.random()* gameBoardCopy.length);
    let hintValue = gameBoardCopy[hintValueIndex].letter;
    if(gameBoardCopy[hintValueIndex].value === ''){
      livesCopy -=1;
      gameBoardCopy[hintValueIndex].value = hintValue;
      this.setState({gameBoard: gameBoardCopy,
                     lives: livesCopy})
    }else if( this.state.gameBoardText !=="Excellent!!!"){
      this.hint();
    }
  }



  componentWillMount(){
     this.initiateGameState();
  }

  shouldComponentUpdate(nextProps, nextState){
    return true;
  }


  componentWillUpdate(nextProps, nextState){
    this.newGameState();
  }


  newGameState(){
    let gameOver = "Game Over!!"
     if (this.state.lives === 1){
        this.setState({gameBoardText:gameOver});
        this.toggleGame();
    }else{
      this.state.gameBoardText="Can you guess the word?"
    }
 }


  initiateGameState(){
    let randWordIndex = Math.floor(Math.random()* words.length);
    let randWord = words[randWordIndex];
    this.setState({ gameWord: randWord});
    let newGameState =[];
    randWord.split('').map((item, index) => {
       return newGameState.push({letter:item, value:''});
    });
    this.setState({ gameBoard:newGameState,
                    lives:7,
                    gameBoardText:'Can you guess the word?'
                    });
  }



  getInputValue(index, event){

     let gameBoardCopy= JSON.parse(JSON.stringify(this.state.gameBoard));
     let inputValue= event.target.value;
     let livesCopy = JSON.parse(JSON.stringify(this.state.lives));

     if(inputValue.length === 1){
        if(gameBoardCopy[index].letter === inputValue){
          gameBoardCopy[index].value = inputValue;
          this.setState({gameBoard: gameBoardCopy});
        }else{
          livesCopy -= 1;
          this.setState({lives:livesCopy});
          console.log(this.state.lives);
        }

     }else if(inputValue.length >1){
       let inputValueArray = inputValue.split('');
         if (gameBoardCopy[index].letter === inputValueArray[0]){
           gameBoardCopy[index].value = inputValueArray[0];
           this.setState({gameBoard: gameBoardCopy});
         }
     }else{
       gameBoardCopy[index].value= inputValue;
       this.setState({gameBoard: gameBoardCopy})
     }

  }


  render() {
     let counter =0;
     for(let i=0; i< this.state.gameBoard.length; i++){
       if(this.state.gameBoard[i].value !== ''){
           counter+=1;
       if(counter === this.state.gameBoard.length ){
         this.state.gameBoardText="Excellent!!!";
       }
     }
    }

    return (
     <div className='App'>
        <div>
          <Header>
            <HealthBar lives={this.state.lives} />
          </Header>
        </div>
        <div>
           <GameDeck>
             <div className='gameDeckText'><p>{this.state.gameBoardText}</p></div>
              {this.state.gameEnd ? <div className='gameStartBlock'><button className='gameStart' type='button' onClick={this.toggleGame.bind(this)}>Restart</button></div> : null}
             <Inputs gameWord={this.state.gameWord} gameBoard={this.state.gameBoard} onChange={this.getInputValue.bind(this)} />
             <button type='button' className='hint' onClick = {this.hint.bind(this)}>HINT!</button>
           </GameDeck>
        </div>
      </div>
    );
  }
}


function Header(props){
  return(
    <div className='header'>
     {props.children}
    </div>
  );
}


function HealthBar(props){
   let liveBar=[];
   for(let i=0; i<props.lives; i++){
     liveBar.push(<div className='liveBar' key={i}></div>)
   }
   return(
        <div className='barArray'>{liveBar}</div>
   );
}


function Inputs(props){
   let wordInput = props.gameWord.split('').map( (item,index) => (
            <div className='inputBlock'>
                <input type='text' key={index} value={props.gameBoard[index].value} className='letterInput'
                      onChange={props.onChange.bind(null, index)} />
            </div>
           ));
   return(
     <div className='inputBlockTray'>{wordInput}</div>
   );
}


function GameDeck(props){
  return(
    <div className='gameDeck'>

       {props.children}
    </div>

  );
}




export default App;
