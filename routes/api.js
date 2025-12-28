const express = require('express');
const router = express.Router();
const db = require('../database/init');

// ============ RATINGS ROUTES ============

// GET all ratings
router.get('/ratings', async (req, res) => {
    try {
        const ratings = await db.ratings.getAll();
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
});

// GET rating for specific Pokemon
router.get('/ratings/:pokemonId', async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.pokemonId);
        const rating = await db.ratings.getByPokemonId(pokemonId);

        if (!rating) {
            return res.status(404).json({ error: 'Rating not found' });
        }

        res.json(rating);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rating' });
    }
});

// POST create/update rating
router.post('/ratings', async (req, res) => {
    try {
        const { pokemon_id, pokemon_name, rating } = req.body;

        // Validation
        if (!pokemon_id || !pokemon_name || !rating) {
            return res.status(400).json({ error: 'Missing required fields: pokemon_id, pokemon_name, rating' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const updated = await db.ratings.upsert(pokemon_id, pokemon_name, rating);

        res.status(201).json({
            success: true,
            rating: updated
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save rating' });
    }
});

// ============ COMMENTS ROUTES ============

// GET comments for specific Pokemon
router.get('/comments/:pokemonId', async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.pokemonId);
        const comments = await db.comments.getByPokemonId(pokemonId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// POST create comment
router.post('/comments', async (req, res) => {
    try {
        const { pokemon_id, pokemon_name, author, comment_text } = req.body;

        // Validation
        if (!pokemon_id || !pokemon_name || !comment_text) {
            return res.status(400).json({ error: 'Missing required fields: pokemon_id, pokemon_name, comment_text' });
        }

        if (comment_text.trim().length === 0) {
            return res.status(400).json({ error: 'Comment text cannot be empty' });
        }

        const comment = await db.comments.insert(
            pokemon_id,
            pokemon_name,
            author,
            comment_text.trim()
        );

        res.status(201).json({
            success: true,
            comment
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save comment' });
    }
});

// DELETE comment
router.delete('/comments/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await db.comments.getById(id);

        if (!existing) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        await db.comments.delete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

module.exports = router;
