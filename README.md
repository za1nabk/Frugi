# Frugi 🛒

### Grocery shopping with your budget in mind.

Frugi is a grocery price comparison application that brings grocery prices, nearby stores, routes, and meal options into one place. It helps shoppers compare their options and plan grocery trips around cost and convenience.

Built for the **UWB Saves the World Hackathon in April 2026**, Frugi went from idea to working prototype in **24 hours**.

## Why Frugi?

Planning affordable meals involves more than finding a recipe. Shoppers also need to figure out where to buy ingredients, how prices compare, and whether the trip makes sense. Frugi brings these decisions into a single interface to make budget-conscious grocery planning easier.

## Features

- **Grocery price comparison:** Compare available grocery prices using Kroger product data.
- **Store discovery and mapping:** Find nearby grocery stores and view their locations.
- **Trip planning:** Explore routes to support more efficient grocery trips.
- **Meal planning:** Explore recipes and meal options through Spoonacular.
- **Unified interface:** View store, price, route, and meal information together.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| React | Component-based user interface |
| Vite | Frontend development tooling and build system |
| Kroger API | Grocery product and pricing data |
| Google Maps API | Store mapping and routing |
| Spoonacular API | Recipe and meal information |

## API Integration

Frugi integrates three external services with different response formats and levels of data completeness. API responses are validated and normalized into a consistent format so the interface can present grocery prices, stores, routes, and meal options together.

Pricing and feature availability depend on the data returned by the connected services.

## Development

Frugi was built through rapid, AI-assisted development using Claude Code, iterative prompting, code review, and debugging. The hackathon focused on delivering a working prototype within a 24-hour window.

## Project Background

- **Event:** UWB Saves the World Hackathon
- **Date:** April 2026
- **Build window:** 24 hours
- **Scope:** Hackathon prototype
