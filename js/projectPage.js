document.addEventListener('DOMContentLoaded', () => {
            const galleryImages = document.querySelectorAll('.gallery-image');
            const imageViewerOverlay = document.getElementById('imageViewerOverlay');
            const viewerImage = document.getElementById('viewerImage');

            // Add click event listener to each gallery image
            galleryImages.forEach(image => {
                image.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent default link behavior if inside an <a> tag
                    viewerImage.src = image.src; // Set the full-size image source
                    imageViewerOverlay.classList.add('active'); // Show the overlay
                });
            });

            // Add click event listener to the overlay to close the viewer
            imageViewerOverlay.addEventListener('click', () => {
                imageViewerOverlay.classList.remove('active'); // Hide the overlay
                viewerImage.src = ''; // Clear image source for performance/privacy
            });
        });