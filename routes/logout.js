var express = require("express");
var router = express.Router();
const connection = require("../config/db.js");



//para borrar los datos de la sesion respecto al usuario que esta logeado
router.get("/", function (req, res, next) {
    //vuelvo a poner los datos como estaban inicialmente
    req.session.is_admin = "0";
    req.session.user = {};
    res.render("index", { error: "", is_admin: "0", user: {} });
});


module.exports = router;