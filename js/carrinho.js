/* ==========================================================================
   1. FUNÇÃO PRINCIPAL: RENDERIZAR ITENS DO CARRINHO E CALCULAR TOTAIS
   ========================================================================== */
function carregarCarrinho() {
    const container = document.getElementById('cart-container');
    if (!container) return; 

    // Captura os dados atuais salvos no localStorage
    const listaCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Elementos do resumo de preços
    const subtotalElement = document.getElementById('summary-subtotal');
    const totalElement = document.getElementById('summary-total');

    // Se o carrinho estiver totalmente vazio
    if (listaCarrinho.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem 0; grid-column: 1 / -1;">
                <p class="item-meta">Sua sacola de compras está vazia.</p>
            </div>
        `;
        if (subtotalElement) subtotalElement.innerText = "$0.00";
        if (totalElement) totalElement.innerText = "$0.00";
        return;
    }

    // Limpa o container para recriar a lista atualizada
    container.innerHTML = '';
    let subtotalGeral = 0;

    // Loop para desenhar cada produto do carrinho
    listaCarrinho.forEach((produto, index) => {
        const precoTotalItem = produto.preco * produto.quantidade;
        subtotalGeral += precoTotalItem;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';

        itemDiv.innerHTML = `
            <div class="item-image">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="item-details">
                <span class="item-badge">Curadoria</span>
                <h3>${produto.nome}</h3>
                <p class="item-meta">Especificação: <span>Padrão</span></p>
                <button class="btn-remove" data-index="${index}">
                    <span class="material-symbols-outlined" style="font-size: 16px;">delete</span> Remover
                </button>
            </div>
            <div class="item-quantity">
                <button class="qty-btn btn-menos" data-index="${index}">
                    <span class="material-symbols-outlined" style="font-size: 16px;">remove</span>
                </button>
                <span class="qty-value">${produto.quantidade}</span>
                <button class="qty-btn btn-mais" data-index="${index}">
                    <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
                </button>
            </div>
            <div class="item-price">
                <span>$${precoTotalItem.toFixed(2)}</span>
            </div>
        `;

        container.appendChild(itemDiv);
    });

    // Atualiza os valores do painel de resumo lateral
    if (subtotalElement) subtotalElement.innerText = `$${subtotalGeral.toFixed(2)}`;
    if (totalElement) totalElement.innerText = `$${subtotalGeral.toFixed(2)}`;

    // Ativa os ouvintes de clique nos novos botões gerados
    configurarEventosCarrinho();
}

/* ==========================================================================
   2. GERENCIAMENTO DE CLIQUES (+, -, REMOVER)
   ========================================================================== */
function configurarEventosCarrinho() {
    let listaCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Botões de Aumentar Quantidade (+)
    const botoesMais = document.querySelectorAll('.btn-mais');
    botoesMais.forEach(botao => {
        botao.addEventListener('click', () => {
            const index = botao.getAttribute('data-index');
            listaCarrinho[index].quantidade += 1;
            
            localStorage.setItem('carrinho', JSON.stringify(listaCarrinho));
            carregarCarrinho();
        });
    });

    // Botões de Diminuir Quantidade (-)
    const botoesMenos = document.querySelectorAll('.btn-menos');
    botoesMenos.forEach(botao => {
        botao.addEventListener('click', () => {
            const index = botao.getAttribute('data-index');
            
            listaCarrinho[index].quantidade -= 1;

            // Se chegar a 0, deleta o item da lista
            if (listaCarrinho[index].quantidade <= 0) {
                listaCarrinho.splice(index, 1);
            }

            localStorage.setItem('carrinho', JSON.stringify(listaCarrinho));
            carregarCarrinho();
        });
    });

    // Botões de Remover Direto (Lixeira)
    const botoesRemover = document.querySelectorAll('.btn-remove');
    botoesRemover.forEach(botao => {
        botao.addEventListener('click', () => {
            const index = botao.getAttribute('data-index');
            
            listaCarrinho.splice(index, 1);

            localStorage.setItem('carrinho', JSON.stringify(listaCarrinho));
            carregarCarrinho();
        });
    });
}

/* ==========================================================================
   3. INICIALIZAÇÃO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
});
Carrinho