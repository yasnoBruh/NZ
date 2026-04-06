document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const header = document.querySelector('.header');
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const modal = document.querySelector('.portfolio-modal');
    const modalBackdrop = document.querySelector('.portfolio-modal-backdrop');
    const modalClose = document.querySelector('.portfolio-modal-close');
    const modalTitle = document.querySelector('.portfolio-modal-title');
    const modalCaption = document.querySelector('.portfolio-modal-caption');
    const modalScroll = document.querySelector('.portfolio-modal-scroll');
    const infoText = document.querySelector('.info-text');
    const infoGallery = document.querySelector('.info-gallery');

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

    function openModal(images, title) {
        if (!modal || !modalScroll || images.length === 0) {
            return;
        }

        modalScroll.innerHTML = '';

        if (modalTitle) {
            modalTitle.textContent = title;
        }

        if (modalCaption) {
            modalCaption.textContent = images.length > 1
                ? 'Полноразмерный просмотр проекта. Листай внутри окна, чтобы увидеть все экраны.'
                : 'Полноразмерный просмотр работы.';
        }

        images.forEach(function(image, index) {
            const frame = document.createElement('div');
            const fullImage = document.createElement('img');

            frame.className = 'portfolio-modal-image-frame';
            fullImage.className = 'portfolio-modal-image';
            fullImage.src = image;
            fullImage.alt = title + ' экран ' + (index + 1);
            fullImage.loading = 'lazy';
            fullImage.decoding = 'async';

            frame.appendChild(fullImage);
            modalScroll.appendChild(frame);
        });

        if (images.length > 1) {
            const note = document.createElement('p');
            note.className = 'portfolio-modal-scroll-note';
            note.textContent = 'Экранов в проекте: ' + images.length;
            modalScroll.appendChild(note);
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        if (!modal || !modal.classList.contains('is-open')) {
            return;
        }

        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        if (modalTitle) {
            modalTitle.textContent = '';
        }
        if (modalCaption) {
            modalCaption.textContent = '';
        }
        if (modalScroll) {
            modalScroll.innerHTML = '';
            modalScroll.scrollTop = 0;
        }

        if (!burger || !burger.classList.contains('active')) {
            document.body.classList.remove('modal-open');
        }
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

    portfolioCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const portfolioItem = this.closest('.portfolio-item');
            if (!portfolioItem) {
                return;
            }

            const images = (portfolioItem.dataset.images || '')
                .split('|')
                .map(function(image) {
                    return image.trim();
                })
                .filter(Boolean);

            openModal(images, portfolioItem.dataset.title || 'Работа');
        });
    });

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

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    function syncInfoGalleryHeight() {
        if (!infoText || !infoGallery) {
            return;
        }

        if (window.innerWidth <= 768) {
            infoGallery.style.removeProperty('--info-gallery-height');
            return;
        }

        infoGallery.style.setProperty('--info-gallery-height', infoText.offsetHeight + 'px');
    }

    syncInfoGalleryHeight();

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && burger && navMenu) {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', 'Открыть меню');
            document.body.style.overflow = 'auto';
        }

        syncInfoGalleryHeight();
    });

    if (window.ResizeObserver && infoText) {
        const infoResizeObserver = new ResizeObserver(function() {
            syncInfoGalleryHeight();
        });

        infoResizeObserver.observe(infoText);
    }

    window.addEventListener('scroll', function() {
        if (!header) {
            return;
        }

        if (window.scrollY > 120) {
            header.style.background = 'rgba(6, 6, 6, 0.96)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.88)';
        }
    });

    document.addEventListener('keydown', function(event) {
        if (!modal || !modal.classList.contains('is-open')) {
            return;
        }

        if (event.key === 'Escape') {
            closeModal();
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
