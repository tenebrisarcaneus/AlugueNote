document.addEventListener('DOMContentLoaded', () => {

    // --- Dados dos Notebooks (Simulação com URLs) ---
    // !! SUBSTITUA ESTAS URLS PELAS SUAS IMAGENS REAIS HOSPEDADAS !!
    const notebooks = [
        {
            id: 1,
            nome: 'Notebook Essencial Pro',
            descricao: 'Ideal para estudos e tarefas do dia a dia. Leve e com boa autonomia de bateria.',
            // Exemplo com Placeholder.com: tamanho, cor de fundo, cor do texto, texto
            imagem: 'https://via.placeholder.com/450x280/0D7377/FFFFFF?text=Notebook+Essencial',
            disponivel: false,
            specs: 'Intel Core i3, 8GB RAM, 256GB SSD, Tela 14" HD',
            precos: { diaria: 'R$ 35,00', semanal: 'R$ 180,00', mensal: 'R$ 450,00' }
        },
        {
            id: 2,
            nome: 'Notebook Performance Max',
            descricao: 'Potência para trabalho pesado, edição e multitarefas. Desempenho superior.',
             // Exemplo com Picsum.photos: use seeds diferentes para imagens diferentes
            imagem: 'https://picsum.photos/seed/nbMaxPerformance/450/280',
            disponivel: true,
            specs: 'Intel Core i5, 20GB RAM, 400GB SSD NVMe, 500GB HD, Tela 15.6" Full HD',
            precos: { diaria: 'R$ 55,00', semanal: 'R$ 290,00', mensal: 'R$ 750,00' }
        },
        {
            id: 3,
            nome: 'Notebook Ultra Fino',
            descricao: 'Design elegante, leveza extrema e performance para quem está sempre em movimento.',
            // Exemplo com Placeholder.com e cor de acento
            imagem: 'https://via.placeholder.com/450x280/F0A500/323232?text=Notebook+Ultra+Fino',
            disponivel: false, // Exemplo de notebook alugado
            specs: 'Intel Core i7, 8GB RAM, 256GB SSD, Tela 13.3" Full HD Touch',
            precos: { diaria: 'R$ 60,00', semanal: 'R$ 320,00', mensal: 'R$ 800,00' }
        },
        {
            id: 4,
            nome: 'Notebook Gamer Starter',
            descricao: 'Para jogos casuais e tarefas que exigem placa de vídeo dedicada. Boa refrigeração.',
             // Exemplo com Picsum.photos
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

    // URL de fallback caso a imagem principal falhe
    // !! Você pode querer hospedar sua própria imagem de fallback !!
    const fallbackImageUrl = 'https://via.placeholder.com/450x280/EAEAEA/999999?text=Imagem+Indispon%C3%ADvel';

    // --- Seletores de Elementos DOM ---
    const notebookGrid = document.getElementById('notebook-grid');
    const modal = document.getElementById('notebook-modal');
    const closeModalButton = modal?.querySelector('.close-button'); // Usar optional chaining (?)
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescriptionContainer = document.getElementById('modal-description-container'); // Container para descrição + specs
    const modalDescription = document.getElementById('modal-description');
    const modalPriceDaily = document.getElementById('modal-price-daily');
    const modalPriceWeekly = document.getElementById('modal-price-weekly');
    const modalPriceMonthly = document.getElementById('modal-price-monthly');
    const modalStatus = document.getElementById('modal-status');
    const modalWhatsAppLink = document.getElementById('modal-whatsapp-link'); // Mantém o ID original do seu código
    const currentYearSpan = document.getElementById('current-year');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    let previouslyFocusedElement = null; // Para retornar foco ao fechar modal

    // --- Função para Renderizar os Cards dos Notebooks ---
    function renderNotebooks() {
        if (!notebookGrid) {
            console.error("Elemento #notebook-grid não encontrado.");
            return;
        }

        notebookGrid.innerHTML = ''; // Limpa o grid

        if (notebooks.length === 0) {
            notebookGrid.innerHTML = '<p>Nenhum notebook disponível no momento. Volte em breve!</p>';
            return;
        }

        notebooks.forEach(notebook => {
            const card = document.createElement('div');
            card.classList.add('notebook-card');

            const image = document.createElement('img');
            image.src = notebook.imagem; // URL da imagem
            image.alt = `Imagem do ${notebook.nome}`;
            image.loading = 'lazy';
            // Fallback para imagem padrão se a imagem específica falhar
            image.onerror = function() {
                console.warn(`Falha ao carregar imagem: ${notebook.imagem}. Usando fallback.`);
                this.src = fallbackImageUrl;
             };

            const content = document.createElement('div');
            content.classList.add('notebook-card-content');

            const title = document.createElement('h3');
            title.textContent = notebook.nome;

            const description = document.createElement('p');
            description.classList.add('description');
            description.textContent = notebook.descricao;

            const status = document.createElement('span');
            status.classList.add('status');
            status.textContent = notebook.disponivel ? 'Disponível' : 'Alugado';
            status.classList.add(notebook.disponivel ? 'disponivel' : 'alugado');

            const detailsButton = document.createElement('button');
            detailsButton.classList.add('btn', 'btn-secondary', 'details-btn');
            detailsButton.textContent = 'Ver Detalhes';
            detailsButton.setAttribute('data-notebook-id', notebook.id);
            detailsButton.setAttribute('aria-haspopup', 'dialog'); // Indica que abre um diálogo

            // Adiciona evento de clique para abrir o modal
            detailsButton.addEventListener('click', (event) => {
                previouslyFocusedElement = event.currentTarget; // Guarda o botão que foi clicado
                openModal(notebook.id);
            });

            // Monta o card
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
        if (!modal) {
            console.error("Elemento #notebook-modal não encontrado.");
            return;
        }

        const notebook = notebooks.find(nb => nb.id === notebookId);
        if (!notebook) {
            console.error(`Notebook com ID ${notebookId} não encontrado.`);
            return;
        }

        // Preenche os dados do modal
        modalImg.src = notebook.imagem; // URL da imagem
        modalImg.alt = notebook.nome;
        modalImg.onerror = function() { // Fallback no modal também
            console.warn(`Falha ao carregar imagem no modal: ${notebook.imagem}. Usando fallback.`);
            this.src = fallbackImageUrl;
        };

        modalTitle.textContent = notebook.nome;

        // Limpa specs antigas antes de adicionar novas (se houver)
        if(modalDescriptionContainer){
            const oldSpecs = modalDescriptionContainer.querySelector('.specs-details');
             if(oldSpecs) oldSpecs.remove();
        }

        // Adiciona descrição e specs
        modalDescription.textContent = notebook.descricao; // Descrição principal
        if(notebook.specs && modalDescriptionContainer){
             const specsElement = document.createElement('p');
             specsElement.classList.add('specs-details');
             // Adiciona um título para as specs
             const specsTitle = document.createElement('strong');
             specsTitle.textContent = 'Especificações: ';
             specsElement.appendChild(specsTitle);
             specsElement.appendChild(document.createTextNode(notebook.specs)); // Adiciona o texto das specs
             modalDescriptionContainer.appendChild(specsElement); // Adiciona após a descrição
        }


        modalPriceDaily.textContent = `Diária: ${notebook.precos.diaria}`;
        modalPriceWeekly.textContent = `Semanal: ${notebook.precos.semanal}`;
        modalPriceMonthly.textContent = `Mensal: ${notebook.precos.mensal}`;

        modalStatus.textContent = `Status: ${notebook.disponivel ? 'Disponível' : 'Alugado'}`;
        modalStatus.className = 'modal-status ' + (notebook.disponivel ? 'disponivel' : 'alugado');

        // ==================================================
        // INÍCIO DA ALTERAÇÃO SOLICITADA
        // ==================================================
        // Atualiza o link para apontar para o formulário, passando o nome do notebook
        const formularioUrl = 'https://tenebrisarcaneus.github.io/formulario/';
        const notebookNomeParam = encodeURIComponent(notebook.nome); // Codifica o nome para a URL
        modalWhatsAppLink.href = `${formularioUrl}?notebook=${notebookNomeParam}`; // Define o href para o formulário
        // ==================================================
        // FIM DA ALTERAÇÃO SOLICITADA
        // ==================================================


        // Gerencia a visibilidade do botão de alugar (mantém a lógica original)
        if (!notebook.disponivel) {
            modalWhatsAppLink.style.display = 'none'; // Esconde o botão
            modalStatus.textContent += ' (Indisponível no momento)';
        } else {
             modalWhatsAppLink.style.display = 'inline-block'; // Garante que o botão apareça
        }

        // --- Acessibilidade e Exibição do Modal ---
        modal.removeAttribute('hidden'); // Remove hidden para mostrar
        modal.classList.add('show'); // Adiciona classe para animação/estilo
        document.body.style.overflow = 'hidden'; // Impede scroll da página principal

        // Define IDs para ARIA (já definidos no HTML, mas podemos confirmar aqui)
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-describedby', 'modal-description-container');

        // Foco no botão de fechar ao abrir (melhora acessibilidade)
        closeModalButton?.focus(); // Usa optional chaining
    }

    function closeModal() {
        if (!modal) return;

        modal.setAttribute('hidden', 'true'); // Adiciona hidden para esconder semanticamente
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restaura scroll

        // Retorna o foco para o elemento que abriu o modal
        if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
            previouslyFocusedElement.focus();
            previouslyFocusedElement = null; // Limpa a referência
        }
    }

    // --- Event Listeners do Modal ---
    if (modal && closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);

        // Fecha o modal se clicar fora do conteúdo (no backdrop)
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    } else {
       if(!modal) console.error("Modal não encontrado para adicionar listeners.");
       if(!closeModalButton) console.error("Botão de fechar modal não encontrado.");
    }

     // Fecha o modal com a tecla Esc
    document.addEventListener('keydown', (event) => {
        // Verifica se a tecla pressionada é Escape e se o modal está visível
        if (event.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
             closeModal();
        }
    });

    // Garante que o modal comece escondido corretamente
    if (modal) {
        modal.setAttribute('hidden', 'true');
    }

    // --- Atualizar Ano no Rodapé ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
         console.warn("Elemento #current-year não encontrado.");
    }

    // --- Menu Mobile Toggle ---
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            navLinks.classList.toggle('active'); // Mostra/esconde o menu
            menuToggle.setAttribute('aria-expanded', !isExpanded); // Atualiza o estado ARIA

            // Altera o ícone do botão
            const icon = menuToggle.querySelector('i');
            if (!isExpanded) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                 menuToggle.setAttribute('aria-label', 'Fechar Menu');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                 menuToggle.setAttribute('aria-label', 'Abrir Menu');
            }
        });

        // Fecha o menu se clicar em um link dentro dele
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                     menuToggle.setAttribute('aria-label', 'Abrir Menu');
                }
            });
        });

         // Fecha o menu se clicar fora dele (melhorado)
         document.addEventListener('click', (event) => {
             // Verifica se o menu está ativo e o clique não foi no menu nem no botão toggle
             if (navLinks.classList.contains('active') && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                 navLinks.classList.remove('active');
                 menuToggle.setAttribute('aria-expanded', 'false');
                 const icon = menuToggle.querySelector('i');
                 icon.classList.remove('fa-times');
                 icon.classList.add('fa-bars');
                 menuToggle.setAttribute('aria-label', 'Abrir Menu');
             }
         });

    } else {
        if(!menuToggle) console.warn("Elemento .menu-toggle não encontrado.");
        if(!navLinks) console.warn("Elemento .nav-links não encontrado.");
    }


    // --- Inicializar a Renderização dos Notebooks ---
    renderNotebooks();

}); // Fim do DOMContentLoaded
