async function handleFormSubmit(event) {
  event.preventDefault()
  const form = new FormData(event.target)

  const data = {
    sku: form.get('sku'),
    quantity: 1,
  }

  const response = await fetch('/.netlify/functions/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
  console.log(response)
  const stripe = await Stripe(response.publishableKey)

  const { error } = await stripe.redirectToCheckout({
    sessionId: response.sessionId,
  })

  if (error) {
    console.error(error)
  }
}

function createTemplate(item) {
  const template = document.querySelector('#template')
  const product = template.content.cloneNode(true)

  const img = product.querySelector('img')
  img.src = item.product.images[0]
  img.alt = item.product.name
  product.querySelector('h2').innerText = item.product.name
  product.querySelector('[name=sku]').value = item.id
  product.querySelector('.price').innerText = `$${Math.round(
    item.unit_amount_decimal / 100
  ).toFixed(2)}`
  const form = product.querySelector('form')
  form.addEventListener('submit', handleFormSubmit)

  return product
}

export async function loadProducts() {
  const main = document.querySelector('main')
  const prices = await fetch('/.netlify/functions/get-products')
    .then((res) => res.json())
    .catch((err) => console.error(err))
  prices.data.forEach((price) => {
    main.appendChild(createTemplate(price))
  })
}
