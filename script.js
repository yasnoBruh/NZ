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
    const modalImage = document.querySelector('.portfolio-modal-image');
    const modalCaption = document.querySelector('.portfolio-modal-caption');
    const modalThumbs = document.querySelector('.portfolio-modal-thumbs');
    const modalPrev = document.querySelector('.portfolio-modal-prev');
    const modalNext = document.querySelector('.portfolio-modal-next');

    let isAnimating = false;
    let activeGallery = [];
    let activeTitle = '';
    let activeIndex = 0;

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

    function renderModalImage() {
        if (!modalImage || !modalCaption || activeGallery.length === 0) {
            return;
        }

        modalImage.src = activeGallery[activeIndex];
        modalImage.alt = activeTitle;
        modalCaption.textContent = activeGallery.length > 1
            ? activeTitle + ' - экран ' + (activeIndex + 1) + ' из ' + activeGallery.length
            : activeTitle;

        if (modalPrev) {
            modalPrev.classList.toggle('is-hidden', activeGallery.length < 2);
        }

        if (modalNext) {
            modalNext.classList.toggle('is-hidden', activeGallery.length < 2);
        }

        if (modalThumbs) {
            Array.from(modalThumbs.children).forEach(function(thumb, index) {
                thumb.classList.toggle('is-active', index === activeIndex);
            });
        }
    }

    function openModal(images, title) {
        if (!modal || !modalImage || images.length === 0) {
            return;
        }

        activeGallery = images;
        activeTitle = title;
        activeIndex = 0;

        if (modalThumbs) {
            modalThumbs.innerHTML = '';

            activeGallery.forEach(function(image, index) {
                const thumbButton = document.createElement('button');
                const thumbImage = document.createElement('img');

                thumbButton.type = 'button';
                thumbButton.className = 'portfolio-modal-thumb';
                thumbButton.setAttribute('aria-label', 'Показать экран ' + (index + 1));

                thumbImage.src = image;
                thumbImage.alt = title + ' миниатюра ' + (index + 1);

                thumbButton.appendChild(thumbImage);
                thumbButton.addEventListener('click', function() {
                    activeIndex = index;
                    renderModalImage();
                });

                modalThumbs.appendChild(thumbButton);
            });
        }

        renderModalImage();
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal || !modal.classList.contains('is-open')) {
            return;
        }

        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        modalImage.src = '';
        modalImage.alt = '';
        activeGallery = [];
        activeTitle = '';
        activeIndex = 0;

        if (modalThumbs) {
            modalThumbs.innerHTML = '';
        }

        if (!burger || !burger.classList.contains('active')) {
            document.body.style.overflow = 'auto';
        }
    }

    function showNextImage(step) {
        if (activeGallery.length < 2) {
            return;
        }

        activeIndex = (activeIndex + step + activeGallery.length) % activeGallery.length;
        renderModalImage();
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

    if (modalPrev) {
        modalPrev.addEventListener('click', function() {
            showNextImage(-1);
        });
    }

    if (modalNext) {
        modalNext.addEventListener('click', function() {
            showNextImage(1);
        });
    }

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

    document.addEventListener('keydown', function(event) {
        if (!modal || !modal.classList.contains('is-open')) {
            return;
        }

        if (event.key === 'Escape') {
            closeModal();
        }

        if (event.key === 'ArrowRight') {
            showNextImage(1);
        }

        if (event.key === 'ArrowLeft') {
            showNextImage(-1);
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
