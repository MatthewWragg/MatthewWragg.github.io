document.addEventListener('DOMContentLoaded', () => {

    const listView = document.getElementById('list-view');
    const postView = document.getElementById('post-view');
    const postsGrid = document.getElementById('posts-grid');
    const postHeader = document.getElementById('post-header');
    const postBody = document.getElementById('post-body');
    const backButtons = document.getElementsByClassName('back-button');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const categoryFilter = document.getElementById('category-filter');
    const noResults = document.getElementById('no-results');

    let currentSearchTerm = '';
    let currentSortOrder = 'date-desc';
    let currentCategory = 'all';

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

    const renderPosts = (posts) => {
        postsGrid.innerHTML = '';

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

    const updateAndRenderPosts = () => {
        let filteredPosts = postsData.filter(post => {
            const searchTerm = currentSearchTerm.toLowerCase();
            const titleMatch = post.title.toLowerCase().includes(searchTerm);
            const contentMatch = post.content.toLowerCase().includes(searchTerm);
            return titleMatch || contentMatch;
        });

        if (currentCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === currentCategory);
        }

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

    const showPostView = (postId) => {
        const post = postsData.find(p => p.id === postId);
        if (!post) return;

        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        postHeader.innerHTML = '';

        const metaInfoP = document.createElement('p');
        metaInfoP.className = 'meta-info';
        metaInfoP.textContent = `Published on ${formattedDate}`;
        postHeader.appendChild(metaInfoP);

        const titleH1 = document.createElement('h1');
        titleH1.textContent = post.title;
        postHeader.appendChild(titleH1);

        const categoryButton = document.createElement('button');
        categoryButton.className = 'category-button';
        categoryButton.textContent = post.category;
        categoryButton.dataset.category = post.category;
        postHeader.appendChild(categoryButton);

        categoryButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const categoryToFilter = event.target.dataset.category;
            currentCategory = categoryToFilter;
            categoryFilter.value = categoryToFilter;
            showListView();
        });

        postBody.innerHTML = post.content;

        listView.style.display = 'none';
        postView.style.display = 'block';
        window.scrollTo(0, 0);

        history.pushState({ view: 'post', postId: postId }, '', `#post-${postId}`);
    };


    const showListView = () => {
        listView.style.display = 'block';
        postView.style.display = 'none';
        updateAndRenderPosts();
        window.scrollTo(0, 0);

        if (history.state && history.state.view === 'post') {
             history.replaceState({ view: 'list' }, '', window.location.pathname);
        } else if (!history.state || history.state.view !== 'list') {
             history.pushState({ view: 'list' }, '', window.location.pathname);
        }
    };

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

    [...backButtons].forEach(button => {button.addEventListener('click', showListView)});

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.view === 'list') {
            showListView();
        } else if (event.state && event.state.view === 'post' && event.state.postId) {
            showPostView(event.state.postId);
        } else {
            showListView();
        }
    });

    if (window.location.hash.startsWith('#post-')) {
        const postId = parseInt(window.location.hash.substring(6));
        if (!isNaN(postId)) {
            updateAndRenderPosts();
            showPostView(postId);
        } else {
            populateCategories();
            updateAndRenderPosts();
        }
    } else {
        
        populateCategories();
        updateAndRenderPosts();
        
        if (history.state === null || history.state.view !== 'list') {
            history.replaceState({ view: 'list' }, '', window.location.pathname);
        }
    }
});