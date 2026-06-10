document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. GERAR NÚMERO DE PEDIDO EXCLUSIVO
       ========================================================================== */
    const orderNumberElement = document.getElementById('order-number');
    if (orderNumberElement) {
        // Gera um número aleatório elegante para o pedido
        const codigoAleatorio = Math.floor(10000 + Math.random() * 900000);
        orderNumberElement.textContent = `#WW-${codigoAleatorio}`;
    }

    /* ==========================================================================
       2. EXIBIR E-MAIL DO USUÁRIO LOGADO OU VISITANTE
       ========================================================================== */
    const customerEmailElement = document.getElementById('customer-email');
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    
    if (customerEmailElement) {
        customerEmailElement.textContent = usuarioLogado ? usuarioLogado : "visitante@walkword.com";
    }

    /* ==========================================================================
       3. RESGATAR E MOSTRAR O ENDEREÇO SALVO NO LOCALSTORAGE
       ========================================================================== */
    const deliveryAddressElement = document.getElementById('delivery-address');
    const enderecoSalvo = localStorage.getItem('enderecoEntrega');

    if (deliveryAddressElement) {
        if (enderecoSalvo) {
            const endereco = JSON.parse(enderecoSalvo);
            
            // Renderiza estruturado na tela
            deliveryAddressElement.innerHTML = `
                ${endereco.rua}, ${endereco.numero} ${endereco.complemento ? ' - ' + endereco.complemento : ''}<br>
                Bairro ${endereco.bairro} — CEP: ${endereco.cep}<br>
                ${endereco.cidade} - ${endereco.estado}
            `;
        } else {
            deliveryAddressElement.textContent = "Informações de entrega gerenciadas via retirada física ou formato digital.";
        }
    }

    /* ==========================================================================
       4. HIGIENE DO CARRINHO (LIMPEZA PÓS-COMPRA)
       ========================================================================== */
    // Remove os produtos adquiridos para zerar o carrinho do usuário
    localStorage.removeItem('carrinho');

    /* ==========================================================================
       5. VERIFICAÇÃO DE MÉTODO DE PAGAMENTO (PIX DETECT)
       ========================================================================== */
    const metodo = localStorage.getItem('metodoPagamento');
    const pixArea = document.getElementById('pix-payment-area');

    if (metodo === 'pix' && pixArea) {
        // Mostra a área do PIX montada no HTML
        pixArea.style.display = 'block';
        
        // Configura o botão de copiar o código PIX
        const btnCopiar = document.getElementById('btnCopiarPix');
        const inputPix = document.getElementById('pixCodeInput');
        
        if (btnCopiar && inputPix) {
            btnCopiar.addEventListener('click', () => {
                inputPix.select();
                inputPix.setSelectionRange(0, 99999); // Suporte para mobile
                
                navigator.clipboard.writeText(inputPix.value);
                
                // Feedback visual de sucesso no botão
                btnCopiar.innerText = "CÓDIGO COPIADO!";
                btnCopiar.style.backgroundColor = "#1e4620";
                btnCopiar.style.color = "#ffffff";
                btnCopiar.style.borderColor = "#1e4620";
                
                // Reseta o botão após 3 segundos
                setTimeout(() => {
                    btnCopiar.innerText = "COPIAR CÓDIGO PIX";
                    btnCopiar.style.backgroundColor = "transparent";
                    btnCopiar.style.color = "#111111";
                    btnCopiar.style.borderColor = "#111111";
                }, 3000);
            });
        }
    }

    // Limpa o método de pagamento para não interferir em compras futuras
    localStorage.removeItem('metodoPagamento');
});