const request = require('request');
const express = require("express");
const router = express.Router();
const keys = require("../data/keys");
const hmacSHA256 = require('crypto-js/hmac-sha256');
const Hex = require('crypto-js/enc-hex');
const controller = {};

const endpoint = keys.endpoint;         // SERVIDOR
const username = keys.username;        // USUARIO
const password = keys.password;        // CONTRASEÑA API REST
const publickey = keys.publickey;       // PUBLIC KEY

// SE GENERA EL TOKEN DE AUTENTICACIÓN
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');    // AUTENTICACION

controller.home = (req, res) => {
  res.render("home");
};

// CREACIÓN DEL FORMTOKEN CON MONTO DINÁMICO
controller.checkout = (req, res, next) => {
  // URL de la API para obtener el monto dinámico
  const apiUrl = "https://uyarisoftbk-production.up.railway.app/api/Product/LastOrderPayment/";

  // Realizamos la petición a la API
  request.get(apiUrl, { json: true }, (apiError, apiResponse, apiBody) => {
    if (apiError || !apiBody.success) {
      console.error("Error obteniendo el monto:", apiError || apiBody.message);
      return res.status(500).send("Error obteniendo el monto dinámico.");
    }

    // Extraemos el monto de la API
    const totalAmount = apiBody.data.totalAmount * 100; // Convertimos a centavos
    const orderRandomOrderId = Math.floor(Math.random() * 100000000);

    // Creamos el objeto `order`
    const order = {
      "amount": totalAmount,
      "currency": "PEN",
      "orderId": orderRandomOrderId,
      "customer": {
        "email": "izipay@example.com"
      },
    };

    // Ahora hacemos la solicitud para el formToken
    request.post({
      url: `${endpoint}/api-payment/V4/Charge/CreatePayment`,
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      json: order,
    },
    (error, response, body) => {
      if (body.status === 'SUCCESS') {
        const formtoken = body.answer.formToken;
        res.render("checkout", { formtoken, publickey, endpoint });
      } else {
        console.error(body);
        res.status(500).send('Error generando el token de pago.');
      }
    });
  });
};

// RESTO DEL CÓDIGO PERMANECE IGUAL
controller.paid = (req, res) => {
  const answer = JSON.parse(req.body["kr-answer"]);
  const hash = req.body["kr-hash"];

  const answerHash = Hex.stringify(
    hmacSHA256(JSON.stringify(answer), keys.HMACSHA256)
  );
  const orderDetails = answer.orderDetails;

  if (hash === answerHash)
    res.status(200).render('paid', { 'response': answer.orderStatus, 'details': orderDetails });
  else res.status(500).render('paid', { 'response': 'Error catastrófico' });
};

controller.ipn = (req, res) => {
  const answer = JSON.parse(req.body["kr-answer"]);
  const hash = req.body["kr-hash"];
  const answerHash = Hex.stringify(
    hmacSHA256(JSON.stringify(answer), keys.password)
  );

  console.log('soy la IPN');
  console.log(answer);

  if (hash === answerHash) {
    res.status(200).send({ 'response': answer.orderStatus });
  } else {
    res.status(500).send({ 'response': 'Error catastrófico, puede estar teniendo un intento de fraude' });
  }
};

controller.apiCheckout = (req, res, next) => {
  const apiUrl = "https://uyarisoftbk-production.up.railway.app/api/Product/LastOrderPayment/";

  request.get(apiUrl, { json: true }, (apiError, apiResponse, apiBody) => {
    if (apiError || !apiBody.success) {
      console.error("Error obteniendo el monto:", apiError || apiBody.message);
      return res.status(500).send("Error obteniendo el monto dinámico.");
    }

    const totalAmount = apiBody.data.totalAmount * 100;
    const orderRandomOrderId = Math.floor(Math.random() * 100000000);
    //lo logre :D
    const order = {
      "amount": totalAmount,
      "currency": "PEN",
      "orderId": orderRandomOrderId,
      "customer": {
        "email": "izipay@example.com"
      },
    };

    request.post({
      url: `${endpoint}/api-payment/V4/Charge/CreatePayment`,
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      json: order,
    },
    (error, response, body) => {
      if (body.status === 'SUCCESS') {
        const formtoken = body.answer.formToken;
        res.send({ formtoken, publickey, endpoint });
      } else {
        console.error(body);
        res.status(500).send('Error generando el token de pago.');
      }
    });
  });
};

controller.apiValidate = (req, res, next) => {
  const answer = JSON.parse(req.body["rawClientAnswer"]);
  const hash = req.body["hash"];

  const answerHash = Hex.stringify(
    hmacSHA256(JSON.stringify(answer), keys.HMACSHA256)
  );
  const orderDetails = answer.orderDetails;

  if (hash === answerHash)
    res.status(200).send({ 'response': answer.orderStatus, 'details': orderDetails });
  else res.status(500).send({ 'response': 'Error catastrófico' });

  console.log('Api validate');
  console.log(req.body);
};

module.exports = controller;
