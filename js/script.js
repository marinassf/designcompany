document.addEventListener('DOMContentLoaded', function () {

    /**
     * ===================================================================
     * FUNÇÃO PARA CARREGAR COMPONENTES (HEADER/FOOTER)
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
                        callback();
                    }
                }
            })
            .catch(error => console.error(error));
    };

    /**
     * ===================================================================
     * FUNÇÕES DE INICIALIZAÇÃO
     * ===================================================================
     */

    // --- Lógica do Acordeão (Processo) ---
    function initAccordion() {
        const processSteps = document.querySelectorAll('.process-section .process-step');
        if (!processSteps.length) return;

        processSteps.forEach(step => {
            const button = step.querySelector('.step-toggle-button');
            const content = step.querySelector('.step-details-content');
            if (!button || !content) return;

            const arrowSvgPath = step.querySelector('svg.arrow-icon path');
            const arrowUpPath = 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z';
            const arrowDownPath = 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z';

            content.style.display = 'none';
            button.setAttribute('aria-expanded', 'false');

            button.addEventListener('click', function () {
                const isActive = step.classList.contains('active');

                processSteps.forEach(otherStep => {
                    if (otherStep !== step) {
                        otherStep.classList.remove('active');
                        otherStep.querySelector('.step-toggle-button')?.setAttribute('aria-expanded', 'false');
                        const otherContent = otherStep.querySelector('.step-details-content');
                        if (otherContent) otherContent.style.display = 'none';
                        otherStep.querySelector('svg.arrow-icon path')?.setAttribute('d', arrowDownPath);
                    }
                });

                step.classList.toggle('active');
                this.setAttribute('aria-expanded', !isActive);
                content.style.display = isActive ? 'none' : 'flex';
                if (arrowSvgPath) {
                    arrowSvgPath.setAttribute('d', isActive ? arrowDownPath : arrowUpPath);
                }
            });
        });
    }

    // --- Lógica do Carrossel (Blog) ---
    function initCarousel() {
        const carouselWindow = document.querySelector('.carousel-window');
        const track = document.querySelector('.slider-track');
        if (!carouselWindow || !track) return;

        const slides = Array.from(track.children);
        if (!slides.length) return;

        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-dots');
        let currentIndex = 0;
        let autoplayInterval = null;
        const AUTOPLAY_SPEED = 5000;
        let dots = [];

        const updateCarousel = (targetIndex) => {
            if (track) {
                track.style.transform = `translateX(-${targetIndex * 100}%)`;
            }
            if (dots.length > 0) {
                dots[currentIndex]?.classList.remove('active');
                dots[targetIndex]?.classList.add('active');
            }
            currentIndex = targetIndex;
        };

        if (dotsNav) {
            dotsNav.innerHTML = '';
            slides.forEach(() => dotsNav.appendChild(document.createElement('button')));
            dots = Array.from(dotsNav.children);
            dots.forEach((dot, index) => {
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    updateCarousel(index);
                    startAutoplay();
                });
            });
        }

        const stopAutoplay = () => clearInterval(autoplayInterval);
        const startAutoplay = () => {
            stopAutoplay();
            autoplayInterval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % slides.length;
                updateCarousel(nextIndex);
            }, AUTOPLAY_SPEED);
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % slides.length;
                updateCarousel(nextIndex);
                startAutoplay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel(prevIndex);
                startAutoplay();
            });
        }

        carouselWindow.addEventListener('mouseenter', stopAutoplay);
        carouselWindow.addEventListener('mouseleave', startAutoplay);

        updateCarousel(0);
        startAutoplay();
    }

    // --- Lógica do Botão "Carregar Mais" ---
    function initLoadMore() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', () => {
            const grid = document.querySelector('.blogs-grid, .projects-grid');
            if (!grid) return;
            
            const firstCard = grid.querySelector('.blog-card, .project-card');
            if (!firstCard) return;

            grid.appendChild(firstCard.cloneNode(true));
            if (grid.children[1]) {
                grid.appendChild(grid.children[1].cloneNode(true));
            }
        });
    }

    // --- Lógica do Copyright do Rodapé ---
    function initCopyrightYear() {
        const currentYearSpan = document.getElementById('current-year-footer-revento');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }

    /**
     * ===================================================================
     * EXECUÇÃO
     * ===================================================================
     */

    // Carrega componentes reutilizáveis
    loadComponent("#header-placeholder", "header.html");
    loadComponent("#footer-placeholder", "footer.html", initCopyrightYear);

    // Inicializa funcionalidades da página
    initAccordion();
    initCarousel();
    initLoadMore();

});