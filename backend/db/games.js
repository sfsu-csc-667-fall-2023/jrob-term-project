const { create } = require("./games/create");
const { addUser } = require("./games/add-user");
const { getGame } = require("./games/get-game");
const { userCount } = require("./games/user-count");
const { initialize } = require("./games/initialize");
const { availableGamesForUser } = require("./games/available-games-for-user");
const { usersInGame } = require("./games/users-in-game");
const { currentGamesForUser } = require("./games/current-games-for-user");
const { readyPlayer } = require("./games/ready-player");

module.exports = {
  create,
  addUser,
  getGame,
  userCount,
  initialize,
  availableGamesForUser,
  currentGamesForUser,
  usersInGame,
  readyPlayer,
};
