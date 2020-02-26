var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  //recupero si hay alguien logueado, este o no este envio esos valores por defecto
  let is_admin = "0";
  let user = {};
  if (req.session.is_admin) {
    is_admin = req.session.is_admin;
  }

  if (req.session.user) {
    user = req.session.user;
  }
  res.render("index", { is_admin: is_admin, user: user });
});

module.exports = router;
