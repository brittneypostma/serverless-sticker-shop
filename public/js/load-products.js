async function handleFormSubmit(e) {
  e.preventDefault()
  const form = new FormData(e.target)

  const data = {
    sku: form.get('sku'), quantity: 1
  }

  const res = await fetch('/.netlify/functions/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json)

  const stripe = Stripe(res.publishableKey)

  const { error } = await stripe.redirectToCheckout({
    sessionId: res.sessionId
  })

  if (error) {
    console.error(error)
  }
}


function createTemplate(item) {
  const template = document.querySelector('#template')
  const product = template.content.cloneNode(true)

  const img = product.querySelector('img')
  img.src = item.images[0]
  img.alt = item.name

  product.querySelector('h2').innerText = item.name
  product.querySelector('[name=sku]').value = item.id

  const form = product.querySelector('form')
  form.addEventListener('submit', handleFormSubmit)

  return product
}

export async function loadProducts() {
  const main = document.querySelector('main')
  const prices = await fetch('/.netlify/functions/get-products')
    .then(res => res.json())
    .catch(err => console.error(err))
  prices.data.forEach(price => {
    main.appendChild(createTemplate(price.product))
  })
}