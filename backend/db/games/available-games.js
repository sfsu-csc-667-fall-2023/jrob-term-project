const database = require("../connection");
const { connection: db, pgp } = database;

const AVAILABLE_GAMES = `
  SELECT * FROM games, game_users
  WHERE game_users.user_id != $1
`;

const availableGamesForUser = (userId) => db.any(AVAILABLE_GAMES, [userId]);

module.exports = { availableGamesForUser };
