const { Games } = require("../../db");

const method = "get";
const route = "/:id/join";

const handler = async (request, response) => {
  const io = request.app.get("io");

  const { id: gameId } = request.params;
  const { id: userId, email: userEmail } = request.session.user;

  const gameUsers = Games.usersInGame(gameId);
  const userInGameAlready = gameUsers.includes(
    (entry) => entry.user_id === userId,
  );

  if (userInGameAlready) {
    // TODO: Add an error message
    response.redirect("/lobby");
  } else {
    await Games.addUser(userId, gameId);

    // TODO: Replicate join logic here; remove socket race condition

    response.redirect(`/games/${gameId}`);
  }
};

module.exports = { method, route, handler };

/*
router.get("/:id/join", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, email: userEmail } = request.session.user;

  const io = request.app.get("io");

  await Games.addUser(userId, gameId);
  io.emit(GAME_CONSTANTS.USER_ADDED, { userId, userEmail, gameId });

  const userCount = await Games.userCount(gameId);

  if (userCount === 2) {
    const gameState = await Games.initialize(gameId);
    const { game_socket_id: gameSocketId } = await Games.getGame(gameId);

    io.to(gameSocketId).emit(GAME_CONSTANTS.START, {
      currentPlayer: gameState.current_player,
    });
    Object.keys(gameState.hands).forEach((playerId) => {
      const playerSocket = Users.getUserSocket(playerId);

      io.to(playerSocket).emit(GAME_CONSTANTS.STATE_UPDATED, {
        hand: gameState.hands[playerId],
      });
    });
  }

  response.redirect(`/games/${gameId}`);
});
*/
