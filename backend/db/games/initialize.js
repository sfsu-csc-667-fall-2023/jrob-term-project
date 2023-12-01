const { createShuffledDeck } = require("./create-shuffled-deck");
const { getUsers } = require("./get-users");
const { getGame } = require("./get-game");
const { getPlayerBySeat } = require("./get-player-by-seat");
const { setCurrentPlayer } = require("./set-current-player");
const { drawCards } = require("./draw-cards");
const { dealCards } = require("./deal-cards");

const initialize = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);

  await createShuffledDeck(gameId);
  const firstPlayer = await getPlayerBySeat(0, gameId).then(({ user_id }) =>
    setCurrentPlayer(user_id, gameId),
  );

  const users = await getUsers(gameId);
  users.push({ user_id: 0 }); // TODO: add game sid here

  const cards = await drawCards(gameId, users.length * 2);
  const dealtCards = await dealCards(users, cards, gameId);

  console.log({ dealtCards });

  return {
    game_id: gameId,
    game_socket_id,
    current_player: firstPlayer,
    players: users,
    hands: dealtCards.reduce((memo, entry) => {
      if (entry.user_id !== 0) {
        memo[entry.user_id] = memo[entry.user_id] || [];
        memo[entry.user_id].push(entry);
      }

      return memo;
    }, {}),
  };
};

module.exports = { initialize };
