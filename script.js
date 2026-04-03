document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const header = document.querySelector('.header');
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    let isAnimating = false;

    function applyFilter(filterValue) {
        if (isAnimating) {
            return;
        }

        isAnimating = true;

        filterButtons.forEach(function(button) {
            button.classList.toggle('active', button.getAttribute('data-filter') === filterValue);
        });

        portfolioItems.forEach(function(item) {
            item.classList.remove('visible', 'delay-1', 'delay-2', 'delay-3');
            item.classList.add('hidden');
        });

        setTimeout(function() {
            const visibleItems = Array.from(portfolioItems).filter(function(item) {
                return item.getAttribute('data-category') === filterValue;
            });

            visibleItems.forEach(function(item, index) {
                setTimeout(function() {
                    item.classList.remove('hidden');
                    item.classList.add('visible', 'delay-' + Math.min(index + 1, 3));
                }, index * 40);
            });

            setTimeout(function() {
                isAnimating = false;
            }, 220);
        }, 90);
    }

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            if (this.classList.contains('active')) {
                return;
            }

            applyFilter(filterValue);
        });
    });

    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        applyFilter(activeFilter.getAttribute('data-filter'));
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (!targetSection) {
                return;
            }

            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    if (burger && navMenu) {
        burger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');

            const isOpen = this.classList.contains('active');
            this.setAttribute('aria-expanded', String(isOpen));
            this.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (burger) {
                burger.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
                burger.setAttribute('aria-label', 'Открыть меню');
            }

            if (navMenu) {
                navMenu.classList.remove('active');
            }

            document.body.style.overflow = 'auto';
        });
    });

    document.addEventListener('click', function(event) {
        if (burger && navMenu && !burger.contains(event.target) && !navMenu.contains(event.target)) {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', 'Открыть меню');
            document.body.style.overflow = 'auto';
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && burger && navMenu) {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', 'Открыть меню');
            document.body.style.overflow = 'auto';
        }
    });

    window.addEventListener('scroll', function() {
        if (!header) {
            return;
        }

        if (window.scrollY > 120) {
            header.style.background = 'rgba(13, 15, 14, 0.94)';
        } else {
            header.style.background = 'rgba(17, 19, 18, 0.86)';
        }
    });

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    const animatedElements = document.querySelectorAll('.hero-content, .portfolio-item, .info-content');
    animatedElements.forEach(function(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(26px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});
