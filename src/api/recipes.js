const KEY = import.meta.env.VITE_SPOONACULAR_API_KEY

export async function searchRecipes(query = 'budget easy') {
  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=6&addRecipeInformation=true&fillIngredients=true&apiKey=${KEY}`
    )
    if (!res.ok) throw new Error('Spoonacular failed')
    const data = await res.json()
    // Spoonacular returns { code, message } on quota errors even with status 200
    if (!data.results?.length || data.code) return getFallbackRecipes()
    return data.results
  } catch {
    return getFallbackRecipes()
  }
}

export async function getRecipeDetails(id) {
  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${KEY}`
    )
    if (!res.ok) throw new Error()
    return await res.json()
  } catch {
    return null
  }
}

function getFallbackRecipes() {
  return [
    {
      id: 1, title: 'Lemon Chicken & Rice', readyInMinutes: 30, servings: 4,
      image: null, pricePerServing: 210,
      extendedIngredients: [
        { id: 1, name: 'chicken breast', amount: 1.5, unit: 'lbs', original: '1.5 lbs chicken breast' },
        { id: 2, name: 'white rice', amount: 1, unit: 'cup', original: '1 cup white rice' },
        { id: 3, name: 'olive oil', amount: 2, unit: 'tbsp', original: '2 tbsp olive oil' },
        { id: 4, name: 'lemon', amount: 1, unit: '', original: '1 lemon' },
        { id: 5, name: 'chicken broth', amount: 2, unit: 'cups', original: '2 cups chicken broth' },
      ],
      analyzedInstructions: [{ steps: [
        { number: 1, step: 'Season chicken with salt, pepper, and lemon zest.' },
        { number: 2, step: 'Heat olive oil in a pan over medium-high heat. Cook chicken 6 min per side.' },
        { number: 3, step: 'Remove chicken. Add rice and broth to pan. Simmer 18 min covered.' },
        { number: 4, step: 'Slice chicken, serve over rice with a squeeze of lemon.' },
      ]}]
    },
    {
      id: 2, title: 'Veggie Stir Fry', readyInMinutes: 20, servings: 3,
      image: null, pricePerServing: 180,
      extendedIngredients: [
        { id: 1, name: 'broccoli', amount: 2, unit: 'cups', original: '2 cups broccoli florets' },
        { id: 2, name: 'soy sauce', amount: 3, unit: 'tbsp', original: '3 tbsp soy sauce' },
        { id: 3, name: 'garlic', amount: 3, unit: 'cloves', original: '3 garlic cloves' },
        { id: 4, name: 'olive oil', amount: 2, unit: 'tbsp', original: '2 tbsp olive oil' },
        { id: 5, name: 'jasmine rice', amount: 1, unit: 'cup', original: '1 cup jasmine rice' },
      ],
      analyzedInstructions: [{ steps: [
        { number: 1, step: 'Cook rice according to package directions.' },
        { number: 2, step: 'Heat oil in a wok or large pan over high heat.' },
        { number: 3, step: 'Add garlic, stir 30 seconds. Add veggies, stir fry 5-7 min.' },
        { number: 4, step: 'Add soy sauce, toss to coat. Serve over rice.' },
      ]}]
    },
    {
      id: 3, title: 'Overnight Oats', readyInMinutes: 5, servings: 2,
      image: null, pricePerServing: 90,
      extendedIngredients: [
        { id: 1, name: 'rolled oats', amount: 1, unit: 'cup', original: '1 cup rolled oats' },
        { id: 2, name: 'almond milk', amount: 1, unit: 'cup', original: '1 cup almond milk' },
        { id: 3, name: 'greek yogurt', amount: 0.5, unit: 'cup', original: '1/2 cup greek yogurt' },
        { id: 4, name: 'banana', amount: 1, unit: '', original: '1 banana, sliced' },
        { id: 5, name: 'peanut butter', amount: 2, unit: 'tbsp', original: '2 tbsp peanut butter' },
      ],
      analyzedInstructions: [{ steps: [
        { number: 1, step: 'Combine oats, almond milk, and yogurt in a jar.' },
        { number: 2, step: 'Stir well, cover, and refrigerate overnight (at least 6 hours).' },
        { number: 3, step: 'In the morning, top with sliced banana and peanut butter.' },
        { number: 4, step: 'Add a drizzle of honey if desired. Enjoy cold.' },
      ]}]
    }
  ]
}
