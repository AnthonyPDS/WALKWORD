document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CARREGAR DADOS DO USUÁRIO E ENDEREÇO DA ETAPA ANTERIOR
       ========================================================================== */
    const userEmailElement = document.getElementById('userEmail');
    const addressDetailsElement = document.getElementById('addressDetails');
    
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (userEmailElement) {
        userEmailElement.textContent = usuarioLogado ? usuarioLogado : "visitante@walkword.com";
    }

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
       4. MÁSCARAS E RESTRIÇÕES EM TEMPO REAL (MÁGICA DOS INPUTS)
       ========================================================================== */
    const inputCartao = document.getElementById('numero-cartao');
    const inputValidade = document.getElementById('validade-cartao');
    const inputCvv = document.getElementById('cvv-cartao');

    // Máscara do Número do Cartão (0000 0000 0000 0000)
    if (inputCartao) {
        inputCartao.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = valor;
        });
    }

    // Máscara da Validade (MM/AA)
    if (inputValidade) {
        inputValidade.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, ''); // Remove letras
            
            // Se digitou mais de 2 números, coloca a barra de separação
            if (valor.length > 2) {
                valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
            }
            e.target.value = valor;
        });
    }

    // Máscara do CVV (Apenas 3 números)
    if (inputCvv) {
        inputCvv.addEventListener('input', (e) => {
            // Remove tudo que não for número e limita a 3 caracteres
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }

    /* ==========================================================================
       5. LÓGICA DE FINALIZAR O PEDIDO (VALIDAÇÕES DOS CAMPOS)
       ========================================================================== */
    function concluirPedido(metodoEscolhido) {
        localStorage.setItem('metodoPagamento', metodoEscolhido);
        window.location.href = 'sucesso.html'; 
    }

    // Gatilho para o formulário do Cartão de Crédito
    const formCredito = document.getElementById('form-credito');
    if (formCredito) {
        formCredito.addEventListener('submit', (e) => {
            e.preventDefault(); 

            // 1. Validação do Número do Cartão (16 dígitos)
            if (inputCartao) {
                const apenasNumeros = inputCartao.value.replace(/\s/g, '');
                if (apenasNumeros.length < 16) {
                    alert('Por favor, digite um número de cartão válido (16 dígitos).');
                    inputCartao.focus();
                    return; 
                }
            }

            // 2. Validação da Validade (Precisa ter o formato MM/AA completo - 4 números)
            if (inputValidade) {
                const apenasNumerosValidade = inputValidade.value.replace(/\D/g, '');
                if (apenasNumerosValidade.length < 4) {
                    alert('Por favor, digite a validade completa (MM/AA).');
                    inputValidade.focus();
                    return;
                }
                
                // Validação extra: impede meses maiores que 12
                const mes = parseInt(apenasNumerosValidade.substring(0, 2), 10);
                if (mes < 1 || mes > 12) {
                    alert('Mês inválido! Digite um mês entre 01 e 12.');
                    inputValidade.focus();
                    return;
                }
            }

            // 3. Validação do CVV (Precisa ter exatamente 3 dígitos)
            if (inputCvv) {
                if (inputCvv.value.length < 3) {
                    alert('Por favor, digite um CVV válido (3 dígitos).');
                    inputCvv.focus();
                    return;
                }
            }

            // Se passou por todas as três travas de segurança:
            concluirPedido('cartao'); 
        });
    }

    // Gatilho para o botão do PIX
    const btnPix = document.getElementById('btn-finalizar-pix');
    if (btnPix) {
        btnPix.addEventListener('click', (e) => {
            e.preventDefault(); 
            concluirPedido('pix'); 
        });
    }
});