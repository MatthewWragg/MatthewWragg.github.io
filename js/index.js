
document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = mainNav.querySelectorAll('a');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.main-nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 100) { // 100px offset
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
    });

    // --- Fade-in sections on scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: stop observing once visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Scroll to Top Button ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});