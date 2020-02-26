var express = require("express");
var router = express.Router();
const connection = require("../config/db.js");
var multer = require("multer");

//para SUBIR IMAGENES
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

//un json con todos los objetos que tengo de ese archivo
//lo que recibimos de ese storage lo pasamos a una variable para poder a utilizarlo
var upload = multer({ storage: storage });


//para HACER SELECT QUE ME SACA LA PANTALLA DE TODOS LOS ARTICULOS
router.get("/", function (req, res, next) {
    let sql = "SELECT * FROM product";
    connection.query(sql, (error, data) => {
        //recupero si hay alguien logueado, este o no este envio esos valores por defecto
        let is_admin = "0";
        let user = {};
        if (req.session.is_admin) {
            is_admin = req.session.is_admin;
        }

        if (req.session.user) {
            user = req.session.user;
        }
        //le envio category porque el siempre me va a pedir category
        res.render("products", { data: data, category: "", is_admin: is_admin, user: user });

    });
});


//para HACER SELECT QUE ME SACA CADA CATEGORIA
router.get("/category/:category", function (req, res, next) {
    let category = req.params.category;
    console.log(req.params.category);
    let sql = "SELECT * FROM product WHERE category = ?";
    connection.query(sql, [category], (error, data) => {
        //recupero si hay alguien logueado, este o no este envio esos valores por defecto
        let is_admin = "0";
        let user = {};
        if (req.session.is_admin) {
            is_admin = req.session.is_admin;
        }

        if (req.session.user) {
            user = req.session.user;
        }
        res.render("products", { data: data, category: category, is_admin: is_admin, user: user });

    });
});

//para mostrar el formulario de añadir un articulo
router.get("/add", function (req, res, next) {
    //recupero si hay alguien logueado, este o no este envio esos valores por defecto
    let is_admin = "0";
    let user = {};
    if (req.session.is_admin) {
        is_admin = req.session.is_admin;
    }

    if (req.session.user) {
        user = req.session.user;
    }
    res.render("addProduct", { is_admin: is_admin, user: user });
});


//para INSERTAR productos
router.post("/add", upload.single("myFile"), function (req, res, next) {
    //campos de product
    let id_user = req.body.id_user;
    let name_product = req.body.name_product;
    let brand = req.body.brand;
    let category = req.body.category;
    let description = req.body.description;
    let price = req.body.price;
    let stock = req.body.stock;
    //si no subo ninguna imagen ya que el campo de imagen no viene relleno como el resto de campos
    //en req.file -> informacion de la imagen en general
    //req.file.originalname -> nombre de la imagen
    let img = "";
    if (req.file && req.file.originalname) {
        img = req.file.originalname;
    }

    let sql2 = "INSERT INTO product set? ";
    connection.query(sql2, { id_user, name_product, brand, category, description, price, stock, img }, (error, product) => {
        res.redirect("/products");
    });
});


//para ELIMINAR
router.get("/delete/:id_product", function (req, res) {
    let id = req.params.id_product;
    connection.query("DELETE  FROM product WHERE id_product = " + id, function (err, result) {
        res.redirect("/products");
    });
});


//para EDITAR
router.get("/edit/:id_product", function (req, res) {
    //recupero si hay alguien logueado, este o no este envio esos valores por defecto
    let is_admin = "0";
    let user = {};
    if (req.session.is_admin) {
        is_admin = req.session.is_admin;
    }

    if (req.session.user) {
        user = req.session.user;
    }
    let id = req.params.id_product;
    connection.query(
        "SELECT * FROM product WHERE id_product = ?", [id], (err, results) => {
            res.render("editProduct", { results: results[0], is_admin: is_admin, user: user });
            console.log(results);
        }
    );
});

//para DETALLE para ver un unico producto
router.get("/view/:id_product", function (req, res) {
    let id = req.params.id_product;
    let is_admin = "0";
    let user = {};
    if (req.session.is_admin) {
        is_admin = req.session.is_admin;
    }

    if (req.session.user) {
        user = req.session.user;
    }
    connection.query(
        "SELECT * FROM product WHERE id_product = ?", [id], (err, results) => {
            res.render("productDetails", { data: results[0], is_admin: is_admin, user: user });
        }
    );
});

//para CUANDO MODIFICO LOS DATOS POST PARA ENVIARLOS.
router.post("/update/:id_product", upload.single("myFile"), function (req, res) {
    let id = req.params.id_product;
    let id_user = req.body.id_user;
    let name_product = req.body.name_product;
    let brand = req.body.brand;
    let category = req.body.category;
    let description = req.body.description;
    let price = req.body.price;
    let stock = req.body.stock;
    let img = "";
    if (req.file && req.file.originalname) {
        img = req.file.originalname;
    }

    console.log(req.body)
    connection.query(
        "UPDATE product set? WHERE id_product = " + id,
        { id_user, name_product, brand, category, description, price, stock, img },
        (err, results) => {
            res.redirect("/products");
        }
    );
});



module.exports = router;
