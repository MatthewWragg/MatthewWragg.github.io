document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.gallery-image');
    const imageViewerOverlay = document.getElementById('imageViewerOverlay');
    const viewerImage = document.getElementById('viewerImage');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn'); // New: Previous button
    const nextBtn = document.querySelector('.next-btn'); // New: Next button

    let currentGallerySrcs = []; // Array to store all image sources in the gallery
    let currentImageIndex = 0;   // Index of the currently displayed image

    // Add click event listener to each gallery image
    function openImageViewer(imageSrc) {
        // Collect all image sources from the current gallery grid
        currentGallerySrcs = Array.from(galleryImages).map(img => img.src);
        
        // Find the index of the clicked image
        currentImageIndex = currentGallerySrcs.indexOf(imageSrc);

        viewerImage.src = imageSrc; // Set the full-size image source
        imageViewerOverlay.classList.add('active'); // Show the overlay
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    // Function to close the image viewer
    function closeImageViewer() {
        imageViewerOverlay.classList.remove('active'); // Hide the overlay
        viewerImage.src = ''; // Clear image source for performance/privacy
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Function to navigate to the previous or next image
    function navigateImages(direction) {
        if (currentGallerySrcs.length === 0) return; // Do nothing if no images

        currentImageIndex = (currentImageIndex + direction + currentGallerySrcs.length) % currentGallerySrcs.length;
        viewerImage.src = currentGallerySrcs[currentImageIndex];
    }

    // Add click event listener to each gallery image to open viewer
    galleryImages.forEach(image => {
        image.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior if inside an <a> tag
            openImageViewer(image.src);
        });
    });

    // Add click event listener to the overlay to close the viewer (only when clicking outside the image)
    imageViewerOverlay.addEventListener('click', (event) => {
        // If the click is directly on the overlay itself, not on the image or buttons
        if (event.target === imageViewerOverlay) {
            closeImageViewer();
        }
    });

    // Add click event listener to the close button
    closeBtn.addEventListener('click', closeImageViewer);

    // Add click event listeners for navigation buttons
    prevBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling to overlay and closing it
        navigateImages(-1); // -1 for previous
    });

    nextBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling to overlay and closing it
        navigateImages(1); // 1 for next
    });

    // Add keyboard event listener for navigation and closing
    document.addEventListener('keydown', (event) => {
        if (imageViewerOverlay.classList.contains('active')) { // Only act if viewer is open
            if (event.key === 'ArrowLeft') {
                navigateImages(-1);
            } else if (event.key === 'ArrowRight') {
                navigateImages(1);
            } else if (event.key === 'Escape') {
                closeImageViewer();
            }
        }
    });

    
});