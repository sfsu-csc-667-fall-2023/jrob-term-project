const isAuthenticated = (request, response, next) => {
  if (request.session.user !== undefined) {
    next();
  } else {
    response.redirect("/");
  }
};

module.exports = { isAuthenticated };
