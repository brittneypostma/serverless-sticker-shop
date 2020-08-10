const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = (event, context, callback) => {
  stripe.products.list((err, products) => {
    if (err) {
      callback(err)
    }
    else {
      callback(null,
        {
          statusCode: 200,
          body: JSON.stringify(products),
        })
    }
  })
}
