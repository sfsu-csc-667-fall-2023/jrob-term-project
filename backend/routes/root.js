const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
  const name = "Jrob";

  response.render("root", { name });
});

module.exports = router;
