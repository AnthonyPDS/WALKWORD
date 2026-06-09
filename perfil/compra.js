document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. CARREGAR DADOS DO USUÁRIO LOGADO
       ========================================================================== */
    const userEmailElement = document.getElementById('userEmail');
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    if (usuarioLogado) {
        userEmailElement.textContent = usuarioLogado;
    } else {
        userEmailElement.textContent = "Visitante";
        // Opcional: Redirecionar para login se não estiver logado
        // window.location.href = 'index.html';
    }

    /* ==========================================================================
       2. LIGAR COM O CARRINHO E CALCULAR RESUMO
       ========================================================================== */
    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');
    
    // Puxa a mesma lista do JS do carrinho que você enviou
    const listaCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (listaCarrinho.length === 0) {
        alert("Seu carrinho está vazio! Voltando para a loja.");
        window.location.href = 'carrinho.html';
        return;
    }

    let subtotalGeral = 0;
    
    // Refaz o cálculo baseado na quantidade e preço
    listaCarrinho.forEach((produto) => {
        subtotalGeral += (produto.preco * produto.quantidade);
    });

    // Atualiza os valores na tela de checkout
    if (subtotalElement) subtotalElement.innerText = `$${subtotalGeral.toFixed(2)}`;
    if (totalElement) totalElement.innerText = `$${subtotalGeral.toFixed(2)}`;


    /* ==========================================================================
       3. VALIDAÇÃO DO FORMULÁRIO E TRANSIÇÃO DE TELA
       ========================================================================== */
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o reload
            
            const cep = document.getElementById('cep').value;
            const endereco = document.getElementById('endereco').value;
            
            if (!cep || !endereco) {
                alert("Por favor, preencha as informações obrigatórias de endereço.");
                return;
            }

            // Simula o salvamento do endereço no LocalStorage
            const enderecoEntrega = {
                cep: cep,
                rua: endereco,
                numero: document.getElementById('numero').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value
            };
            
            localStorage.setItem('enderecoEntrega', JSON.stringify(enderecoEntrega));
            
            alert("Endereço cadastrado! Redirecionando para a etapa de pagamento.");
            
            // Simulação de redirecionamento para a próxima tela
            // window.location.href = 'pagamento.html';
        });
    }
});