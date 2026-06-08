document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede a página de recarregar
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            // Validação básica simples
            if (!emailInput.value || !passwordInput.value) {
                alert('Por favor, preencha todos os campos para acessar seu arquivo.');
                return;
            }
            
            // Simula o login salvando o e-mail do usuário logado
            localStorage.setItem('usuarioLogado', emailInput.value);
            
            // Redireciona para a página de perfil (Meu Cadastro)
            window.location.href = 'perfil.html';
        });
    }
});