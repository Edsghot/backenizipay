const orderRandomOrderId = Math.floor( Math.random()*100000000)

const  order = {
    "amount":   100050,
    "currency": "PEN",
    "orderId":  orderRandomOrderId,
    "customer": {
        "email": "izipay@example.com"
    },
  }
  module.exports = order