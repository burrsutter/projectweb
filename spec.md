# Pokemon Favorites Website - Specification

## Overview
A web application that displays a catalog of Pokemon characters, allowing users to rate and comment on their favorites. Data is sourced from PokeAPI, with user ratings and comments persisted in a SQLite database.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Plain HTML, CSS, JavaScript |
| Backend | Node.js with Express |
| Database | SQLite (better-sqlite3) |
| Styling | Tailwind CSS (CDN) |
| Pokemon Data | PokeAPI (https://pokeapi.co/) |

## Features

### 1. Pokemon Catalog Display
- Fetch and display Pokemon from PokeAPI
- Show Pokemon cards in a responsive grid layout
- Each card displays:
  - Pokemon image (sprite)
  - Pokemon name
  - Pokemon types
  - Current star rating (if rated)

### 2. Star Rating System
- 5-star rating scale (1-5)
- Interactive hover effect on stars
- Click to submit rating
- One rating per Pokemon (updates if re-rated)
- Ratings persist in database

### 3. Comments System
- Add comments to any Pokemon
- Optional author name (defaults to "Anonymous")
- Required comment text
- Multiple comments per Pokemon allowed
- Comments displayed with timestamps
- Delete functionality for comments

## Database Schema

### ratings
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| pokemon_id | INTEGER | NOT NULL, UNIQUE |
| pokemon_name | TEXT | NOT NULL |
| rating | INTEGER | NOT NULL, CHECK (1-5) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### comments
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| pokemon_id | INTEGER | NOT NULL |
| pokemon_name | TEXT | NOT NULL |
| author | TEXT | DEFAULT 'Anonymous' |
| comment_text | TEXT | NOT NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

## API Endpoints

### Ratings

#### GET /api/ratings
Returns all Pokemon ratings.

**Response:**
```json
[
  {
    "id": 1,
    "pokemon_id": 25,
    "pokemon_name": "pikachu",
    "rating": 5,
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

#### GET /api/ratings/:pokemonId
Returns rating for a specific Pokemon.

**Response (200):**
```json
{
  "pokemon_id": 25,
  "pokemon_name": "pikachu",
  "rating": 5
}
```

**Response (404):**
```json
{
  "error": "Rating not found"
}
```

#### POST /api/ratings
Create or update a rating.

**Request Body:**
```json
{
  "pokemon_id": 25,
  "pokemon_name": "pikachu",
  "rating": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "rating": {
    "pokemon_id": 25,
    "pokemon_name": "pikachu",
    "rating": 5
  }
}
```

### Comments

#### GET /api/comments/:pokemonId
Returns all comments for a specific Pokemon.

**Response:**
```json
[
  {
    "id": 1,
    "pokemon_id": 25,
    "pokemon_name": "pikachu",
    "author": "Ash",
    "comment_text": "My best friend!",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

#### POST /api/comments
Add a new comment.

**Request Body:**
```json
{
  "pokemon_id": 25,
  "pokemon_name": "pikachu",
  "author": "Ash",
  "comment_text": "My best friend!"
}
```

**Response (201):**
```json
{
  "success": true,
  "comment": {
    "id": 1,
    "pokemon_id": 25,
    "pokemon_name": "pikachu",
    "author": "Ash",
    "comment_text": "My best friend!",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
}
```

#### DELETE /api/comments/:id
Delete a comment by ID.

**Response (200):**
```json
{
  "success": true
}
```

**Response (404):**
```json
{
  "error": "Comment not found"
}
```

## Project Structure

```
projectweb/
├── package.json              # Dependencies and scripts
├── spec.md                   # This specification file
├── server.js                 # Express server entry point
├── database/
│   ├── init.js              # Database initialization and helpers
│   └── pokemon.db           # SQLite database file (generated)
├── routes/
│   └── api.js               # All API route handlers
└── public/                   # Static files
    ├── index.html           # Main HTML page
    ├── css/
    │   └── styles.css       # Custom CSS styles
    └── js/
        ├── app.js           # Main application entry point
        ├── pokemon.js       # PokeAPI fetching and card rendering
        ├── ratings.js       # Star rating component
        └── comments.js      # Comments form and display
```

## External API: PokeAPI

### Endpoints Used

**List Pokemon:**
```
GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0
```

**Pokemon Details:**
```
GET https://pokeapi.co/api/v2/pokemon/{id or name}
```

### Data Used from PokeAPI
- `id` - Unique Pokemon identifier
- `name` - Pokemon name
- `sprites.front_default` - Pokemon image URL
- `types` - Array of Pokemon types

## User Interface

### Main Page Layout
1. **Header** - Site title "Pokemon Favorites"
2. **Pokemon Grid** - Responsive card grid (3-4 columns on desktop, 1-2 on mobile)
3. **Detail Modal/Panel** - Opens when clicking a Pokemon card
   - Larger Pokemon image
   - Pokemon name and types
   - Star rating component
   - Comments section with form

### Pokemon Card
- Pokemon sprite image
- Name (capitalized)
- Type badges
- Current rating stars (filled/empty)

### Star Rating Component
- 5 clickable star icons
- Hover effect shows potential rating
- Filled stars show current rating
- Click submits rating to API

### Comments Section
- Comment form:
  - Author name input (optional)
  - Comment text textarea (required)
  - Submit button
- Comments list:
  - Author name
  - Comment text
  - Timestamp
  - Delete button

## Dependencies

### Production
- `express` - Web server framework
- `better-sqlite3` - SQLite database driver

### Development
- `nodemon` - Auto-restart server on file changes

## Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

## Configuration

- **Port:** 3000 (configurable via PORT environment variable)
- **Pokemon Limit:** 20 per page (can be adjusted)
