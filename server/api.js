const express = require('express');
const cors = require('cors');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const TicTacToe = require('../src/tictactoe.js'); 
const { getRecommendation } = require('../src/getRecommendation.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

let gameState = "---O---X-"; // Initial game state
let currentPlayer = "O"; // Initial player

app.get('/', function(req, res) {    
    res.send('Hello, this is the root page!');
  });

app.get('/api/v1', function(req, res) {
  try {
    const { gameState, player } = req.body;
    const recommendation = getRecommendation(gameState, player);
    res.status(200).json({ recommendation });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
  });
  app.get('/', function(req, res) {
    res.send('Hello, this is the root page!');
  });
  

  app.get('/tictactoe', function(req, res) {
    const initialData = {
      gameState: "---O---X-", 
      player: "O", 
    };
    const appString = ReactDOMServer.renderToString(
      React.createElement(TicTacToe, initialData)
    );
    res.send(appString);
  });
  


// Function to check for a win
function checkWin(player, gameState) {
  // Implement your win condition checks here
  // Return true if the player wins, otherwise return false
    if (gameState[0] === player && gameState[1] === player && gameState[2] === player) return true;
    if (gameState[3] === player && gameState[4] === player && gameState[5] === player) return true;
    if (gameState[6] === player && gameState[7] === player && gameState[8] === player) return true;
    if (gameState[0] === player && gameState[3] === player && gameState[6] === player) return true;
    if (gameState[1] === player && gameState[4] === player && gameState[7] === player) return true;
    if (gameState[2] === player && gameState[5] === player && gameState[8] === player) return true;
    if (gameState[0] === player && gameState[4] === player && gameState[8] === player) return true;
    if (gameState[2] === player && gameState[4] === player && gameState[6] === player) return true;

  return false;
}

// Function to check for a draw
function checkDraw(gameState) {
  // Implement your draw condition check here
  // Return true if the game is a draw, otherwise return false
    if (!gameState.includes('-')) return true;

  return false;
}

// API endpoint to make a move
app.post('/api/move', (req, res) => {
  const { index } = req.body;

  // Check if the move is valid
  if (gameState[index] === "-" && !checkWin(currentPlayer, gameState) && !checkDraw(gameState)) {
    // Update the game state with the move
    const newGameState = gameState.split('');
    newGameState[index] = currentPlayer;
    gameState = newGameState.join('');

    // Toggle the current player
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    res.status(200).json({ message: 'Move successful' });
  } else {
    res.status(400).json({ error: 'Invalid move' });
  }
});

// API endpoint to check for a winner
app.get('/api/checkWinner', (req, res) => {
  if (checkWin(currentPlayer === "X" ? "O" : "X", gameState)) {
    res.status(200).json({ winner: currentPlayer === "X" ? "O" : "X" });
  } else {
    res.status(200).json({ winner: null });
  }
});

// API endpoint to check for a draw
app.get('/api/checkDraw', (req, res) => {
  if (checkDraw(gameState)) {
    res.status(200).json({ draw: true });
  } else {
    res.status(200).json({ draw: false });
  }
});

// API endpoint to reset the game
app.post('/api/reset', (req, res) => {
  gameState = "---O---X-"; // Reset the game state
  currentPlayer = "O"; // Reset the player
  res.status(200).json({ message: 'Game reset' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
