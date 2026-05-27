/* 
   Universidad Aurelius - Lógica Web Principal
*/

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initStatsCounter();
    initMegamenuInteractions();
});

/**
 * Controla el comportamiento del header al hacer scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header-wrapper');
    if (!header) return;

    const checkScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Comprobar al cargar
    checkScroll();
    
    // Escuchar el scroll
    window.addEventListener('scroll', checkScroll);
}

/**
 * Menú responsivo móvil (Hamburger)
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Animación simple de las líneas del hamburger
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Inyectar estilos para el menú móvil dinámico en JS si no se aplicaron del todo en CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 768px) {
            .nav-menu.active {
                display: flex !important;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: var(--primary-dark);
                padding: 2rem;
                gap: 1.5rem;
                box-shadow: 0 10px 20px rgba(0,0,0,0.15);
                border-top: 1px solid rgba(255,255,255,0.08);
            }
            .nav-menu.active .nav-link {
                color: var(--text-light) !important;
                display: block;
                text-align: center;
                font-size: 1.1rem;
            }
            .nav-menu.active .megamenu {
                display: none !important; /* Desactivar megamenú en móvil para simplificar */
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Animación fluida para los contadores de estadísticas (Cifras de Prestigio)
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const animateStat = (stat) => {
        const targetStr = stat.getAttribute('data-target');
        // Extraer los caracteres especiales como % o +
        const suffix = targetStr.replace(/[0-9]/g, '');
        const targetVal = parseInt(targetStr.replace(/[^0-9]/g, ''), 10);
        
        let currentVal = 0;
        const duration = 2000; // 2 segundos
        const stepTime = Math.max(Math.floor(duration / targetVal), 15);
        
        const timer = setInterval(() => {
            currentVal += Math.ceil(targetVal / (duration / stepTime));
            if (currentVal >= targetVal) {
                stat.textContent = targetVal + suffix;
                clearInterval(timer);
            } else {
                stat.textContent = currentVal + suffix;
            }
        }, stepTime);
    };

    // Usar IntersectionObserver para activar la animación solo cuando sean visibles
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStat(entry.target);
                observer.unobserve(entry.target); // Ejecutar solo una vez
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        // Guardar el valor original en data-target e inicializar en 0
        stat.setAttribute('data-target', stat.textContent.trim());
        stat.textContent = '0';
        observer.observe(stat);
    });
}

/**
 * Previene que el megamenú se oculte inmediatamente y mejora accesibilidad
 */
function initMegamenuInteractions() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const megamenu = item.querySelector('.megamenu');
        if (!megamenu) return;
        
        item.addEventListener('mouseenter', () => {
            megamenu.style.display = 'grid';
        });
        
        item.addEventListener('mouseleave', () => {
            // Esperar brevemente antes de ocultar
            setTimeout(() => {
                if (!item.matches(':hover')) {
                    megamenu.style.display = '';
                }
            }, 50);
        });
    });
}
