function getRecommendation(gameState, player) {
  if (gameState === "---O---X-") {
    return "Some recommendation"; 
  } else {
    return null; 
  }
}

module.exports = { getRecommendation };
