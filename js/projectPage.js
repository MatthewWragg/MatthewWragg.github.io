document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.gallery-image');
    const imageViewerOverlay = document.getElementById('imageViewerOverlay');
    const viewerImage = document.getElementById('viewerImage');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentGallerySrcs = [];
    let currentImageIndex = 0;

    function openImageViewer(imageSrc) {
        currentGallerySrcs = Array.from(galleryImages).map(img => img.src);
        currentImageIndex = currentGallerySrcs.indexOf(imageSrc);
        viewerImage.src = imageSrc;
        imageViewerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeImageViewer() {
        imageViewerOverlay.classList.remove('active');
        viewerImage.src = '';
        document.body.style.overflow = '';
    }

    function navigateImages(direction) {
        if (currentGallerySrcs.length === 0) return;

        currentImageIndex = (currentImageIndex + direction + currentGallerySrcs.length) % currentGallerySrcs.length;
        viewerImage.src = currentGallerySrcs[currentImageIndex];
    }

    galleryImages.forEach(image => {
        image.addEventListener('click', (event) => {
            event.preventDefault();
            openImageViewer(image.src);
        });
    });

    imageViewerOverlay.addEventListener('click', (event) => {
        if (event.target === imageViewerOverlay) {
            closeImageViewer();
        }
    });

    let touchStartX = 0;
    let touchEndX=0;

    imageViewerOverlay.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
    });

     imageViewerOverlay.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        if (touchEndX < touchStartX && touchStartX - touchEndX > 20) {
            navigateImages(1);
        }
        if (touchEndX > touchStartX && touchEndX - touchStartX > 20) {
            navigateImages(-1);
        }
    });


    closeBtn.addEventListener('click', closeImageViewer);

    prevBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        navigateImages(-1);
    });

    nextBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        navigateImages(1);
    });

    document.addEventListener('keydown', (event) => {
        if (imageViewerOverlay.classList.contains('active')) {
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