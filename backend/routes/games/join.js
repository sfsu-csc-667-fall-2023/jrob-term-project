const { Games } = require("../../db");

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

module.exprts = { route, handler };
