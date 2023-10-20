const express = require('express');
const router = express.Router();

router.get("/", (_request, response) => {
  response.send("Hello world from inside a route!");
});

module.exports = router;