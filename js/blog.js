document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const listView = document.getElementById('list-view');
    const postView = document.getElementById('post-view');
    const postsGrid = document.getElementById('posts-grid');
    const postHeader = document.getElementById('post-header');
    const postBody = document.getElementById('post-body');
    const backButton = document.getElementById('back-button');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const categoryFilter = document.getElementById('category-filter');
    const noResults = document.getElementById('no-results');

    // --- State ---
    let currentSearchTerm = '';
    let currentSortOrder = 'date-desc';
    let currentCategory = 'all';

    // --- Functions ---

    /**
     * Populates the category filter dropdown with unique categories from the data.
     */
    const populateCategories = () => {
        const categories = ['All Categories', ...new Set(postsData.map(post => post.category))];
        categoryFilter.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category === 'All Categories' ? 'all' : category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    };

    /**
     * Renders a list of post cards to the grid.
     * @param {Array} posts - The array of post objects to render.
     */
    const renderPosts = (posts) => {
        postsGrid.innerHTML = ''; // Clear existing posts

        if (posts.length === 0) {
            noResults.style.display = 'block';
            postsGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            postsGrid.style.display = 'grid';
        }

        posts.forEach(post => {
            const postDate = new Date(post.date);
            const formattedDate = postDate.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const card = document.createElement('article');
            card.className = 'post-card';
            card.dataset.postId = post.id;

            card.innerHTML = `
                        <div class="post-content">
                            <p class="date">${formattedDate}</p>
                            <h2>${post.title}</h2>
                            <button class="category-label" id="${post.category}">${post.category}</button>
                            <p class="excerpt">${post.excerpt}</p>
                        </div>
                        <div class="card-footer">
                            <span class="read-more">Read More &rarr;</span>
                        </div>
                    `;

            card.addEventListener('click', () => showPostView(post.id));
            postsGrid.appendChild(card);
        });
    };

    /**
     * Filters and sorts the posts based on current state and then renders them.
     */
    const updateAndRenderPosts = () => {
        // 1. Filter by search term
        let filteredPosts = postsData.filter(post => {
            const searchTerm = currentSearchTerm.toLowerCase();
            const titleMatch = post.title.toLowerCase().includes(searchTerm);
            const contentMatch = post.content.toLowerCase().includes(searchTerm);
            return titleMatch || contentMatch;
        });

        // 2. Filter by category
        if (currentCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === currentCategory);
        }

        // 3. Sort the results
        const sortedPosts = filteredPosts.sort((a, b) => {
            switch (currentSortOrder) {
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'date-desc':
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

        renderPosts(sortedPosts);
    };

    /**
     * Displays the single post view and populates it with content.
     * @param {number} postId - The ID of the post to display.
     */
    const showPostView = (postId) => {
        const post = postsData.find(p => p.id === postId);
        if (!post) return;

        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        // Clear previous content to avoid duplicate event listeners if not recreated
        postHeader.innerHTML = '';

        // Create and append the meta-info paragraph
        const metaInfoP = document.createElement('p');
        metaInfoP.className = 'meta-info';
        metaInfoP.textContent = `Published on ${formattedDate}`;
        postHeader.appendChild(metaInfoP);

        // Create and append the post title
        const titleH1 = document.createElement('h1');
        titleH1.textContent = post.title;
        postHeader.appendChild(titleH1);

        // Create and append the category button
        const categoryButton = document.createElement('button');
        categoryButton.className = 'category-button'; // Use the new class for styling
        categoryButton.textContent = post.category;
        categoryButton.dataset.category = post.category; // Store category data
        postHeader.appendChild(categoryButton);

        // Add event listener to the category button
        categoryButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the article click event from firing if it were outside
            const categoryToFilter = event.target.dataset.category;
            currentCategory = categoryToFilter; // Set the current category state
            categoryFilter.value = categoryToFilter; // Update the dropdown to reflect the filter
            showListView(); // Go back to the list view with the filter applied
        });

        postBody.innerHTML = post.content;

        listView.style.display = 'none';
        postView.style.display = 'block';
        window.scrollTo(0, 0);
    };

    /**
     * Hides the single post view and shows the main list view.
     */
    const showListView = () => {
        listView.style.display = 'block';
        postView.style.display = 'none';
        updateAndRenderPosts();
        window.scrollTo(0, 0);
    };

    // --- Event Listeners ---
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        updateAndRenderPosts();
    });

    sortSelect.addEventListener('change', (e) => {
        currentSortOrder = e.target.value;
        updateAndRenderPosts();
    });

    categoryFilter.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        updateAndRenderPosts();
    });

    backButton.addEventListener('click', showListView);

    // --- Initial Setup ---
    populateCategories();
    updateAndRenderPosts();
});