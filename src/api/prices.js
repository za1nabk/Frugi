const KROGER_CLIENT_ID = import.meta.env.VITE_KROGER_CLIENT_ID
const KROGER_CLIENT_SECRET = import.meta.env.VITE_KROGER_CLIENT_SECRET

let krogerToken = null
let tokenExpiry = 0

// Get Kroger OAuth token
async function getKrogerToken() {
  if (krogerToken && Date.now() < tokenExpiry) return krogerToken
  const creds = btoa(`${KROGER_CLIENT_ID}:${KROGER_CLIENT_SECRET}`)
  const res = await fetch('https://api.kroger.com/v1/connect/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=product.compact'
  })
  if (!res.ok) throw new Error('Kroger auth failed')
  const data = await res.json()
  krogerToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return krogerToken
}

// Search Kroger for a product near a location code
async function searchKroger(term, locationId = '01400943') {
  try {
    const token = await getKrogerToken()
    const url = `https://api.kroger.com/v1/products?filter.term=${encodeURIComponent(term)}&filter.locationId=${locationId}&filter.limit=3`
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
    if (!res.ok) return null
    const data = await res.json()
    const product = data.data?.[0]
    if (!product) return null
    const price = product.items?.[0]?.price?.regular || product.items?.[0]?.price?.promo
    return price ? { name: product.description, price: parseFloat(price), store: 'Kroger/QFC' } : null
  } catch {
    return null
  }
}

// Search Trader Joe's data
async function searchTraderJoes(term) {
  try {
    const res = await fetch('/traderjoes.json')
    const data = await res.json()
    const lower = term.toLowerCase()
    const match = data.items.find(item =>
      item.keywords.some(k => lower.includes(k) || k.includes(lower)) ||
      item.name.toLowerCase().includes(lower)
    )
    if (!match) return null
    return { name: match.name, price: match.price, store: "Trader Joe's", unit: match.unit }
  } catch {
    return null
  }
}

// Returns an estimated price for known grocery items, or null for unknown items
function mockPrice(term, store) {
  const base = term.toLowerCase()
  const mockPrices = {
    'banana': 0.29, 'bananas': 0.29, 'milk': 3.49, 'eggs': 3.99,
    'bread': 2.99, 'chicken': 5.99, 'beef': 6.99, 'rice': 2.49,
    'pasta': 1.49, 'olive oil': 8.49, 'yogurt': 3.49, 'cheese': 4.99,
    'butter': 4.99, 'oat milk': 3.99, 'almond milk': 3.49, 'coffee': 8.99,
    'orange juice': 3.99, 'spinach': 2.99, 'broccoli': 1.99, 'avocado': 1.29,
    'tomato': 2.49, 'onion': 1.49, 'garlic': 1.29, 'potato': 3.99,
    'apple': 1.99, 'lemon': 0.79, 'salmon': 9.99, 'tuna': 1.79,
    'peanut butter': 3.49, 'soy sauce': 2.99, 'broth': 2.49, 'oats': 3.49,
    'rolled oats': 3.49, 'jasmine rice': 2.99, 'white rice': 2.49,
  }
  const multipliers = { 'Kroger/QFC': 1.0, "Trader Joe's": 0.92, 'Fred Meyer': 1.08, 'Walmart': 0.88 }
  for (const [key, val] of Object.entries(mockPrices)) {
    if (base.includes(key)) {
      const mult = multipliers[store] || 1
      return parseFloat((val * mult).toFixed(2))
    }
  }
  // Unknown item — return null instead of a fake fallback price
  return null
}

// Get prices for all stores for a single item
export async function getPricesForItem(term) {
  const stores = ['Kroger/QFC', "Trader Joe's", 'Fred Meyer', 'Walmart']

  const [krogerResult, tjResult] = await Promise.all([
    searchKroger(term),
    searchTraderJoes(term)
  ])

  return stores.map(store => {
    if (store === 'Kroger/QFC' && krogerResult) {
      return { store, price: krogerResult.price, name: krogerResult.name || term, real: true }
    }
    if (store === "Trader Joe's" && tjResult) {
      return { store, price: tjResult.price, name: tjResult.name || term, real: true }
    }
    const estimated = mockPrice(term, store)
    return { store, price: estimated, name: term, real: false, unavailable: estimated === null }
  })
}

// Get prices for all items in the list
export async function getPricesForList(items) {
  const results = await Promise.all(items.map(async (item) => {
    const prices = await getPricesForItem(item)
    return { item, prices }
  }))
  return results
}

// Calculate trip optimizer options
export function calculateTripOptions(priceResults) {
  if (!priceResults?.length) return []
  const stores = ['Kroger/QFC', "Trader Joe's", 'Fred Meyer', 'Walmart']

  // Only count items that have at least one real/estimated price
  const pricedResults = priceResults.filter(({ prices }) =>
    prices.some(p => p.price !== null)
  )
  if (!pricedResults.length) return []

  const priceOf = (prices, store) => {
    const p = prices.find(p => p.store === store)
    return p?.price ?? null
  }

  // Best single store (skip stores where some items have no price)
  const storeBaskets = stores.map(store => {
    let total = 0
    for (const { prices } of pricedResults) {
      const p = priceOf(prices, store)
      if (p === null) return null  // store is missing a price for this item
      total += p
    }
    return { store, total: parseFloat(total.toFixed(2)) }
  }).filter(Boolean).sort((a, b) => a.total - b.total)

  if (!storeBaskets.length) return []

  const cheapestOne = storeBaskets[0]

  // With only 1 item (or all items priced best at the same store), just show one stop
  const bestPerItem = pricedResults.map(({ item, prices }) => {
    const sorted = prices.filter(p => p.price !== null).sort((a, b) => a.price - b.price)
    return { item, best: sorted[0] }
  })
  const bestStores = new Set(bestPerItem.map(x => x.best?.store).filter(Boolean))
  const bestPerItemTotal = bestPerItem.reduce((sum, { best }) => sum + (best?.price || 0), 0)

  const options = []

  // 2-store split — only if there are 2+ items AND it actually uses 2 different stores
  if (pricedResults.length >= 2) {
    let bestSplit = null
    let bestSplitTotal = Infinity
    for (let i = 0; i < stores.length; i++) {
      for (let j = i + 1; j < stores.length; j++) {
        const storeA = stores[i], storeB = stores[j]
        const assignment = pricedResults.map(({ item, prices }) => {
          const pA = priceOf(prices, storeA)
          const pB = priceOf(prices, storeB)
          if (pA === null && pB === null) return null
          if (pA === null) return { item, store: storeB, price: pB }
          if (pB === null) return { item, store: storeA, price: pA }
          return pA <= pB ? { item, store: storeA, price: pA } : { item, store: storeB, price: pB }
        })
        if (assignment.some(a => a === null)) continue
        const usedStores = new Set(assignment.map(a => a.store))
        if (usedStores.size < 2) continue  // collapsed to 1 store — not a real split
        const total = assignment.reduce((s, a) => s + a.price, 0)
        if (total < bestSplitTotal) {
          bestSplitTotal = total
          bestSplit = { stores: [storeA, storeB], assignment, total: parseFloat(total.toFixed(2)) }
        }
      }
    }
    if (bestSplit && bestSplit.total < cheapestOne.total - 0.01) {
      options.push({
        id: 'split',
        title: 'Best split — 2 stops',
        subtitle: `${bestSplit.stores[0]} + ${bestSplit.stores[1]}`,
        total: bestSplit.total,
        savings: parseFloat((cheapestOne.total - bestSplit.total).toFixed(2)),
        stops: bestSplit.assignment,
        recommended: true,
      })
    }
  }

  options.push({
    id: 'one',
    title: `One stop — ${cheapestOne.store}`,
    subtitle: 'Most convenient',
    total: cheapestOne.total,
    savings: 0,
    stops: pricedResults.map(({ item, prices }) => {
      const p = priceOf(prices, cheapestOne.store)
      return { item, store: cheapestOne.store, price: p }
    }),
    recommended: options.length === 0,  // recommended if no split option
  })

  // "Best per item" — only show if it actually spreads across 2+ stores and saves money
  if (bestStores.size >= 2 && parseFloat(bestPerItemTotal.toFixed(2)) < cheapestOne.total - 0.01) {
    options.push({
      id: 'best',
      title: 'Best per item — multiple stops',
      subtitle: 'Maximum savings',
      total: parseFloat(bestPerItemTotal.toFixed(2)),
      savings: parseFloat((cheapestOne.total - bestPerItemTotal).toFixed(2)),
      stops: bestPerItem.map(({ item, best }) => ({ item, store: best.store, price: best.price })),
      recommended: false,
    })
  }

  return options
}
