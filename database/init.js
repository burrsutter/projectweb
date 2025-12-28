const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

const init = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS ratings (
            id SERIAL PRIMARY KEY,
            pokemon_id INTEGER NOT NULL UNIQUE,
            pokemon_name TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            pokemon_id INTEGER NOT NULL,
            pokemon_name TEXT NOT NULL,
            author TEXT DEFAULT 'Anonymous',
            comment_text TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_comments_pokemon ON comments(pokemon_id);
    `);
};

const getAllRatings = async () => {
    const result = await pool.query('SELECT * FROM ratings ORDER BY updated_at DESC');
    return result.rows;
};

const getRatingByPokemonId = async (pokemonId) => {
    const result = await pool.query(
        'SELECT * FROM ratings WHERE pokemon_id = $1',
        [pokemonId]
    );
    return result.rows[0] || null;
};

const upsertRating = async (pokemonId, pokemonName, rating) => {
    const result = await pool.query(
        `
            INSERT INTO ratings (pokemon_id, pokemon_name, rating)
            VALUES ($1, $2, $3)
            ON CONFLICT (pokemon_id) DO UPDATE SET
                rating = EXCLUDED.rating,
                updated_at = NOW()
            RETURNING *;
        `,
        [pokemonId, pokemonName, rating]
    );
    return result.rows[0];
};

const getCommentsByPokemonId = async (pokemonId) => {
    const result = await pool.query(
        'SELECT * FROM comments WHERE pokemon_id = $1 ORDER BY created_at DESC',
        [pokemonId]
    );
    return result.rows;
};

const insertComment = async (pokemonId, pokemonName, author, commentText) => {
    const result = await pool.query(
        `
            INSERT INTO comments (pokemon_id, pokemon_name, author, comment_text)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,
        [pokemonId, pokemonName, author || 'Anonymous', commentText]
    );
    return result.rows[0];
};

const deleteComment = async (id) => {
    const result = await pool.query(
        'DELETE FROM comments WHERE id = $1 RETURNING *',
        [id]
    );
    return result.rows[0] || null;
};

const getCommentById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM comments WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};

module.exports = {
    init,
    pool,
    ratings: {
        getAll: getAllRatings,
        getByPokemonId: getRatingByPokemonId,
        upsert: upsertRating
    },
    comments: {
        getByPokemonId: getCommentsByPokemonId,
        insert: insertComment,
        delete: deleteComment,
        getById: getCommentById
    }
};
