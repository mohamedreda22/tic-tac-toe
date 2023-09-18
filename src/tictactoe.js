import React, { useState, useEffect } from 'react';
import './tictactoe.css';
import axios from 'axios';
import  {getRecommendation }  from './getRecommendation';

export default function Tictactoe() {
  const [gameState, setGameState] = useState("---O---X-");
  const [player, setPlayer] = useState("O");
  const [recommendedMove, setRecommendedMove] = useState(null);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(null);



  const handleCellClick = (index) => {
    if (gameState[index] !== "-" || gameOver) {
      return;
    }

    makeMove(index);

    let newGameState = gameState.split("");
    newGameState[index] = player;
    setGameState(newGameState.join(""));
    setPlayer(player === "X" ? "O" : "X");

    if (checkWin(player, newGameState)) {
      setWinner(player);
      setGameOver(true);
      return ;
    }
    if (checkDraw0(newGameState)) {
    checkDraw(true);
    setGameOver(true);
    return ;
  };    
  checkWinner();
  };

  const checkWin = (player, gameState) => {
    if(gameState[0] === player && gameState[1] === player && gameState[2] === player){
        return true;
      }
      if(gameState[3] === player && gameState[4] === player && gameState[5] === player){
          return true;
          }
      if(gameState[6] === player && gameState[7] === player && gameState[8] === player){
          return true;
          }
      if(gameState[0] === player && gameState[3] === player && gameState[6] === player){
          return true;
          }
      if(gameState[1] === player && gameState[4] === player && gameState[7] === player){
          return true;
          }
      if(gameState[2] === player && gameState[5] === player && gameState[8] === player){
          return true;
          }
      if(gameState[0] === player && gameState[4] === player && gameState[8] === player){
          return true;
          }
      if(gameState[2] === player && gameState[4] === player && gameState[6] === player){
          return true;
          }
      return false;

  };
 
  const checkDraw0 = (gameState) => {
    if (!gameState.includes('-')) {
      setDraw(true);
      setGameOver(true);
      return true;
    }
    return false;
  }; 

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const recommendationData = await getRecommendation (gameState, player);
        // Handle the recommendation data (recommendationData) as needed
        console.log('Recommendation Data:', recommendationData);
        if (recommendationData && recommendationData.recommendation) {
          setRecommendedMove(recommendationData.recommendation); }
         } catch (error) {
        console.error('Error fetching recommendation:', error);
        setError(error);
      }
    };

    if (!gameOver && player === "O") {
      fetchRecommendation();
    }
  }, [gameState, player, gameOver]);
  

   const makeMove = async (index) => {
    try {
     await axios.post('http://localhost:8000/api/move', { index });      
     console.log('Move made:', index + 1);
     alert("Move made", index + 1);
    } catch (error) {
      console.error('Error making a move:', error);
    }
  }; 
  
 const checkWinner = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/checkWinner');
      const { winner } = response.data;

      if (winner) {
        setWinner(winner);
        setGameOver(true);
        resetGame();
      }
    } catch (error) {
      console.error('Error checking for a winner:', error);
    }
  };
   
  const checkDraw = async () => {
    try {
       await axios.get('http://localhost:8000/api/checkDraw');
    } catch (error) {
      console.error('Error checking for a draw:', error);
    }
  };
   
  const resetGame = async () => {
    try {
      await axios.post('http://localhost:8000/api/reset');
      // Handle the response as needed
      setGameState("---O---X-");
      setPlayer("O");
      setRecommendedMove(null);
      setError(null);
      setGameOver(false);
    } catch (error) {
      console.error('Error resetting the game:', error);
    }
  };
  
  const startNewGame = async () => {
    try {
       await axios.post('http://localhost:8000/api/start');
      // Handle the response as needed
      setGameState("---O---X-");
      setPlayer("O");
      setRecommendedMove(null);
      setError(null);
      setGameOver(false);
    } catch (error) {
      console.error('Error starting a new game:', error);
    }
  };
  
  return (
    <div className='tictactoe-container'>
      <div>
        {gameOver&&<button className='start-button' onClick={startNewGame}>Start New Game</button>}
      </div>
      <h1>Tic Tac Toe</h1>
      <h2> {recommendedMove !== null ? recommendedMove : 'No recommendation yet'}</h2>
      <h2>Game State: {gameState}</h2>
      <h2>Player: {player}</h2>
      <h2> {error && error.message}</h2>
    {gameOver && <h2 className="game-over-message">Game Over</h2>}
    {winner && <h2 className="game-over-message">Player {winner} wins!</h2>}
    {draw && <h2 className="game-over-message">Draw!</h2>}
        <div className="board">
        {[0, 1, 2].map((row) => (
            <div className="row" key={row}>
                {[0, 1, 2].map((col) => (
                    <div 
                    className={`cell ${gameOver ? 'disabled' : ''}`}
                    key={row * 3 + col}
                     onClick={() => handleCellClick(row * 3 + col)}>
                        {gameState[row * 3 + col]}
                        </div>
                ))}
            </div>
        ))}
        </div>
        <button className='reset-button' onClick={resetGame}>Reset Game</button>
    </div>
    );
}
