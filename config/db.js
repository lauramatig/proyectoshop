//requerimos la lireria de mysql para poder crear la conexion.
var mysql = require("mysql");

//mysql.createConnection => utilizamos el metodo createConnection de mysql para
//crear la conexion.
var connection = mysql.createConnection({
    //host => el host en el que estamos trabajando.
    //user => nombre del usuario de base de datos.(root)
    //password => la contraseña que tengas de acceso/si no tienes no se pone nada lo dejas en blanco.
    //database => la base de datos que quieres consultar.
    host: "localhost",
    user: "root",
    password: "root",
    database: "store"
});

//primero he creado la conexion ahora con este comando lo conecto.
//utilizamos la variable connection que tiene la creacion de la conexion y utilizamos el metodo de mysql
//connect para establecer la conexion.
connection.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log("conexion con base de datos correcta");
    }
});

//exporto connection.
module.exports = connection;
