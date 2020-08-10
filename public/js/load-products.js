function createTemplate(item) {
  const template = document.querySelector('#product')
  const product = template.content.cloneNode(true)

  const img = product.querySelector('img')
  img.src = item.images[0]
  img.alt = item.name

  product.querySelector('h2').innerText = item.name
  product.querySelector('.description').innerText = item.description
  product.querySelector('[name=sku]').value = item.id

  return product
}

export async function loadProducts() {
  const data = await fetch('/.netlify/functions/get-products')
    .then(res => res.json())
    .catch(err => console.error(err))

  data.data.forEach(product => {
    document.body.appendChild(createTemplate(product))
  })
}