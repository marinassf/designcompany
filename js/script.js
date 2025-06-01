document.addEventListener('DOMContentLoaded', function () {

    /**
     * ===================================================================
     * FUNÇÃO PARA CARREGAR COMPONENTES (HEADER/FOOTER)
     * Carrega um arquivo HTML e o insere em um seletor.
     * Executa uma função de callback após o carregamento.
     * ===================================================================
     */
    const loadComponent = (selector, url, callback) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = data;
                    if (callback) {
                        callback(); // Executa a função SÓ DEPOIS que o HTML foi inserido
                    }
                }
            })
            .catch(error => console.error(error));
    };


    /**
     * ===================================================================
     * INICIALIZAÇÃO DAS FUNÇÕES
     * Funções que dependem do conteúdo principal da página.
     * ===================================================================
     */
    initAccordion();
    initCarousel();
    initLoadMore();


    /**
     * ===================================================================
     * CARREGAMENTO DOS COMPONENTES
     * Carrega o header e o footer e, em seguida, inicializa
     * os scripts que dependem deles.
     * ===================================================================
     */
    loadComponent("#header-placeholder", "header.html", () => {
        // Funções que precisam do header.html para funcionar
        initMenuToggle();
    });

    loadComponent("#footer-placeholder", "footer.html", () => {
        // Funções que precisam do footer.html para funcionar
        initCopyrightYear();
    });


    /**
     * ===================================================================
     * DEFINIÇÃO DAS FUNÇÕES
     * Cada funcionalidade é encapsulada em sua própria função.
     * ===================================================================
     */

    // --- Lógica do Menu Hamburger e Dropdowns ---
    function initMenuToggle() {
        const menuToggle = document.querySelector('.menu-toggle');
        const primaryMenu = document.getElementById('primary-menu');

        if (menuToggle && primaryMenu) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                primaryMenu.classList.toggle('active');
            });
        }

        document.querySelectorAll('.menu-item-has-children > a').forEach(item => {
            item.addEventListener('click', function (event) {
                // Previne o clique em telas mobile para abrir o submenu
                if (window.innerWidth <= 768) {
                    const parentLi = this.parentElement;
                    if (parentLi.classList.contains('menu-item-has-children')) {
                        // Se o menu já estiver aberto, permite a navegação.
                        if (!parentLi.classList.contains('open')) {
                            event.preventDefault();
                            parentLi.classList.toggle('open');
                        }
                    }
                }
            });
        });
    }

    // --- Lógica do Copyright do Rodapé ---
    function initCopyrightYear() {
        const currentYearSpan = document.getElementById('current-year-footer-revento');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }

    // --- Lógica do Acordeão ---
    function initAccordion() {
        const processSteps = document.querySelectorAll('.process-section .process-step');
        if (!processSteps.length) return;

        processSteps.forEach(step => {
            const button = step.querySelector('.step-toggle-button');
            const content = step.querySelector('.step-details-content');
            const arrowSvgPath = step.querySelector('svg.arrow-icon path');
            const arrowUpPath = 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z';
            const arrowDownPath = 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z';

            // Garante que todos comecem fechados
            if (content) content.style.display = 'none';

            if (button) {
                button.addEventListener('click', function () {
                    const isActive = step.classList.contains('active');

                    // Fecha todos os outros steps
                    processSteps.forEach(otherStep => {
                        if (otherStep !== step) {
                            otherStep.classList.remove('active');
                            otherStep.querySelector('.step-toggle-button').setAttribute('aria-expanded', 'false');
                            otherStep.querySelector('.step-details-content').style.display = 'none';
                            otherStep.querySelector('svg.arrow-icon path').setAttribute('d', arrowDownPath);
                        }
                    });

                    // Alterna o step atual
                    step.classList.toggle('active');
                    this.setAttribute('aria-expanded', !isActive);
                    content.style.display = isActive ? 'none' : 'flex';
                    arrowSvgPath.setAttribute('d', isActive ? arrowDownPath : arrowUpPath);
                });
            }
        });
    }
    // --- Lógica do Carrossel ---
    function initCarousel() {
        const carouselWindow = document.querySelector('.carousel-window'); // NOVO: Seleciona a janela do carrossel
        const track = document.querySelector('.slider-track');

        // Verifica se os elementos essenciais existem
        if (!carouselWindow || !track) return;

        const slides = Array.from(track.children);
        if (!slides.length) return;

        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-dots');

        let currentIndex = 0;
        let autoplayInterval = null; // NOVO: Variável para controlar o timer
        const AUTOPLAY_SPEED = 5000; // NOVO: Tempo em milissegundos (5 segundos)

        // Cria os pontos de navegação dinamicamente
        dotsNav.innerHTML = '';
        slides.forEach(() => dotsNav.appendChild(document.createElement('button')));
        const dots = Array.from(dotsNav.children);
        dots.forEach((dot, index) => {
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                updateCarousel(index);
                startAutoplay(); // NOVO: Reinicia o timer ao clicar
            });
        });

        const updateCarousel = (targetIndex) => {
            track.style.transform = `translateX(-${targetIndex * 100}%)`;
            if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
            if (dots[targetIndex]) dots[targetIndex].classList.add('active');
            currentIndex = targetIndex;
        };

        // NOVO: Funções para controlar o autoplay
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        function startAutoplay() {
            stopAutoplay(); // Garante que não haja múltiplos timers rodando
            autoplayInterval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % slides.length;
                updateCarousel(nextIndex);
            }, AUTOPLAY_SPEED);
        }

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            updateCarousel(nextIndex);
            startAutoplay(); // NOVO: Reinicia o timer ao clicar
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel(prevIndex);
            startAutoplay(); // NOVO: Reinicia o timer ao clicar
        });

        // NOVO: Pausa o autoplay quando o mouse está sobre o carrossel
        carouselWindow.addEventListener('mouseenter', stopAutoplay);
        carouselWindow.addEventListener('mouseleave', startAutoplay);

        // Inicia o carrossel e o autoplay
        updateCarousel(0);
        startAutoplay();
    }
    // --- Lógica do Botão "Carregar Mais" ---
    function initLoadMore() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', () => {
            const grid = document.querySelector('.blogs-grid');
            const firstCard = grid.querySelector('.blog-card');
            if (!firstCard) return;

            // Simulação: clona os dois primeiros cards. Em um app real, faria uma chamada de API.
            grid.appendChild(firstCard.cloneNode(true));
            if (grid.children[1]) {
                grid.appendChild(grid.children[1].cloneNode(true));
            }

            loadMoreBtn.textContent = 'Loading...';
            setTimeout(() => {
                loadMoreBtn.textContent = 'Load More';
            }, 1000);
        });
    }

});

// Adicione esta função ao seu script e chame-a dentro do DOMContentLoaded

/**
 * Atualiza o ano no rodapé para o ano atual.
 */
function initFooter() {
    // ID corrigido para 'visionary'
    const currentYearSpan = document.getElementById('current-year-footer-visionary');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

// Dentro do seu listener principal, chame a nova função:
document.addEventListener('DOMContentLoaded', function () {
    // ... suas outras funções (initCarousel, etc.)

    initFooter(); // Chama a função para o rodapé
});

document.addEventListener("DOMContentLoaded", function() {

    // Função para carregar um componente HTML
    const loadComponent = (selector, url, callback) => {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${url}`);
                return response.text();
            })
            .then(data => {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = data;
                    if (callback) callback();
                }
            })
            .catch(error => console.error(error));
    };

    // Função para inicializar o rodapé (atualizar o ano)
    function initFooterRevento() {
        const yearSpan = document.getElementById('current-year-footer-revento');
        if (yearSpan) {
            // A imagem mostra 2024, mas o código usará o ano atual, o que é mais correto.
            yearSpan.textContent = new Date().getFullYear(); 
        }
    }

    // Carregue o header e o novo footer
    // Supondo que seu header esteja em um placeholder com id="header-placeholder"
    loadComponent("#header-placeholder", "header.html", initMenu); // ou a função que inicializa seu menu
    
    // Supondo que seu footer esteja em um placeholder com id="footer-placeholder"
    loadComponent("#footer-placeholder", "footer-revento.html", initFooterRevento);

    // ... Chame outras funções de inicialização aqui (carousel, acordeão, etc.)
});