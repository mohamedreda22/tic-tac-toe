import React, { useState, useEffect } from 'react';
import './tictactoe.css';

export default function Tictactoe() {
  const [gameState, setGameState] = useState("---O---X-");
  const [player, setPlayer] = useState("O");
  const [recommendedMove, setRecommendedMove] = useState(null);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const handleCellClick = (index) => {
    if (!gameOver && gameState[index] === "-") {
      const updatedGameState =
        gameState.substring(0, index) + player + gameState.substring(index + 1);
      setGameState(updatedGameState);
      setPlayer(player === "O" ? "X" : "O");
    }
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

  const checkDraw = (gameState) => {
    if(gameState.includes("-")){
        return false;
    }
    return true;
  };
  const handleReset = () => {
    setGameState("---O---X-");
    setPlayer("O");
    setRecommendedMove(null);
    setError(null);
    setGameOver(false);
  };

  useEffect(() => {
    if (!gameOver) {
    fetch(`https://tttapi.herokuapp.com/api/v1/${gameState}/${player}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        const recommendedMove = data.move;
        console.log("Recommended move:", recommendedMove);
        setRecommendedMove(recommendedMove);

        if (checkWin(player, gameState) || checkDraw(gameState)) {
            setGameState(true);
        } else {
          const updatedGameState =
            gameState.substring(0, recommendedMove) +
            player +
            gameState.substring(recommendedMove + 1);
          setGameState(updatedGameState);
          setPlayer(player === "O" ? "X" : "O");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An error occurred while fetching the recommendation.");
      });
    }
  }, [gameState, player, gameOver]);


  return (
    <div className='tictactoe-container'>
      <h1>Tic Tac Toe</h1>
      <h2>Recommended Move: {recommendedMove}</h2>
      <h2>Game State: {gameState}</h2>
      <h2>Player: {player}</h2>
      <h2>Error: {error}</h2>
    {gameOver && <h2 className="game-over-message">Game Over</h2>}
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
        <button className='reset-button' onClick={handleReset}>Reset Game</button>
    </div>
    );
}
