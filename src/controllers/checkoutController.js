// npm run dev

const request = require('request');
const express = require("express");
const router = express.Router();
const keys = require("../data/keys");
const order = require("../data/order")
const hmacSHA256 = require('crypto-js/hmac-sha256')
const Hex = require('crypto-js/enc-hex')
const controller = {};

const endpoint = keys.endpoint         // SERVIDOR
const username = keys.username;        // USUARIO
const password = keys.password         // CONTRASEÑA API REST
const publickey = keys.publickey       // PUBLIC KEY


//SE GENERA EL TOKEN DE AUTENTICACIÓN ==============================================//
const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');    // AUTENTICACION


controller.home = (req, res) => {
  res.render("home")
}

// CREACIÓN DEL FORMTOKEN
controller.checkout = (req, res,next) => {
  request.post({
    url: `${endpoint}/api-payment/V4/Charge/CreatePayment`,
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    json: order
  }, 
  function(error, response, body) {
    if (body.status === 'SUCCESS')
    {
      const formtoken = body.answer.formToken;
      res.render("checkout",
      {formtoken ,publickey , endpoint}
    );
    }
    else
    {
      console.error(body);
      res.status(500).send('error');
    }  
  })
};

//MANEJO DE LA URL DE RETORNO
// ----------------- Lado Front valida el estado del pago del lado front kr-post-url-success="result"---------------------- //
controller.paid =  (req,res)=> {

  const answer = JSON.parse(req.body["kr-answer"])
  const hash = req.body["kr-hash"]

  const answerHash = Hex.stringify(
    hmacSHA256(JSON.stringify(answer), keys.HMACSHA256)
  )
    orderDetails = answer.orderDetails

  if (hash === answerHash)
   res.status(200).render('paid', {'response' : answer.orderStatus , 'details':orderDetails} )
  else res.status(500).render('paid', {'response' : 'Error catastrófico'})
}

//IPN ========================================================================//

controller.ipn = (req, res) => {

  // Extrae y parsea (convierte de formato JSON a objeto JavaScript) la respuesta del cuerpo de la solicitud
  const answer = JSON.parse(req.body["kr-answer"]);

  console.log('req.body')
  console.log(req.body)

  // Extrae el hash del cuerpo de la solicitud
  const hash = req.body["kr-hash"];

  // Calcula el hash de la respuesta utilizando HMAC-SHA256 con una clave secreta
  const answerHash = Hex.stringify(
    hmacSHA256(JSON.stringify(answer), keys.password)
  );

  console.log('soy la IPN');
  
  // Imprime la respuesta parseada en la consola
  console.log(answer);

  // Compara el hash recibido con el hash calculado para verificar la integridad y autenticidad de la respuesta
  if (hash === answerHash) {

    res.status(200).send({'response': answer.orderStatus});
  } else {
    res.status(500).send({'response': 'Error catastrófico, puede estar teniendo un intento de fraude'});
  }
};


//API ========================================================================//

controller.apiCheckout = (req,res,next) => {
  request.post({
    url: `${endpoint}/api-payment/V4/Charge/CreatePayment`,
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    json: order
  }, 
  function(error, response, body) {
    if (body.status === 'SUCCESS')
    {
      const formtoken = body.answer.formToken;
      res.send({formtoken , publickey , endpoint})
    }
    else
    {
      console.error(body);
      res.status(500).send('error');
    }  
  })
};


 // Para conectar con el front

 // rawClientAnswer
// Kr-hash-Algorithm: hashAlgorithm
// kr-hash: hash
controller.apiValidate = (req,res,next) => {

  const answer = JSON.parse(req.body["rawClientAnswer"])
  const hash = req.body["hash"]

  const answerHash = Hex.stringify(
    hmacSHA256(JSON.stringify(answer), keys.HMACSHA256)
  )
  orderDetails = answer.orderDetails

  if (hash === answerHash)
    res.status(200).send({ 'response': answer.orderStatus, 'details': orderDetails })
  else res.status(500).send({ 'response': 'Error catastrófico' })

  console.log('Api validate')
  console.log(req.body)
}


module.exports = controller;
