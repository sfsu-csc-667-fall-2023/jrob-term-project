const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/ready";

const handler = async (request, response) => {
  const io = request.app.get("io");

  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;

  const { ready_count } = await Games.readyPlayer(userId, gameId);

  if (ready_count === 2) {
    const gameState = await Games.initialize(parseInt(gameId));

    io.to(gameState.game_socket_id).emit(
      GAME_CONSTANTS.STATE_UPDATED,
      gameState,
    );
    // TODO: Emit player hands (split up gameState)
  }

  response.status(200).send();
};

module.exports = { method, route, handler };
