// Funcionalidad del menú hamburguesa para dispositivos móviles
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle del menú hamburguesa
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Prevenir scroll del body cuando el menú está activo
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            // Añadir índices para animación escalonada
            const menuItems = navMenu.querySelectorAll('li');
            menuItems.forEach((item, index) => {
                item.style.setProperty('--item-index', index);
            });
        } else {
            document.body.style.overflow = '';
        }
    });

    // Manejar dropdown en móviles
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = this.closest('.dropdown');
                dropdown.classList.toggle('active');
                
                // Cerrar otros dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
            }
        });
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (!this.classList.contains('dropdown-toggle')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
                
                // Cerrar dropdowns
                dropdowns.forEach(d => d.classList.remove('active'));
                
                // Actualizar enlace activo
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Cerrar menú al hacer click en enlace del dropdown
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.style.transform = 'rotate(0deg)';
            
            // Cerrar dropdowns
            dropdowns.forEach(d => d.classList.remove('active'));
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
            
            // Cerrar dropdowns
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });

    // Efecto parallax suave en scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // Animación de entrada para elementos cuando aparecen en viewport
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

    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('.main-title, .main-text, .hero-image');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Efecto hover dinámico para el logo
    const logo = document.querySelector('.logo h1');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Easter egg: Bazinga click effect
    const heroImageElement = document.querySelector('.hero-image');
    if (heroImageElement) {
        let clickCount = 0;
        heroImageElement.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount === 3) {
                // Crear elemento de texto "BAZINGA!"
                const bazingaText = document.createElement('div');
                bazingaText.textContent = 'BAZINGA!';
                bazingaText.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 4rem;
                    font-weight: bold;
                    color: #ff6b35;
                    z-index: 9999;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    animation: bazingaAnimation 2s ease-out forwards;
                    pointer-events: none;
                `;
                
                // Añadir animación CSS
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes bazingaAnimation {
                        0% {
                            opacity: 0;
                            transform: translate(-50%, -50%) scale(0.5);
                        }
                        50% {
                            opacity: 1;
                            transform: translate(-50%, -50%) scale(1.2);
                        }
                        100% {
                            opacity: 0;
                            transform: translate(-50%, -50%) scale(1);
                        }
                    }
                `;
                
                document.head.appendChild(style);
                document.body.appendChild(bazingaText);
                
                // Remover después de la animación
                setTimeout(() => {
                    document.body.removeChild(bazingaText);
                    document.head.removeChild(style);
                }, 2000);
                
                clickCount = 0;
            }
        });
    }
});
