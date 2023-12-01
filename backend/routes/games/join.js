const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "get";
const route = "/:id/join";

const handler = async (request, response) => {
  const io = request.app.get("io");

  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;

  const gameUsers = await Games.usersInGame(gameId);
  const userInGameAlready = gameUsers.includes(
    (entry) => entry.user_id === userId,
  );

  if (userInGameAlready) {
    // TODO: Add an error message
    response.redirect("/lobby");
  } else {
    await Games.addUser(userId, gameId);

    const userCount = await Games.userCount(gameId);
    if (userCount === 2) {
      const { game_socket_id: gameSocketId } = await Games.getGame(gameId);

      io.to(gameSocketId).emit(GAME_CONSTANTS.START);
    }

    response.redirect(`/games/${gameId}`);
  }
};

module.exports = { method, route, handler };
