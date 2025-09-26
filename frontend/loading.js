document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const mainHeader = document.querySelector('.main-header'); 
    
    // Variables para el control del Header Hiding
    let lastScrollY = window.scrollY;
    const headerHeight = mainHeader ? mainHeader.offsetHeight : 80; 
    
    // Función para el Header Hiding
    function handleHeaderHide() {
        if (!mainHeader) return;

        if (window.scrollY > headerHeight) {
            
            // Scroll hacia ABAJO (ocultar)
            if (window.scrollY > lastScrollY) {
                mainHeader.classList.add('hidden');
            } 
            // Scroll hacia ARRIBA (mostrar)
            else {
                mainHeader.classList.remove('hidden');
            }
        } else {
             // Si estamos cerca de la parte superior, siempre se muestra
            mainHeader.classList.remove('hidden');
        }

        lastScrollY = window.scrollY;
    }
    
    window.addEventListener('scroll', handleHeaderHide);


    // --- LÓGICA DE CARGA ---

    // Oculta la pantalla de carga después de que la ventana esté completamente cargada
    window.addEventListener('load', () => {
        
        // MODIFICACIÓN: Aumentamos el tiempo de espera a 1500ms (1.5 segundos)
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            mainContent.style.display = 'flex'; 
        }, 1500); 
    });

    // --- LÓGICA DE NAVEGACIÓN Y SMOOTH SCROLL ---
    
    const navLinks = document.querySelectorAll('.main-header nav a');
    const sections = document.querySelectorAll('.content-section');

    function highlightNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; 
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();

    // Smooth scroll para los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100, 
                    behavior: 'smooth'
                });
            }
        });
    });
});