// Comments module

const Comments = {
    // Fetch comments for a Pokemon
    async fetchByPokemonId(pokemonId) {
        try {
            const response = await fetch(`/api/comments/${pokemonId}`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            return response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    },

    // Submit a new comment
    async submitComment(pokemonId, pokemonName, author, commentText) {
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pokemon_id: pokemonId,
                    pokemon_name: pokemonName,
                    author: author || 'Anonymous',
                    comment_text: commentText
                })
            });

            if (!response.ok) throw new Error('Failed to submit comment');
            return response.json();
        } catch (error) {
            console.error('Error submitting comment:', error);
            throw error;
        }
    },

    // Delete a comment
    async deleteComment(commentId) {
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete comment');
            return response.json();
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    },

    // Format timestamp for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Create comment HTML
    createCommentHTML(comment) {
        return `
            <div class="comment bg-gray-50 rounded-lg p-4" data-comment-id="${comment.id}">
                <div class="flex justify-between items-start mb-2">
                    <span class="font-semibold text-gray-700">${this.escapeHtml(comment.author)}</span>
                    <button class="delete-comment text-gray-400 hover:text-red-500 text-sm" data-comment-id="${comment.id}">
                        Delete
                    </button>
                </div>
                <p class="text-gray-600 mb-2">${this.escapeHtml(comment.comment_text)}</p>
                <span class="text-xs text-gray-400">${this.formatDate(comment.created_at)}</span>
            </div>
        `;
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Render comments list
    async renderComments(container, noCommentsElement, pokemonId) {
        const comments = await this.fetchByPokemonId(pokemonId);

        if (comments.length === 0) {
            container.innerHTML = '';
            noCommentsElement.classList.remove('hidden');
        } else {
            noCommentsElement.classList.add('hidden');
            container.innerHTML = comments.map(c => this.createCommentHTML(c)).join('');
        }

        return comments;
    },

    // Initialize comment form
    initForm(form, listContainer, noCommentsElement, onCommentAdded) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const pokemonId = parseInt(document.getElementById('comment-pokemon-id').value);
            const pokemonName = document.getElementById('comment-pokemon-name').value;
            const author = document.getElementById('comment-author').value.trim();
            const commentText = document.getElementById('comment-text').value.trim();

            if (!commentText) {
                alert('Please enter a comment');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Posting...';

            try {
                const result = await this.submitComment(pokemonId, pokemonName, author, commentText);

                // Add new comment to list
                noCommentsElement.classList.add('hidden');
                listContainer.insertAdjacentHTML('afterbegin', this.createCommentHTML(result.comment));

                // Clear form
                document.getElementById('comment-author').value = '';
                document.getElementById('comment-text').value = '';

                if (onCommentAdded) onCommentAdded(result.comment);
            } catch (error) {
                alert('Failed to post comment. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Comment';
            }
        });
    },

    // Initialize delete handlers
    initDeleteHandlers(container, noCommentsElement) {
        container.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-comment')) {
                const commentId = parseInt(e.target.dataset.commentId);

                if (!confirm('Are you sure you want to delete this comment?')) {
                    return;
                }

                try {
                    await this.deleteComment(commentId);
                    const commentElement = container.querySelector(`[data-comment-id="${commentId}"]`);
                    if (commentElement) {
                        commentElement.remove();
                    }

                    // Check if no comments left
                    if (container.children.length === 0) {
                        noCommentsElement.classList.remove('hidden');
                    }
                } catch (error) {
                    alert('Failed to delete comment. Please try again.');
                }
            }
        });
    }
};
