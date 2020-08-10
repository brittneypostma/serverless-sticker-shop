const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const fetch = require('node-fetch')

exports.handler = async (event) => {
  const { sku } = JSON.parse(event.body)
  const products = await fetch(`${process.env.URL}/.netlify/functions/get-products`)
    .then(res => res.json())
    .catch(err => console.error(err))
  const id = products.data.find(async (product) => product.id === sku)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA']
    },
    success_url: `${process.env.URL}/success.html`,
    cancel_url: process.env.URL,
    line_items: [
      {
        price: id,
        quantity: 1
      }
    ],
    mode: 'payment'
  })
  return {
    statusCode: 200,
    body: JSON.stringify({
      sessionId: session.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
  }
}
