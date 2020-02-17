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

//cuando envio un formulario con un post
//single es porque se suben las imagenes de una en una no se suben por ejemplo dos a la vez
//myFile es el nombre que le he dado al inpunt del post
// router.post("/", upload.single("myFile"), function (req, res, next) {
//     let img = req.file.originalname;
//     console.log("holaaaaaaa", req.file.originalname);

//     connection.query(
//         "INSERT INTO `product` (img) VALUES ('" + img + "')", (error, results) => {
//             console.log("errrrror", error);
//             res.redirect("/products");
//         });
// });

//para HACER SELECT QUE ME SACA LA PANTALLA DE TODOS LOS ARTICULOS
router.get("/", function (req, res, next) {
    let sql = "SELECT * FROM product";
    connection.query(sql, (error, data) => {
        res.render("products", { data: data });
    });
});

//para HACER SELECT QUE ME SACA CADA CATEGORIA
router.get("/category/:category", function (req, res, next) {
    let category = req.params.category;
    console.log(req.params.category);
    let sql = "SELECT * FROM product WHERE category = ?";
    connection.query(sql, [category], (error, data) => {
        res.render("products", { data: data, category: category });
    });
});

//para mostrar el formulario de añadir un articulo
router.get("/add", function (req, res, next) {
    res.render("addProduct");
});


//para INSERTAR
router.post("/add", upload.single("myFile"), function (req, res, next) {
    //campos de product
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
    let id = req.params.id_product;
    connection.query(
        "SELECT * FROM product WHERE id_product = ?", [id], (err, results) => {
            res.render("editProduct", { results: results[0] });

        }
    );
});

//para DETALLE para ver un unico producto
router.get("/view/:id_product", function (req, res) {
    let id = req.params.id_product;
    connection.query(
        "SELECT * FROM product WHERE id_product = ?", [id], (err, results) => {
            res.render("productDetails", { data: results[0] });
        }
    );
});

//para CUANDO MODIFICO LOS DATOS POST PARA ENVIARLOS.
router.post("/update/:id_product", function (req, res) {
    let id = req.params.id_product;
    let id_user = req.body.id_user;
    let name_product = req.body.name_product;
    let brand = req.body.brand;
    let category = req.body.category;
    let description = req.body.description;
    let price = req.body.price;
    let stock = req.body.stock;
    connection.query(
        "UPDATE product set? WHERE id_product = " + id,
        { id_user, name_product, brand, category, description, price, stock },
        (err, results) => {
            res.redirect("/products");
        }
    );
});



module.exports = router;
