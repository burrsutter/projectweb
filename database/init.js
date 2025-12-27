const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'pokemon.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pokemon_id INTEGER NOT NULL UNIQUE,
        pokemon_name TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pokemon_id INTEGER NOT NULL,
        pokemon_name TEXT NOT NULL,
        author TEXT DEFAULT 'Anonymous',
        comment_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_comments_pokemon ON comments(pokemon_id);
`);

// Prepared statements for ratings
const getAllRatings = db.prepare('SELECT * FROM ratings ORDER BY updated_at DESC');
const getRatingByPokemonId = db.prepare('SELECT * FROM ratings WHERE pokemon_id = ?');
const upsertRating = db.prepare(`
    INSERT INTO ratings (pokemon_id, pokemon_name, rating)
    VALUES (?, ?, ?)
    ON CONFLICT(pokemon_id) DO UPDATE SET
        rating = excluded.rating,
        updated_at = CURRENT_TIMESTAMP
`);

// Prepared statements for comments
const getCommentsByPokemonId = db.prepare('SELECT * FROM comments WHERE pokemon_id = ? ORDER BY created_at DESC');
const insertComment = db.prepare(`
    INSERT INTO comments (pokemon_id, pokemon_name, author, comment_text)
    VALUES (?, ?, ?, ?)
`);
const deleteComment = db.prepare('DELETE FROM comments WHERE id = ?');
const getCommentById = db.prepare('SELECT * FROM comments WHERE id = ?');

module.exports = {
    db,
    ratings: {
        getAll: () => getAllRatings.all(),
        getByPokemonId: (pokemonId) => getRatingByPokemonId.get(pokemonId),
        upsert: (pokemonId, pokemonName, rating) => upsertRating.run(pokemonId, pokemonName, rating)
    },
    comments: {
        getByPokemonId: (pokemonId) => getCommentsByPokemonId.all(pokemonId),
        insert: (pokemonId, pokemonName, author, commentText) => {
            const result = insertComment.run(pokemonId, pokemonName, author || 'Anonymous', commentText);
            return getCommentById.get(result.lastInsertRowid);
        },
        delete: (id) => deleteComment.run(id),
        getById: (id) => getCommentById.get(id)
    }
};
