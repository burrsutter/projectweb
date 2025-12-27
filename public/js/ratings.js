// Star rating component module

const Ratings = {
    // Cache for ratings data
    ratingsCache: {},

    // Fetch all ratings from API
    async fetchAll() {
        try {
            const response = await fetch('/api/ratings');
            if (!response.ok) throw new Error('Failed to fetch ratings');
            const ratings = await response.json();

            // Convert to object keyed by pokemon_id
            this.ratingsCache = {};
            ratings.forEach(r => {
                this.ratingsCache[r.pokemon_id] = r;
            });

            return this.ratingsCache;
        } catch (error) {
            console.error('Error fetching ratings:', error);
            return {};
        }
    },

    // Fetch rating for specific Pokemon
    async fetchByPokemonId(pokemonId) {
        try {
            const response = await fetch(`/api/ratings/${pokemonId}`);
            if (response.status === 404) return null;
            if (!response.ok) throw new Error('Failed to fetch rating');
            return response.json();
        } catch (error) {
            console.error('Error fetching rating:', error);
            return null;
        }
    },

    // Submit rating
    async submitRating(pokemonId, pokemonName, rating) {
        try {
            const response = await fetch('/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pokemon_id: pokemonId,
                    pokemon_name: pokemonName,
                    rating: rating
                })
            });

            if (!response.ok) throw new Error('Failed to submit rating');
            const result = await response.json();

            // Update cache
            this.ratingsCache[pokemonId] = {
                pokemon_id: pokemonId,
                pokemon_name: pokemonName,
                rating: rating
            };

            return result;
        } catch (error) {
            console.error('Error submitting rating:', error);
            throw error;
        }
    },

    // Create interactive star rating HTML
    createStarRating(pokemonId, currentRating = 0) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= currentRating;
            stars += `
                <button type="button" class="star text-3xl transition-colors ${filled ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400"
                        data-value="${i}">★</button>
            `;
        }
        return stars;
    },

    // Render star rating in container
    renderInModal(container, pokemonId, currentRating = 0) {
        container.innerHTML = this.createStarRating(pokemonId, currentRating);
        container.dataset.pokemonId = pokemonId;
        container.dataset.currentRating = currentRating;
    },

    // Update stars display based on hover/click
    updateStarsDisplay(container, rating, isTemporary = false) {
        const stars = container.querySelectorAll('.star');
        const currentRating = parseInt(container.dataset.currentRating) || 0;

        stars.forEach((star, index) => {
            const starValue = index + 1;
            if (isTemporary) {
                // Hover state
                star.classList.toggle('text-yellow-400', starValue <= rating);
                star.classList.toggle('text-gray-300', starValue > rating);
            } else {
                // Permanent state
                const filled = starValue <= (rating || currentRating);
                star.classList.toggle('text-yellow-400', filled);
                star.classList.toggle('text-gray-300', !filled);
            }
        });
    },

    // Update card rating display
    updateCardDisplay(pokemonId, rating) {
        const cardDisplay = document.querySelector(`[data-rating-display="${pokemonId}"]`);
        if (cardDisplay) {
            cardDisplay.innerHTML = PokemonAPI.createStarsDisplay(rating);
        }
    },

    // Initialize event listeners for modal rating
    initModalListeners(container, pokemonName, onRatingChange) {
        const pokemonId = parseInt(container.dataset.pokemonId);

        container.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('star')) {
                const value = parseInt(e.target.dataset.value);
                this.updateStarsDisplay(container, value, true);
            }
        });

        container.addEventListener('mouseout', () => {
            const currentRating = parseInt(container.dataset.currentRating) || 0;
            this.updateStarsDisplay(container, currentRating, false);
        });

        container.addEventListener('click', async (e) => {
            if (e.target.classList.contains('star')) {
                const value = parseInt(e.target.dataset.value);
                const pokemonId = parseInt(container.dataset.pokemonId);

                try {
                    await this.submitRating(pokemonId, pokemonName, value);
                    container.dataset.currentRating = value;
                    this.updateStarsDisplay(container, value, false);
                    this.updateCardDisplay(pokemonId, value);

                    if (onRatingChange) onRatingChange(pokemonId, value);
                } catch (error) {
                    alert('Failed to save rating. Please try again.');
                }
            }
        });
    }
};
