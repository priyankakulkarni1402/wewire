/**
 * Reusable Components Loader
 * Loads header and footer HTML into all pages
 */

(function() {
    'use strict';

    /**
     * Load external HTML component
     */
    function loadComponent(url, targetId, callback) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                const target = document.getElementById(targetId);
                if (target) {
                    target.innerHTML = html;
                    if (callback) callback();
                }
            })
            .catch(error => {
                console.error('Error loading component:', error);
            });
    }

    /**
     * Set active navigation link based on current page
     */
    function setActiveNavLink() {
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageName = currentPage.replace('.html', '');

        // Set active class on desktop navigation
        const desktopLinks = document.querySelectorAll('.c-main-nav__link--l1');
        desktopLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === pageName || (pageName === 'index' && linkPage === 'index')) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });

        // Set active class on mobile navigation
        const mobileLinks = document.querySelectorAll('.c-accordion-nav__link');
        mobileLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === pageName || (pageName === 'index' && linkPage === 'index')) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    }

    /**
     * Initialize header functionality after it loads
     */
    function initializeHeader() {
        // Mobile navigation toggle
        const mobileToggle = document.querySelector('.js-mobile-nav-toggle');
        const mobileNav = document.querySelector('.js-mobile-nav');

        if (mobileToggle && mobileNav) {
            mobileToggle.addEventListener('click', function() {
                mobileNav.classList.toggle('is-open');
                mobileToggle.classList.toggle('is-active');
                document.body.classList.toggle('nav-is-open');
            });

            // Close mobile menu when clicking a link
            const mobileLinks = mobileNav.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileNav.classList.remove('is-open');
                    mobileToggle.classList.remove('is-active');
                    document.body.classList.remove('nav-is-open');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (mobileNav.classList.contains('is-open') &&
                    !mobileNav.contains(e.target) &&
                    !mobileToggle.contains(e.target)) {
                    mobileNav.classList.remove('is-open');
                    mobileToggle.classList.remove('is-active');
                    document.body.classList.remove('nav-is-open');
                }
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            // Check for saved theme preference or default to light mode
            const currentTheme = localStorage.getItem('theme') || 'light';
            if (currentTheme === 'dark') {
                document.body.classList.add('dark-mode');
            }

            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
                localStorage.setItem('theme', theme);
            });
        }

        // Sticky header on scroll
        const stickyHeader = document.querySelector('.js-sticky-header');
        if (stickyHeader) {
            let lastScroll = 0;
            window.addEventListener('scroll', function() {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 100) {
                    stickyHeader.classList.add('is-sticky');
                } else {
                    stickyHeader.classList.remove('is-sticky');
                }

                lastScroll = currentScroll;
            }, { passive: true });
        }

        // Set active navigation link
        setActiveNavLink();
    }

    /**
     * Initialize footer functionality after it loads
     */
    function initializeFooter() {
        // Create scroll to top button if it doesn't exist
        let scrollTopBtn = document.querySelector('.footer__scroll-top');
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.className = 'footer__scroll-top';
            scrollTopBtn.innerHTML = '↑';
            scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
            document.body.appendChild(scrollTopBtn);
        }

        // Show/hide scroll to top button
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        // Scroll to top on click
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Load all components when DOM is ready
     */
    function loadAllComponents() {
        // Load header
        loadComponent('header.html', 'header-placeholder', initializeHeader);

        // Load footer
        loadComponent('footer.html', 'footer-placeholder', initializeFooter);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllComponents);
    } else {
        loadAllComponents();
    }

})();
