const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const conexion = require("../database/db");
const { promisify } = require("util");

//procedimiento para registrarnos
exports.register = async (req, res) => {
  try {
    const { name, user, pass, email, phone, department, address, province } =
      req.body;
    let passHash = await bcryptjs.hash(pass, 8); // Encriptar la contraseña

    // Insertar los datos en la base de datos
    conexion.query(
      "INSERT INTO users SET ?",
      {
        user: user,
        name: name,
        pass: passHash,
        email: email,
        phone: phone,
        department: department,
        address: address,
        province: province,
      },
      (error, results) => {
        if (error) {
          console.log(error);
          return res.render("auth/register", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Hubo un problema con el registro",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "/auth/register",
          });
        }
        res.redirect("/"); // Redirigir después de registrar
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = req.body.user;
    const pass = req.body.pass;

    if (!user || !pass) {
      res.render("auth/login", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y password",
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: "/auth/login",
      });
    } else {
      conexion.query(
        "SELECT * FROM users WHERE user = ?",
        [user],
        async (error, results) => {
          if (
            results.length == 0 ||
            !(await bcryptjs.compare(pass, results[0].pass))
          ) {
            res.render("auth/login", {
              alert: true,
              alertTitle: "Error",
              alertMessage: "Usuario y/o Password incorrectas",
              alertIcon: "error",
              showConfirmButton: true,
              timer: false,
              ruta: "/auth/login",
            });
          } else {
            //inicio de sesión OK
            const id = results[0].id;
            // const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
            //   expiresIn: process.env.JWT_TIEMPO_EXPIRA,
            // });
            //generamos el token SIN fecha de expiracion
            const token = jwt.sign({ id: id }, process.env.JWT_SECRETO);

            const cookiesOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };
            res.cookie("jwt", token, cookiesOptions);
            res.render("auth/login", {
              alert: true,
              alertTitle: "Conexión exitosa",
              alertMessage: "¡LOGIN CORRECTO!",
              alertIcon: "success",
              showConfirmButton: false,
              timer: 800,
              ruta: "",
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETO
      );
      conexion.query(
        "SELECT * FROM users WHERE id = ?",
        [decodificada.id],
        (error, results) => {
          if (!results) {
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    res.redirect("/home");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/home");
};
