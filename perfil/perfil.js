document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os inputs baseado na estrutura do seu formulário
    const inputs = document.querySelectorAll('.input-group input');
    const btnSalvar = document.querySelector('.btn-primary');
    const btnDescartar = document.querySelector('.btn-outline');
    
    // Função para carregar os dados salvos anteriormente
    function carregarDadosPerfil() {
        const dadosSalvos = JSON.parse(localStorage.getItem('dadosUsuario')) || {
            nome: "Anthony",
            sobrenome: "Santos",
            cpf: "*********-16",
            nascimento: "2008-04-05",
            email: "anthonypds08@gmail.com",
            telefone: "(15) 99158-2594"
        };

        // Preenche cada input se encontrar correspondência pelo id ou tipo
        inputs.forEach(input => {
            if (input.id === 'email' || input.type === 'email') input.value = dadosSalvos.email;
            else if (input.type === 'date') input.value = dadosSalvos.nascimento;
            else if (input.placeholder.includes('Atelier') || input.id === 'nome') {
                // Se não houver ID claro, mapeia pela ordem ou placeholders comuns
                if (input.closest('.input-group').innerHTML.includes('Sobrenome')) {
                    input.value = dadosSalvos.sobrenome;
                } else {
                    input.value = dadosSalvos.nome;
                }
            }
            // Mapeia os demais campos baseados nas labels próximas
            const labelText = input.previousElementSibling?.innerText?.toLowerCase() || '';
            if (labelText.includes('cpf')) input.value = dadosSalvos.cpf;
            if (labelText.includes('telefone')) input.value = dadosSalvos.telefone;
        });

        // Carrega gênero salvo se houver
        const generoSalvo = localStorage.getItem('generoUsuario');
        if (generoSalvo) {
            const radio = document.querySelector(`input[name="genero"][value="${generoSalvo}"]`);
            if (radio) radio.checked = true;
        }
    }

    // Função para salvar as alterações no localStorage
    function salvarDadosPerfil() {
        const novosDados = {};
        
        inputs.forEach(input => {
            const labelText = input.previousElementSibling?.innerText?.toLowerCase() || '';
            if (labelText.includes('nome') && !labelText.includes('sobrenome')) novosDados.nome = input.value;
            if (labelText.includes('sobrenome')) novosDados.sobrenome = input.value;
            if (labelText.includes('cpf')) novosDados.cpf = input.value;
            if (labelText.includes('nascimento')) novosDados.nascimento = input.value;
            if (labelText.includes('e-mail') || input.type === 'email') novosDados.email = input.value;
            if (labelText.includes('telefone')) novosDados.telefone = input.value;
        });

        // Captura o gênero selecionado
        const generoSelecionado = document.querySelector('input[name="genero"]:checked');
        if (generoSelecionado) {
            localStorage.setItem('generoUsuario', generoSelecionado.value);
        }

        localStorage.setItem('dadosUsuario', JSON.stringify(novosDados));
        alert('Alterações salvas com sucesso no seu perfil WalkWord!');
    }

    // Eventos dos botões
    if (btnSalvar) {
        btnSalvar.addEventListener('click', (e) => {
            e.preventDefault();
            salvarDadosPerfil();
        });
    }

    if (btnDescartar) {
        btnDescartar.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Deseja descartar as alterações feitas?')) {
                carregarDadosPerfil(); // Recarrega o que estava salvo
            }
        });
    }

    // Inicializa a página trazendo as informações
    carregarDadosPerfil();
});