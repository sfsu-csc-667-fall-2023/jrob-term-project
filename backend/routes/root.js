const express = require('express');
const router = express.Router();

router.get("/", (_request, response) => {
  response.send("Hello world from inside a route!");
});

router.get("/:id", (request, response) => {
  response.send(`Other route ${request.params.id}`);
})

module.exports = router;