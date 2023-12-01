const database = require("../connection");
const { connection: db } = database;

const DRAW_CARDS = `
  SELECT card_id FROM game_cards
  WHERE game_id=$1 AND user_id=0
  ORDER BY card_order LIMIT $2
`;

const drawCards = (gameId, cardCount) =>
  db.many(DRAW_CARDS, [gameId, cardCount]);

module.exports = { drawCards };
