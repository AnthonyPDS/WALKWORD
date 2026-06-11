document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. GERAR NÚMERO DE PEDIDO EXCLUSIVO
       ========================================================================== */
    const orderNumberElement = document.getElementById('order-number');
    if (orderNumberElement) {
        const codigoAleatorio = Math.floor(100000 + Math.random() * 900000);
        orderNumberElement.textContent = `#WW-${codigoAleatorio}`;
    }

    /* ==========================================================================
       2. CALCULAR DATA DE ENTREGA AUTOMÁTICA (+6 dias úteis)
       ========================================================================== */
    const deliveryDateElement = document.getElementById('delivery-date');
    if (deliveryDateElement) {
        const hoje = new Date();
        hoje.setDate(hoje.getDate() + 8); // Soma dias corridos aproximando dias úteis
        const opcoes = { day: 'numeric', month: 'long' };
        deliveryDateElement.textContent = hoje.toLocaleDateString('pt-BR', opcoes);
    }

    /* ==========================================================================
       3. CAPTURAR E INJETAR ENDEREÇO DO LOCALSTORAGE
       ========================================================================== */
    const addressContainer = document.getElementById('dynamic-address-content');
    const enderecoSalvo = localStorage.getItem('enderecoEntrega');

    if (addressContainer) {
        if (enderecoSalvo) {
            const endereco = JSON.parse(enderecoSalvo);
            addressContainer.innerHTML = `
                <p>${endereco.rua}, ${endereco.numero} ${endereco.complemento ? ' - ' + endereco.complemento : ''}</p>
                <p>Bairro ${endereco.bairro}</p>
                <p>CEP: ${endereco.cep}</p>
                <p>${endereco.cidade} - ${endereco.estado}</p>
            `;
        } else {
            addressContainer.innerHTML = `<p>Retirada agendada ou Formato de entrega digital WalkWord.</p>`;
        }
    }

    /* ==========================================================================
       4. CALCULAR DINAMICAMENTE O RESUMO DO CARRINHO LATERAL
       ========================================================================== */
    const subtotalElement = document.getElementById('summary-subtotal');
    const totalElement = document.getElementById('summary-total-price');
    const freteElement = document.getElementById('summary-frete');
    
    const listaCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let subtotalGeral = 0;

    listaCarrinho.forEach((produto) => {
        subtotalGeral += (produto.preco * produto.quantidade);
    });

    // Se o subtotal for 0 (teste direto na página), aplica valor mockado para não quebrar a estética
    if (subtotalGeral === 0) {
        subtotalGeral = 15.00;
    }

    const valorFrete = 0.00; // Frete Grátis conforme layout enviado
    const totalGeral = subtotalGeral + valorFrete;

    if (subtotalElement) subtotalElement.innerText = `$${subtotalGeral.toFixed(2)}`;
    if (freteElement) freteElement.innerText = valorFrete === 0 ? "Grátis" : `$${valorFrete.toFixed(2)}`;
    if (totalElement) totalElement.innerText = `$${totalGeral.toFixed(2)}`;

    /* ==========================================================================
       5. VERIFICAÇÃO DE PIX E INPUT DE CÓPIA
       ========================================================================== */
    const metodo = localStorage.getItem('metodoPagamento');
    const pixArea = document.getElementById('pix-payment-area');

    if (metodo === 'pix' && pixArea) {
        pixArea.style.display = 'block'; // Ativa a janela do PIX na tela
        
        const btnCopiar = document.getElementById('btnCopiarPix');
        const inputPix = document.getElementById('pixCodeInput');
        
        if (btnCopiar && inputPix) {
            btnCopiar.addEventListener('click', () => {
                inputPix.select();
                inputPix.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(inputPix.value);
                
                btnCopiar.innerText = "CÓDIGO COPIADO!";
                btnCopiar.style.backgroundColor = "#546652";
                btnCopiar.style.color = "#ffffff";
                btnCopiar.style.borderColor = "#546652";
                
                setTimeout(() => {
                    btnCopiar.innerText = "COPIAR CÓDIGO PIX";
                    btnCopiar.style.backgroundColor = "transparent";
                    btnCopiar.style.color = "#111111";
                    btnCopiar.style.borderColor = "#111111";
                }, 3000);
            });
        }
    }

    /* ==========================================================================
       6. LIMPEZA SEGURA DO CARRINHO (PÓS-LEITURA)
       ========================================================================== */
    localStorage.removeItem('carrinho');
    localStorage.removeItem('metodoPagamento');
});