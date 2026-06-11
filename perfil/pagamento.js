document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CARREGAR DADOS DO USUÁRIO E ENDEREÇO DA ETAPA ANTERIOR
       ========================================================================== */
    const userEmailElement = document.getElementById('userEmail');
    const addressDetailsElement = document.getElementById('addressDetails');
    
    // Puxa o e-mail do login ou define o padrão
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (userEmailElement) {
        userEmailElement.textContent = usuarioLogado ? usuarioLogado : "visitante@walkword.com";
    }

    // Puxa o endereço salvo na tela de formulário
    const enderecoSalvo = localStorage.getItem('enderecoEntrega');
    if (enderecoSalvo && addressDetailsElement) {
        const endereco = JSON.parse(enderecoSalvo);
        
        addressDetailsElement.innerHTML = `
            ${endereco.rua}, ${endereco.numero} ${endereco.complemento ? ' - ' + endereco.complemento : ''}<br>
            Bairro ${endereco.bairro}<br>
            CEP: ${endereco.cep}<br>
            ${endereco.cidade} - ${endereco.estado}
        `;
    } else if (addressDetailsElement) {
        addressDetailsElement.innerHTML = "Avenida Paulista, 1000<br>Bela Vista - São Paulo - SP";
    }

    /* ==========================================================================
       2. CALCULAR TOTAIS E PREENCHER O RESUMO DA DIREITA
       ========================================================================== */
    const subtotalElement = document.getElementById('payment-subtotal');
    const freteElement = document.getElementById('payment-frete');
    const totalElement = document.getElementById('payment-total');
    
    const listaCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let subtotalGeral = 0;
    
    listaCarrinho.forEach((produto) => {
        subtotalGeral += (produto.preco * produto.quantidade);
    });

    const valorFrete = 15.00; 
    const totalGeral = subtotalGeral + valorFrete;

    if (subtotalElement) subtotalElement.innerText = `$${subtotalGeral.toFixed(2)}`;
    if (freteElement) freteElement.innerText = `$${valorFrete.toFixed(2)}`;
    if (totalElement) totalElement.innerText = `$${totalGeral.toFixed(2)}`;

    // Atualiza os simuladores do select de parcelas
    document.querySelectorAll('.parcela-total').forEach(el => el.innerText = totalGeral.toFixed(2));
    document.querySelectorAll('.parcela-meia').forEach(el => el.innerText = (totalGeral / 2).toFixed(2));

    /* ==========================================================================
       3. LÓGICA DAS ABAS (CARTÃO DE CRÉDITO X PIX)
       ========================================================================== */
    const tabs = document.querySelectorAll('.payment-tab');
    const panels = document.querySelectorAll('.payment-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    /* ==========================================================================
       4. LÓGICA DE FINALIZAR O PEDIDO (REDIRECIONANDO PARA TELA DE SUCESSO)
       ========================================================================== */
    function concluirPedido(metodoEscolhido) {
        window.location.href = 'pagsucesso.html';
        localStorage.setItem('metodoPagamento', metodoEscolhido);
        
        alert('🎉 Processando seu pedido...');
        
        // 2. MUDA PARA A TELA DE SUCESSO
        // Atenção: Verifique se o seu arquivo HTML se chama 'sucesso.html' ou outro nome!
        window.location.href = 'sucesso.html'; 
    }

    // Gatilho para o formulário do Cartão de Crédito
    const formCredito = document.getElementById('form-credito');
    if (formCredito) {
        formCredito.addEventListener('submit', (e) => {
            e.preventDefault(); 
            concluirPedido('cartao'); // Salva como 'cartao'
        });
    }

    // Gatilho para o botão do PIX
    const btnPix = document.getElementById('btn-finalizar-pix');
    if (btnPix) {
        btnPix.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o botão de recarregar a tela sozinho
            concluirPedido('pix'); // Salva como 'pix' e redireciona
        });
    }

});