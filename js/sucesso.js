document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. GERAR NÚMERO DO PEDIDO E PREVISÃO DE DATA
       ========================================================================== */
    const orderNumberElement = document.getElementById('order-number');
    const deliveryDateElement = document.getElementById('delivery-date');

    // Gera um número de pedido randômico legal (Ex: WW-482910)
    const numeroAleatorio = Math.floor(100000 + Math.random() * 900000);
    if (orderNumberElement) {
        orderNumberElement.innerText = `WW-${numeroAleatorio}`;
    }

    // Calcula uma data simulada de 6 dias úteis para frente
    const dataEntrega = new Date();
    dataEntrega.setDate(dataEntrega.getDate() + 8); // Conta dias corridos simulando úteis
    const opcoesData = { day: '2-digit', month: '2-digit', year: 'numeric' };
    
    if (deliveryDateElement) {
        deliveryDateElement.innerText = dataEntrega.toLocaleDateString('pt-BR', opcoesData);
    }

    /* ==========================================================================
       2. RECONSTRUIR ENDEREÇO SALVO NA MEMÓRIA
       ========================================================================== */
    const addressContainer = document.getElementById('success-address-details');
    const enderecoSalvo = localStorage.getItem('enderecoEntrega');

    if (enderecoSalvo && addressContainer) {
        const endereco = JSON.parse(enderecoSalvo);
        addressContainer.innerHTML = `
            <p>${endereco.rua}, ${endereco.numero} ${endereco.complemento ? ' - ' + endereco.complemento : ''}</p>
            <p>Bairro ${endereco.bairro}</p>
            <p>CEP: ${endereco.cep}</p>
            <p>${endereco.cidade} - ${endereco.estado}</p>
        `;
    } else if (addressContainer) {
        addressContainer.innerHTML = `
            <p>Avenida Paulista, 1000</p>
            <p>Bela Vista</p>
            <p>CEP: 01310-100</p>
            <p>São Paulo - SP</p>
        `;
    }

    /* ==========================================================================
       3. RECALCULAR TOTAIS REAIS DO RESUMO DA COMPRA
       ========================================================================== */
    const subtotalElement = document.getElementById('summary-subtotal');
    const freteElement = document.getElementById('summary-frete');
    const totalElement = document.getElementById('summary-total');

    const listaCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let subtotalGeral = 0;

    listaCarrinho.forEach((produto) => {
        subtotalGeral += (produto.preco * produto.quantidade);
    });

    const valorFrete = 15.00; // Mantém o frete padrão definido na tela anterior
    const totalGeral = subtotalGeral + valorFrete;

    if (subtotalElement) subtotalElement.innerText = `$${subtotalGeral.toFixed(2)}`;
    if (freteElement) freteElement.innerText = `$${valorFrete.toFixed(2)}`;
    if (totalElement) totalElement.innerText = `$${totalGeral.toFixed(2)}`;


/* ==========================================================================
       4. VERIFICAR SE O MÉTODO FOI PIX PARA MOSTRAR O COPIA E COLA + QR CODE
       ========================================================================== */
    const metodoPagamento = localStorage.getItem('metodoPagamento');
    
    if (metodoPagamento === 'pix') {
        // Altera textos do topo para aguardando pagamento
        document.getElementById('payment-step-text').innerText = '✓ AGUARDANDO PIX';
        document.getElementById('success-title').innerText = 'Pedido recebido! Aguardando PIX';
        document.getElementById('success-message').innerText = 'Seu pedido foi registrado. Pague o PIX abaixo para liberar o envio.';
        
        // Exibe a caixinha do PIX
        const pixBox = document.getElementById('pix-payment-container');
        if (pixBox) pixBox.style.display = 'block';

        // Pega o texto do "copia e cola" e gera o link da imagem do QR Code automaticamente
        const pixValue = document.getElementById('pix-copia-cola').value;
        const qrCodeImg = document.getElementById('pix-qr-code');
        if (qrCodeImg) {
            qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pixValue)}`;
        }

        // Lógica do botão copiar código
        const btnCopiar = document.getElementById('btn-copiar-pix');
        if (btnCopiar) {
            btnCopiar.addEventListener('click', () => {
                const inputCodigo = document.getElementById('pix-copia-cola');
                inputCodigo.select();
                inputCodigo.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(inputCodigo.value);
                
                btnCopiar.innerText = 'COPIADO!';
                btnCopiar.style.backgroundColor = '#435241';
                setTimeout(() => {
                    btnCopiar.innerText = 'COPIAR';
                    btnCopiar.style.backgroundColor = 'var(--brand-green)';
                }, 2000);
            });
        }

        // --- NOVO: LÓGICA DA SIMULAÇÃO DE PAGAMENTO ---
        const btnSimular = document.getElementById('btn-simular-pgto');
        if (btnSimular) {
            btnSimular.addEventListener('click', () => {
                // 1. Esconde a caixinha do PIX com efeito suave (ou direto)
                pixBox.style.display = 'none';
                
                // 2. Altera os textos para o estado de "Sucesso / Aprovado"
                document.getElementById('payment-step-text').innerText = '✓ PAGAMENTO APROVADO';
                document.getElementById('success-title').innerText = 'Compra realizada com sucesso!';
                document.getElementById('success-message').innerText = 'Obrigado por escolher a WalkWord. Seu pedido foi confirmado e já estamos preparando tudo para você.';
                
                // 3. Limpa o método do localStorage pois a simulação terminou com sucesso
                localStorage.removeItem('metodoPagamento');
            });
        }
    }
});

/* Evita que o carrinho fique preso na memória após a compra terminar */
function limparEVoltar() {
    localStorage.removeItem('carrinho');
    localStorage.removeItem('metodoPagamento');
    window.location.href = 'loguin.html'; // Redireciona para sua página inicial/login
}