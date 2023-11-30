const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const { Games, Users } = require("../db");
const GAME_CONSTANTS = require("../../constants/games");

router.get("/create", async (request, response) => {
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString("hex"),
  );
  await Games.addUser(userId, gameId);

  io.emit(GAME_CONSTANTS.CREATED, { id: gameId, createdBy: userId });

  response.redirect(`/games/${gameId}`);
});

router.post("/:id/test", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, email: userEmail } = request.session.user;
  const { sid: userSocketId } = await Users.getUserSocket(userId);
  const { game_socket_id: gameSocketId } = await Games.getGame(gameId);

  const io = request.app.get("io");
  io.to(userSocketId).emit("game:test", {
    source: "User socket",
    gameId,
    userId,
    userSocketId,
    gameSocketId,
  });
  io.to(gameSocketId).emit("game:test", {
    source: "Game socket",
    gameId,
    userId,
    userSocketId,
    gameSocketId,
  });

  response.status(200).send();
});

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

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  const { id: userId, email: userEmail } = request.session.user;

  const { game_socket_id: gameSocketId } = await Games.getGame(id);
  const { sid: userSocketId } = await Users.getUserSocket(userId);

  response.render("game", { id, gameSocketId, userSocketId });
});

module.exports = router;
