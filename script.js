// Фильтрация портфолио с быстрыми анимациями
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    let isAnimating = false;
    
    // Функция быстрого переключения фильтров
    function applyQuickFilter(filterValue) {
        if (isAnimating) return;
        isAnimating = true;
        
        const isAllFilter = filterValue === 'all';
        
        // Обновляем активную кнопку
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const activeButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === filterValue);
        if (activeButton) activeButton.classList.add('active');
        
        // Определяем режим отображения
        if (isAllFilter) {
            portfolioGrid.classList.remove('centered');
        } else {
            portfolioGrid.classList.add('centered');
        }
        
        // Сначала быстро скрываем все элементы
        portfolioItems.forEach(item => {
            item.classList.remove('visible', 'delay-1', 'delay-2', 'delay-3');
            item.classList.add('hidden');
        });
        
        // Сразу показываем нужные элементы (без долгого ожидания)
        setTimeout(() => {
            const visibleItems = Array.from(portfolioItems).filter(item => 
                isAllFilter || item.getAttribute('data-category') === filterValue
            );
            
            visibleItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.remove('hidden');
                    item.classList.add('visible', `delay-${Math.min(index + 1, 3)}`);
                }, index * 30); // Очень маленькая задержка
            });
            
            // Быстро сбрасываем флаг анимации
            setTimeout(() => {
                isAnimating = false;
            }, 200);
        }, 100); // Короткая пауза перед показом
    }
    
    // Обработчики событий для кнопок фильтра
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            if (this.classList.contains('active')) return;
            
            applyQuickFilter(filterValue);
        });
    });
    
    // Инициализация при загрузке
    portfolioItems.forEach(item => {
        item.classList.add('visible');
    });

    // Плавная прокрутка для навигации
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Бургер-меню для мобильных устройств
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Обновленный обработчик бургера с управлением скроллом
    burger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Закрытие меню при клике вне области
    document.addEventListener('click', function(e) {
        if (burger && navMenu && !burger.contains(e.target) && !navMenu.contains(e.target)) {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Закрытие меню при ресайзе окна (если меню открыто на мобильном)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && burger && navMenu) {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Изменение шапки при скролле
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 650) {
            header.style.background = 'rgba(24, 24, 24, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#303030ff';
            header.style.backdropFilter = 'none';
        }
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Добавляем анимацию для элементов
    const animatedElements = document.querySelectorAll('.portfolio-item, .info-content, .hero-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Обработчик для кнопки "Связаться со мной"
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        const contactsSection = document.querySelector('#contacts');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = contactsSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});