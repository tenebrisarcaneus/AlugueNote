document.addEventListener('DOMContentLoaded', () => {
    'use strict'; // Ajuda a pegar erros comuns

    // --- Dados dos Notebooks (Simulação) ---
    // !! SUBSTITUA PELOS SEUS DADOS REAIS E IMAGENS HOSPEDADAS !!
    const notebooks = [
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
            disponivel: false, // Exemplo de notebook alugado
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
        // Adicione mais notebooks conforme necessário
    ];

    const fallbackImageUrl = 'https://via.placeholder.com/450x280/EAEAEA/999999?text=Imagem+Indispon%C3%ADvel';
    const formularioUrlBase = 'https://tenebrisarcaneus.github.io/formulario/'; // URL base do seu formulário

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
    // ---> USA O ID CORRETO DO HTML ATUALIZADO <---
    const modalActionLink = document.getElementById('modal-action-link');
    const currentYearSpan = document.getElementById('current-year');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    let previouslyFocusedElement = null;

    // --- Verificações Iniciais de Elementos Essenciais ---
    if (!notebookGrid) {
        console.error("Elemento essencial #notebook-grid não encontrado. A lista de notebooks não pode ser exibida.");
        // Considerar exibir uma mensagem para o usuário na página, se apropriado.
        return; // Para a execução se o grid não existe
    }
    if (!modal) {
        console.error("Elemento essencial #notebook-modal não encontrado. A funcionalidade de detalhes do notebook está desabilitada.");
        // O site ainda pode funcionar parcialmente, mas sem modais.
    }

    // --- Função para Renderizar os Cards dos Notebooks ---
    function renderNotebooks() {
        // Limpa o grid antes de adicionar novos cards
        notebookGrid.innerHTML = '';

        if (!notebooks || notebooks.length === 0) {
            notebookGrid.innerHTML = '<p class="info-message">Nenhum notebook disponível no momento.</p>';
            return;
        }

        notebooks.forEach(notebook => {
            const card = document.createElement('div');
            card.classList.add('notebook-card');

            const image = document.createElement('img');
            image.src = notebook.imagem;
            image.alt = `Imagem do ${notebook.nome}`;
            image.loading = 'lazy'; // Otimização de carregamento
            image.onerror = function() {
                console.warn(`Falha ao carregar imagem: ${notebook.imagem}. Usando fallback.`);
                this.src = fallbackImageUrl;
                this.alt = 'Imagem indisponível';
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
            detailsButton.setAttribute('data-notebook-id', notebook.id); // Guarda o ID para fácil acesso
            detailsButton.setAttribute('aria-haspopup', 'dialog');

            // *** PONTO CRÍTICO: Adiciona o listener de clique AQUI ***
            detailsButton.addEventListener('click', (event) => {
                // Verifica se openModal é uma função antes de chamar
                if (typeof openModal === 'function') {
                    previouslyFocusedElement = event.currentTarget; // Guarda para retorno do foco
                    openModal(notebook.id); // Chama a função para abrir o modal
                } else {
                    console.error('Função openModal não definida ou não acessível.');
                }
            });
            // *** FIM DO PONTO CRÍTICO ***

            // Monta a estrutura do card
            content.appendChild(title);
            content.appendChild(description);
            content.appendChild(status);
            content.appendChild(detailsButton); // Adiciona o botão ao conteúdo
            card.appendChild(image);
            card.appendChild(content);
            notebookGrid.appendChild(card); // Adiciona o card completo ao grid
        });
    }

    // --- Funções do Modal ---
    function openModal(notebookId) {
        // Verifica se o modal existe no DOM
        if (!modal) {
            console.error("Tentativa de abrir modal, mas o elemento #notebook-modal não foi encontrado.");
            return;
        }

        const notebook = notebooks.find(nb => nb.id === notebookId);
        if (!notebook) {
            console.error(`Notebook com ID ${notebookId} não encontrado nos dados.`);
            return;
        }

        // Preenche os dados do modal (com verificações de existência dos elementos internos)
        if (modalImg) {
            modalImg.src = notebook.imagem;
            modalImg.alt = notebook.nome; // Atualiza alt text
            modalImg.onerror = function() {
                console.warn(`Falha ao carregar imagem no modal: ${notebook.imagem}. Usando fallback.`);
                this.src = fallbackImageUrl;
                this.alt = 'Imagem indisponível';
            };
        } else { console.warn("Elemento #modal-img não encontrado."); }

        if (modalTitle) {
            modalTitle.textContent = notebook.nome;
        } else { console.warn("Elemento #modal-title não encontrado."); }

        // Lida com a descrição e especificações
        if (modalDescriptionContainer) {
            // Remove specs antigas, se houver
            const oldSpecs = modalDescriptionContainer.querySelector('.specs-details');
            if (oldSpecs) oldSpecs.remove();

            if (modalDescription) {
                modalDescription.textContent = notebook.descricao;
            } else { console.warn("Elemento #modal-description não encontrado."); }

            // Adiciona as novas especificações se existirem
            if (notebook.specs) {
                 const specsElement = document.createElement('p');
                 specsElement.classList.add('specs-details');
                 specsElement.innerHTML = `<strong>Especificações:</strong> ${notebook.specs}`; // Usa innerHTML para formatar
                 modalDescriptionContainer.appendChild(specsElement);
            }
        } else { console.warn("Elemento #modal-description-container não encontrado."); }


        if (modalPriceDaily) { modalPriceDaily.textContent = `Diária: ${notebook.precos.diaria}`; } else { console.warn("Elemento #modal-price-daily não encontrado."); }
        if (modalPriceWeekly) { modalPriceWeekly.textContent = `Semanal: ${notebook.precos.semanal}`; } else { console.warn("Elemento #modal-price-weekly não encontrado."); }
        if (modalPriceMonthly) { modalPriceMonthly.textContent = `Mensal: ${notebook.precos.mensal}`; } else { console.warn("Elemento #modal-price-monthly não encontrado."); }

        if (modalStatus) {
            modalStatus.textContent = `Status: ${notebook.disponivel ? 'Disponível' : 'Alugado'}`;
            modalStatus.className = 'modal-status ' + (notebook.disponivel ? 'disponivel' : 'alugado');
        } else { console.warn("Elemento #modal-status não encontrado."); }

        // Configura o link/botão de ação "Alugar"
        if (modalActionLink) {
            if (notebook.disponivel) {
                const notebookNomeParam = encodeURIComponent(notebook.nome);
                const notebookIdParam = notebook.id; // Incluindo o ID também é útil
                modalActionLink.href = `${formularioUrlBase}?id=${notebookIdParam}&notebook=${notebookNomeParam}`;
                // modalActionLink.textContent = 'Solicitar Aluguel'; // O texto já está "Alugar" no HTML
                modalActionLink.style.display = 'inline-block'; // Garante visibilidade
                if(modalStatus) modalStatus.textContent = 'Status: Disponível'; // Ajusta texto do status
            } else {
                modalActionLink.style.display = 'none'; // Esconde se indisponível
                 if(modalStatus) modalStatus.textContent = 'Status: Alugado (Indisponível no momento)'; // Ajusta texto do status
            }
        } else { console.warn("Elemento #modal-action-link não encontrado."); }

        // Exibe o modal e gerencia acessibilidade
        modal.removeAttribute('hidden');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Trava scroll do fundo

        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-describedby', 'modal-description-container'); // Aponta para container com desc+specs
        modal.setAttribute('aria-modal', 'true');

        // Foca no botão de fechar para acessibilidade
        closeModalButton?.focus(); // O '?' evita erro se o botão não existir
    }

    function closeModal() {
        if (!modal) return; // Sai se o modal não existe

        modal.setAttribute('hidden', 'true');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Libera scroll
        modal.removeAttribute('aria-modal');

        // Retorna o foco para o elemento que abriu o modal
        if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
            previouslyFocusedElement.focus();
        }
        previouslyFocusedElement = null; // Limpa referência
    }

    // --- Configuração dos Event Listeners do Modal (se o modal existir) ---
    if (modal) {
        if (closeModalButton) {
            closeModalButton.addEventListener('click', closeModal);
        } else {
            console.warn("Botão de fechar ('.close-button') não encontrado no modal.");
        }

        // Fecha ao clicar no backdrop (fora do conteúdo)
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { // Verifica se o clique foi no próprio modal (fundo)
                closeModal();
            }
        });

        // Fecha ao pressionar a tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.hasAttribute('hidden')) {
                closeModal();
            }
        });

        // Garante que o modal comece escondido
         modal.setAttribute('hidden', 'true');
    }

    // --- Atualizar Ano no Rodapé ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
         console.warn("Elemento #current-year para o ano no rodapé não encontrado.");
    }

    // --- Menu Mobile Toggle ---
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));

            const icon = menuToggle.querySelector('i');
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

        // Fecha o menu ao clicar em um link
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

         // Fecha o menu ao clicar fora dele
         document.addEventListener('click', (event) => {
             if (navLinks.classList.contains('active') &&
                 !navLinks.contains(event.target) &&
                 !menuToggle.contains(event.target))
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
        if(!menuToggle) console.warn("Elemento .menu-toggle não encontrado.");
        if(!navLinks) console.warn("Elemento .nav-links não encontrado.");
    }


    // --- Inicialização ---
    renderNotebooks(); // Chama a função para criar os cards e adicionar os listeners

}); // Fim do DOMContentLoaded
