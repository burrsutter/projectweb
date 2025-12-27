// Pokemon API integration module

const PokemonAPI = {
    baseUrl: 'https://pokeapi.co/api/v2',
    limit: 20,
    offset: 0,
    totalCount: 0,

    // Fetch list of Pokemon with pagination
    async fetchList(limit = this.limit, offset = this.offset) {
        const response = await fetch(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error('Failed to fetch Pokemon list');
        const data = await response.json();
        this.totalCount = data.count;
        return data;
    },

    // Fetch details for a single Pokemon
    async fetchDetails(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch Pokemon details');
        return response.json();
    },

    // Fetch Pokemon list with full details
    async fetchPokemonWithDetails(limit = this.limit, offset = this.offset) {
        const listData = await this.fetchList(limit, offset);

        const pokemonDetails = await Promise.all(
            listData.results.map(pokemon => this.fetchDetails(pokemon.url))
        );

        return pokemonDetails;
    },

    // Get type color for styling
    getTypeColor(type) {
        const colors = {
            normal: 'bg-gray-400',
            fire: 'bg-orange-500',
            water: 'bg-blue-500',
            electric: 'bg-yellow-400',
            grass: 'bg-green-500',
            ice: 'bg-cyan-300',
            fighting: 'bg-red-700',
            poison: 'bg-purple-500',
            ground: 'bg-amber-600',
            flying: 'bg-indigo-300',
            psychic: 'bg-pink-500',
            bug: 'bg-lime-500',
            rock: 'bg-stone-500',
            ghost: 'bg-purple-700',
            dragon: 'bg-violet-600',
            dark: 'bg-gray-700',
            steel: 'bg-slate-400',
            fairy: 'bg-pink-300'
        };
        return colors[type] || 'bg-gray-400';
    },

    // Create Pokemon card HTML
    createCard(pokemon, rating = null) {
        const types = pokemon.types.map(t => t.type.name);
        const typeBadges = types.map(type =>
            `<span class="${this.getTypeColor(type)} text-white text-xs px-2 py-1 rounded capitalize">${type}</span>`
        ).join('');

        const ratingStars = rating
            ? this.createStarsDisplay(rating)
            : '<span class="text-gray-400 text-sm">Not rated</span>';

        return `
            <div class="pokemon-card bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
                 data-pokemon-id="${pokemon.id}"
                 data-pokemon-name="${pokemon.name}">
                <div class="bg-gray-100 p-4">
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"
                         class="w-32 h-32 mx-auto" loading="lazy">
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold capitalize text-center mb-2">${pokemon.name}</h3>
                    <div class="flex justify-center gap-1 mb-3">
                        ${typeBadges}
                    </div>
                    <div class="text-center" data-rating-display="${pokemon.id}">
                        ${ratingStars}
                    </div>
                </div>
            </div>
        `;
    },

    // Create star display (read-only)
    createStarsDisplay(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= rating;
            stars += `<span class="text-xl ${filled ? 'text-yellow-400' : 'text-gray-300'}">★</span>`;
        }
        return stars;
    },

    // Render Pokemon grid
    async renderGrid(container, ratings = {}) {
        const pokemon = await this.fetchPokemonWithDetails();
        this.offset += this.limit;

        const cards = pokemon.map(p => {
            const rating = ratings[p.id]?.rating || null;
            return this.createCard(p, rating);
        }).join('');

        container.insertAdjacentHTML('beforeend', cards);

        return pokemon;
    },

    // Check if more Pokemon are available
    hasMore() {
        return this.offset < this.totalCount;
    }
};
