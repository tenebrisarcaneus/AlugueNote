document.addEventListener('DOMContentLoaded', () => {
    'use strict'; // Habilita o modo estrito para pegar erros comuns

    // --- Configurações e Constantes ---
    const FORM_BASE_URL = 'https://tenebrisarcaneus.github.io/formulario/';
    const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/450x280/EAEAEA/999999?text=Imagem+Indispon%C3%ADvel';
    const NOTEBOOKS_DATA = [
        {
            id: 1,
            nome: 'Notebook Essencial Pro',
            descricao: 'Ideal para estudos e tarefas do dia a dia. Leve e com boa autonomia de bateria.',
            imagem: 'https://via.placeholder.com/450x280/0D7377/FFFFFF?text=Notebook+Essencial',
            disponivel: false,
            specs: 'Intel Core i3, 8GB RAM, 256GB SSD, Tela 14" HD',
            precos: { diaria: 'R$ 35,00', semanal: 'R$ 180,00', mensal: 'R$ 450,00' }
        },
        {
            id: 2,
            nome: 'Notebook Performance Max',
            descricao: 'Potência para trabalho pesado, edição e multitarefas. Desempenho superior.',
            imagem: 'https://picsum.photos/seed/nbMaxPerformance/450/280',
            disponivel: true,
            specs: 'Intel Core i5, 20GB RAM, 400GB SSD NVMe, 500GB HD, Tela 15.6" Full HD',
            precos: { diaria: 'R$ 55,00', semanal: 'R$ 290,00', mensal: 'R$ 750,00' }
        },
        {
            id: 3,
            nome: 'Notebook Ultra Fino',
            descricao: 'Design elegante, leveza extrema e performance para quem está sempre em movimento.',
            imagem: 'https://via.placeholder.com/450x280/F0A500/323232?text=Notebook+Ultra+Fino',
            disponivel: false,
            specs: 'Intel Core i7, 8GB RAM, 256GB SSD, Tela 13.3" Full HD Touch',
            precos: { diaria: 'R$ 60,00', semanal: 'R$ 320,00', mensal: 'R$ 800,00' }
        },
        {
            id: 4,
            nome: 'Notebook Gamer Starter',
            descricao: 'Para jogos casuais e tarefas que exigem placa de vídeo dedicada. Boa refrigeração.',
            imagem: 'https://picsum.photos/seed/nbGamerStarter/450/280',
            disponivel: false,
            specs: 'AMD Ryzen 5, 8GB RAM, 512GB SSD, NVIDIA GTX 1650, Tela 15.6" 120Hz',
            precos: { diaria: 'R$ 70,00', semanal: 'R$ 380,00', mensal: 'R$ 950,00' }
        },
         {
            id: 5,
            nome: 'Notebook Custo-Benefício',
            descricao: 'Opção econômica para tarefas básicas de navegação e escritório.',
            imagem: 'https://via.placeholder.com/450x280/CCCCCC/FFFFFF?text=Notebook+Econ%C3%B4mico',
            disponivel: false,
            specs: 'Intel Celeron, 4GB RAM, 128GB eMMC, Tela 14" HD',
            precos: { diaria: 'R$ 25,00', semanal: 'R$ 130,00', mensal: 'R$ 350,00' }
        }
        // !! SUBSTITUA PELOS SEUS DADOS REAIS !!
    ];

    // --- Seletores de Elementos DOM ---
    const notebookGrid = document.getElementById('notebook-grid');
    const modal = document.getElementById('notebook-modal');
    const closeModalButton = modal?.querySelector('.close-button');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescriptionContainer = document.getElementById('modal-description-container');
    const modalDescription = document.getElementById('modal-description');
    const modalPriceDaily = document.getElementById('modal-price-daily');
    const modalPriceWeekly = document.getElementById('modal-price-weekly');
    const modalPriceMonthly = document.getElementById('modal-price-monthly');
    const modalStatus = document.getElementById('modal-status');
    // !! IMPORTANTE: Renomeie o ID no HTML para 'modal-action-link' !!
    const modalActionLink = document.getElementById('modal-action-link');
    const currentYearSpan = document.getElementById('current-year');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    let previouslyFocusedElement = null; // Para acessibilidade (retorno do foco)

    // --- Validações Iniciais ---
    if (!notebookGrid) {
        console.error("Erro crítico: Elemento #notebook-grid não encontrado. A aplicação não pode continuar.");
        return; // Impede a execução do restante do script se o grid não existe
    }
    if (!modal) {
        console.error("Erro crítico: Elemento #notebook-modal não encontrado. A funcionalidade do modal está desabilitada.");
        // Poderia continuar sem o modal, mas a experiência será degradada.
    }
     if (!modalActionLink && modal) {
        console.warn("Aviso: Elemento #modal-action-link não encontrado dentro do modal. O botão de ação não funcionará.");
    }


    // --- Função para Renderizar os Cards dos Notebooks ---
    function renderNotebooks() {
        notebookGrid.innerHTML = ''; // Limpa o grid antes de renderizar

        if (!NOTEBOOKS_DATA || NOTEBOOKS_DATA.length === 0) {
            notebookGrid.innerHTML = '<p class="empty-message">Nenhum notebook disponível no momento. Volte em breve!</p>';
            return;
        }

        NOTEBOOKS_DATA.forEach(notebook => {
            const card = document.createElement('div');
            card.classList.add('notebook-card');
            card.setAttribute('data-notebook-id', notebook.id); // Facilita seleção se necessário

            const image = document.createElement('img');
            image.src = notebook.imagem;
            image.alt = `Imagem ilustrativa do ${notebook.nome}`; // Alt text mais descritivo
            image.loading = 'lazy'; // Melhora performance inicial
            image.onerror = function() {
                console.warn(`Falha ao carregar imagem: ${notebook.imagem}. Usando fallback.`);
                this.src = FALLBACK_IMAGE_URL;
                this.alt = 'Imagem indisponível'; // Atualiza o alt text no erro
            };

            const content = document.createElement('div');
            content.classList.add('notebook-card-content');

            const title = document.createElement('h3');
            title.textContent = notebook.nome;

            const description = document.createElement('p');
            description.classList.add('description');
            description.textContent = notebook.descricao;

            const status = document.createElement('span');
            status.classList.add('status', notebook.disponivel ? 'disponivel' : 'alugado');
            status.textContent = notebook.disponivel ? 'Disponível' : 'Alugado';

            const detailsButton = document.createElement('button');
            detailsButton.classList.add('btn', 'btn-secondary', 'details-btn');
            detailsButton.textContent = 'Ver Detalhes';
            detailsButton.setAttribute('aria-haspopup', 'dialog'); // Indica que abre um modal/dialog
            detailsButton.addEventListener('click', (event) => {
                previouslyFocusedElement = event.currentTarget; // Guarda o botão para retorno do foco
                openModal(notebook.id);
            });

            content.appendChild(title);
            content.appendChild(description);
            content.appendChild(status);
            content.appendChild(detailsButton);
            card.appendChild(image);
            card.appendChild(content);
            notebookGrid.appendChild(card);
        });
    }

    // --- Funções do Modal ---
    function openModal(notebookId) {
        if (!modal) return; // Não faz nada se o modal não existe

        const notebook = NOTEBOOKS_DATA.find(nb => nb.id === notebookId);
        if (!notebook) {
            console.error(`Notebook com ID ${notebookId} não encontrado nos dados.`);
            return; // Sai da função se o notebook não for achado
        }

        // Preenche os dados do modal (com verificações se os elementos existem)
        if (modalImg) {
            modalImg.src = notebook.imagem;
            modalImg.alt = notebook.nome;
            modalImg.onerror = function() {
                console.warn(`Falha ao carregar imagem no modal: ${notebook.imagem}. Usando fallback.`);
                this.src = FALLBACK_IMAGE_URL;
                this.alt = 'Imagem indisponível';
            };
        }
        if (modalTitle) modalTitle.textContent = notebook.nome;

        // Limpa specs antigas e adiciona novas
        if (modalDescriptionContainer) {
            const oldSpecs = modalDescriptionContainer.querySelector('.specs-details');
            if (oldSpecs) oldSpecs.remove();

            if (modalDescription) modalDescription.textContent = notebook.descricao;

            if (notebook.specs) {
                const specsElement = document.createElement('p');
                specsElement.classList.add('specs-details');
                specsElement.innerHTML = `<strong>Especificações:</strong> ${notebook.specs}`; // Usa innerHTML para o strong
                modalDescriptionContainer.appendChild(specsElement);
            }
        }

        if (modalPriceDaily) modalPriceDaily.textContent = `Diária: ${notebook.precos.diaria}`;
        if (modalPriceWeekly) modalPriceWeekly.textContent = `Semanal: ${notebook.precos.semanal}`;
        if (modalPriceMonthly) modalPriceMonthly.textContent = `Mensal: ${notebook.precos.mensal}`;

        if (modalStatus) {
            modalStatus.textContent = `Status: ${notebook.disponivel ? 'Disponível' : 'Alugado'}`;
            modalStatus.className = 'modal-status ' + (notebook.disponivel ? 'disponivel' : 'alugado');
        }

        // Atualiza o link/botão de ação para o formulário
        if (modalActionLink) {
            if (notebook.disponivel) {
                const notebookNomeParam = encodeURIComponent(notebook.nome);
                const notebookIdParam = notebook.id; // Passa o ID também
                modalActionLink.href = `${FORM_BASE_URL}?id=${notebookIdParam}&notebook=${notebookNomeParam}`;
                modalActionLink.textContent = 'Solicitar Aluguel'; // Define o texto do botão
                modalActionLink.style.display = 'inline-block'; // Garante que esteja visível
                 if (modalStatus) modalStatus.textContent = 'Status: Disponível'; // Atualiza status text
            } else {
                modalActionLink.style.display = 'none'; // Esconde o botão se não disponível
                if (modalStatus) modalStatus.textContent = 'Status: Alugado (Indisponível no momento)';
            }
        }

        // Exibe o Modal e cuida da acessibilidade
        modal.removeAttribute('hidden');
        modal.classList.add('show'); // Para transições CSS
        document.body.style.overflow = 'hidden'; // Impede scroll do fundo

        // Garante que os atributos ARIA estejam corretos
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-describedby', 'modal-description-container');
        modal.setAttribute('aria-modal', 'true'); // Indica que é um modal que prende o foco

        // Foco no botão de fechar (se existir) para acessibilidade
        closeModalButton?.focus();
    }

    function closeModal() {
        if (!modal) return;

        modal.setAttribute('hidden', 'true'); // Esconde semanticamente
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaura scroll
        modal.removeAttribute('aria-modal');

        // Retorna o foco para o elemento que abriu o modal (importante para acessibilidade)
        if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
            previouslyFocusedElement.focus();
        }
        previouslyFocusedElement = null; // Limpa a referência
    }

    // --- Event Listeners Globais e do Modal ---
    if (modal) {
        // Botão de fechar
        if (closeModalButton) {
            closeModalButton.addEventListener('click', closeModal);
        } else {
            console.warn("Botão de fechar modal não encontrado (elemento com classe '.close-button').");
        }

        // Clicar fora do conteúdo do modal (no backdrop)
        modal.addEventListener('click', (event) => {
            // Verifica se o clique foi exatamente no elemento modal (backdrop)
            if (event.target === modal) {
                closeModal();
            }
        });

        // Fechar com a tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.hasAttribute('hidden')) {
                closeModal();
            }
        });

        // Garante que o modal comece escondido
        modal.setAttribute('hidden', 'true');

    } // Fim if(modal)

    // --- Atualizar Ano no Rodapé ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Elemento #current-year para exibir o ano não encontrado.");
    }

    // --- Menu Mobile Toggle ---
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(!isExpanded)); // Converte para string

            const icon = menuToggle.querySelector('i'); // Assume FontAwesome ou similar
            if (icon) {
                if (!isExpanded) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    menuToggle.setAttribute('aria-label', 'Fechar Menu');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    menuToggle.setAttribute('aria-label', 'Abrir Menu');
                }
            }
        });

        // Fecha o menu se clicar em um link dentro dele
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                     const icon = menuToggle.querySelector('i');
                     if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                     }
                    menuToggle.setAttribute('aria-label', 'Abrir Menu');
                }
            });
        });

        // Fecha o menu se clicar fora dele
        document.addEventListener('click', (event) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(event.target) && // Clique não foi dentro do menu
                !menuToggle.contains(event.target)) // Clique não foi no botão toggle
            {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                 const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                menuToggle.setAttribute('aria-label', 'Abrir Menu');
            }
        });

    } else {
        if (!menuToggle) console.warn("Elemento .menu-toggle para menu mobile não encontrado.");
        if (!navLinks) console.warn("Elemento .nav-links para menu mobile não encontrado.");
    }


    // --- Inicialização ---
    renderNotebooks(); // Renderiza os cards na carga inicial da página

}); // Fim do DOMContentLoaded
