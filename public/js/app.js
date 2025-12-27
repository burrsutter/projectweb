// Main application entry point

const App = {
    // DOM elements
    elements: {
        loading: document.getElementById('loading'),
        error: document.getElementById('error'),
        errorMessage: document.getElementById('error-message'),
        pokemonGrid: document.getElementById('pokemon-grid'),
        loadMoreContainer: document.getElementById('load-more-container'),
        loadMoreBtn: document.getElementById('load-more'),
        modal: document.getElementById('modal'),
        modalTitle: document.getElementById('modal-title'),
        modalImage: document.getElementById('modal-image'),
        modalTypes: document.getElementById('modal-types'),
        modalRating: document.getElementById('modal-rating'),
        modalClose: document.getElementById('modal-close'),
        commentForm: document.getElementById('comment-form'),
        commentsList: document.getElementById('comments-list'),
        noComments: document.getElementById('no-comments'),
        commentPokemonId: document.getElementById('comment-pokemon-id'),
        commentPokemonName: document.getElementById('comment-pokemon-name')
    },

    // Pokemon cache
    pokemonCache: {},

    // Show loading state
    showLoading() {
        this.elements.loading.classList.remove('hidden');
        this.elements.pokemonGrid.classList.add('hidden');
    },

    // Hide loading state
    hideLoading() {
        this.elements.loading.classList.add('hidden');
        this.elements.pokemonGrid.classList.remove('hidden');
    },

    // Show error message
    showError(message) {
        this.elements.error.classList.remove('hidden');
        this.elements.errorMessage.textContent = message;
    },

    // Hide error message
    hideError() {
        this.elements.error.classList.add('hidden');
    },

    // Open modal for a Pokemon
    async openModal(pokemonId, pokemonName) {
        const pokemon = this.pokemonCache[pokemonId];
        if (!pokemon) return;

        // Set modal content
        this.elements.modalTitle.textContent = pokemon.name;
        this.elements.modalImage.src = pokemon.sprites.front_default;
        this.elements.modalImage.alt = pokemon.name;

        // Set types
        const typeBadges = pokemon.types.map(t => {
            const color = PokemonAPI.getTypeColor(t.type.name);
            return `<span class="${color} text-white px-3 py-1 rounded-full capitalize">${t.type.name}</span>`;
        }).join('');
        this.elements.modalTypes.innerHTML = typeBadges;

        // Set up rating
        const rating = Ratings.ratingsCache[pokemonId]?.rating || 0;
        Ratings.renderInModal(this.elements.modalRating, pokemonId, rating);
        Ratings.initModalListeners(this.elements.modalRating, pokemonName);

        // Set comment form hidden fields
        this.elements.commentPokemonId.value = pokemonId;
        this.elements.commentPokemonName.value = pokemonName;

        // Load comments
        await Comments.renderComments(
            this.elements.commentsList,
            this.elements.noComments,
            pokemonId
        );

        // Show modal
        this.elements.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    // Close modal
    closeModal() {
        this.elements.modal.classList.add('hidden');
        document.body.style.overflow = '';

        // Clear form
        document.getElementById('comment-author').value = '';
        document.getElementById('comment-text').value = '';
    },

    // Load Pokemon
    async loadPokemon() {
        try {
            const pokemon = await PokemonAPI.fetchPokemonWithDetails();

            // Cache Pokemon data
            pokemon.forEach(p => {
                this.pokemonCache[p.id] = p;
            });

            // Render cards
            const cards = pokemon.map(p => {
                const rating = Ratings.ratingsCache[p.id]?.rating || null;
                return PokemonAPI.createCard(p, rating);
            }).join('');

            this.elements.pokemonGrid.insertAdjacentHTML('beforeend', cards);

            // Show/hide load more button
            if (PokemonAPI.hasMore()) {
                this.elements.loadMoreContainer.classList.remove('hidden');
            } else {
                this.elements.loadMoreContainer.classList.add('hidden');
            }
        } catch (error) {
            this.showError('Failed to load Pokemon. Please refresh the page.');
            console.error('Error loading Pokemon:', error);
        }
    },

    // Initialize application
    async init() {
        try {
            // Fetch all ratings first
            await Ratings.fetchAll();

            // Load initial Pokemon
            await this.loadPokemon();

            this.hideLoading();

            // Set up event listeners
            this.setupEventListeners();

        } catch (error) {
            this.hideLoading();
            this.showError('Failed to initialize app. Please refresh the page.');
            console.error('Error initializing app:', error);
        }
    },

    // Set up event listeners
    setupEventListeners() {
        // Pokemon card clicks
        this.elements.pokemonGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.pokemon-card');
            if (card) {
                const pokemonId = parseInt(card.dataset.pokemonId);
                const pokemonName = card.dataset.pokemonName;
                this.openModal(pokemonId, pokemonName);
            }
        });

        // Modal close button
        this.elements.modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on backdrop click
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.elements.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });

        // Load more button
        this.elements.loadMoreBtn.addEventListener('click', async () => {
            this.elements.loadMoreBtn.disabled = true;
            this.elements.loadMoreBtn.textContent = 'Loading...';

            await this.loadPokemon();

            this.elements.loadMoreBtn.disabled = false;
            this.elements.loadMoreBtn.textContent = 'Load More Pokemon';
        });

        // Comment form
        Comments.initForm(
            this.elements.commentForm,
            this.elements.commentsList,
            this.elements.noComments
        );

        // Comment delete handlers
        Comments.initDeleteHandlers(
            this.elements.commentsList,
            this.elements.noComments
        );
    }
};

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
