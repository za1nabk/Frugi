import { useState, useEffect } from 'react'
import { useApp } from '../AppContext'
import { searchRecipes } from '../api/recipes'

const RECIPE_COLORS = ['#E1F5EE', '#FAEEDA', '#E6F1FB', '#FBEAF0', '#EAF3DE', '#EEEDFE']

export default function MealsScreen() {
  const { addToCart } = useApp()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [addedIngredients, setAddedIngredients] = useState({})

  useEffect(() => {
    searchRecipes('easy budget dinner').then(r => {
      setRecipes(r)
      setLoading(false)
    })
  }, [])

  const handleAddIngredient = (recipeId, ing) => {
    addToCart({
      name: ing.name,
      price: 2.99, // placeholder price — will be looked up
      store: 'TBD',
      amount: `${ing.amount} ${ing.unit}`.trim()
    })
    setAddedIngredients(prev => ({ ...prev, [`${recipeId}-${ing.id}`]: true }))
  }

  if (selected) {
    const steps = selected.analyzedInstructions?.[0]?.steps || []
    const ingredients = selected.extendedIngredients || []

    return (
      <div className="screen">
        <div className="screen-header">
          <button
            onClick={() => setSelected(null)}
            style={{ background: 'none', border: 'none', color: 'var(--green-dark)', cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8, padding: 0, fontFamily: "'DM Sans', sans-serif" }}
          >
            ← back to recipes
          </button>
          <div className="screen-title">{selected.title}</div>
          <div className="screen-sub">
            {selected.readyInMinutes} min · {selected.servings} servings
            {selected.pricePerServing && ` · ~$${(selected.pricePerServing / 100).toFixed(2)}/serving`}
          </div>
        </div>

        <div style={{ padding: '14px 18px', overflowY: 'auto', flex: 1 }}>
          {/* Instructions */}
          {steps.length > 0 && (
            <>
              <div className="section-label">instructions</div>
              <div style={{ marginBottom: 20 }}>
                {steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="step-num">{step.number || i + 1}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{step.step}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Ingredients */}
          <div className="section-label">ingredients — tap + to add to cart</div>
          {ingredients.map(ing => {
            const key = `${selected.id}-${ing.id}`
            const added = addedIngredients[key]
            return (
              <div key={ing.id} className="row-item">
                <div className="row-item-left">
                  <span className="row-item-name" style={{ textTransform: 'capitalize' }}>{ing.name}</span>
                  <span className="row-item-sub">{ing.original || `${ing.amount} ${ing.unit}`.trim()}</span>
                </div>
                <button
                  className={`plus-btn ${added ? 'added' : ''}`}
                  onClick={() => !added && handleAddIngredient(selected.id, ing)}
                  title={added ? 'Added to cart' : 'Add to cart'}
                >
                  {added ? '✓' : '+'}
                </button>
              </div>
            )
          })}

          {/* Add all button */}
          <div style={{ marginTop: 16 }}>
            <button
              className="btn-outline"
              onClick={() => ingredients.forEach(ing => handleAddIngredient(selected.id, ing))}
            >
              + Add all ingredients to cart
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <div className="screen-title">Recipes</div>
        <div className="screen-sub">Tap a recipe to see ingredients</div>
      </div>

      <div style={{ padding: '14px 18px', flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <div className="spinner"/>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 12 }}>Loading recipes...</div>
          </div>
        ) : (
          <>
            <div className="section-label">budget picks</div>
            {recipes.map((recipe, i) => (
              <div
                key={recipe.id}
                onClick={() => setSelected(recipe)}
                style={{
                  border: '1px solid var(--border)', borderRadius: 14,
                  overflow: 'hidden', marginBottom: 12, cursor: 'pointer',
                  transition: 'transform 0.1s',
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.99)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {/* Recipe image or color block */}
                <div style={{
                  height: 80, background: recipe.image ? `url(${recipe.image}) center/cover` : RECIPE_COLORS[i % RECIPE_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {!recipe.image && (
                    <span style={{ fontSize: 32 }}>
                      {['🍋', '🥦', '🥣', '🍝', '🥗', '🍜'][i % 6]}
                    </span>
                  )}
                </div>

                <div style={{ padding: '10px 14px 12px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
                    {recipe.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', gap: 10 }}>
                    <span>⏱ {recipe.readyInMinutes} min</span>
                    <span>👥 {recipe.servings} servings</span>
                    {recipe.pricePerServing && <span>💚 ~${(recipe.pricePerServing / 100).toFixed(2)}/serving</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--green-dark)', marginTop: 6, fontWeight: 500 }}>
                    Tap to view recipe & add ingredients →
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
