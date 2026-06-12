document.addEventListener('DOMContentLoaded', () => {
    carregarPedidos();
});

function carregarPedidos() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    // Busca o histórico salvo (Aquele que o sucesso.js criou)
    const historicoPedidos = JSON.parse(localStorage.getItem('meusPedidos')) || [];

    if (historicoPedidos.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem 0;">
                <p class="section-description">Você ainda não realizou nenhuma compra.</p>
                <button class="btn-primary" onclick="window.location.href='index.html'" style="margin-top: 1rem;">Explorar Produtos</button>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    // Renderiza cada pedido do histórico
    historicoPedidos.forEach(pedido => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';

        // Cria a lista de produtos (imagens e nomes) deste pedido específico
        let itensHTML = '';
        pedido.itens.forEach(item => {
            itensHTML += `
                <div class="ordered-item">
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="item-details">
                        <h4>${item.nome}</h4>
                        <p>Qtd: ${item.quantidade} | Valor: $${item.preco.toFixed(2)}</p>
                    </div>
                </div>
            `;
        });

        // Monta a estrutura final do Card do Pedido
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <h3>Pedido ${pedido.numeroPedido}</h3>
                    <p>Realizado em ${pedido.dataCompra} | Previsão: ${pedido.previsaoEntrega}</p>
                </div>
                <div class="order-status">
                    <span class="material-symbols-outlined" style="font-size: 16px;">local_shipping</span>
                    ${pedido.status}
                </div>
            </div>
            
            <div class="order-items">
                ${itensHTML}
            </div>

            <div class="order-footer">
                Total Pago: $${pedido.total.toFixed(2)}
            </div>
        `;

        container.appendChild(orderCard);
    });
}