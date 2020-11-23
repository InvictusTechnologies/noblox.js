const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['universeId', 'productId', 'name']
exports.optional = ['priceInRobux', 'description', 'iconImageAssetId', 'jar']

const nextFunction = (jar, xcsrf, universeId, productId, prodName, priceInRobux, prodDescription, iconImageAssetId) => {
  return http({
    url: `//develop.roblox.com/v1/universes/${universeId}/developerproducts/${productId}/update`,
    options: {
      resolveWithFullResponse: true,
      method: 'POST',
      jar: jar,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': xcsrf
      },
      body: JSON.stringify({
        Name: prodName,
        PriceInRobux: priceInRobux,
        Description: prodDescription,
        IconImageAssetId: iconImageAssetId
      })
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      return JSON.parse(res.body)
    } else {
      const body = JSON.parse(res.body) || {}
      if (body.errors && body.errors.length > 0) {
        const errors = body.errors.map((e) => {
          return e.message
        })
        throw new Error(`${res.statusCode} ${errors.join(', ')}`)
      }
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.universeId, args.productId, args.name, args.priceInRobux, args.description, args.iconImageAssetId)
  })
}
