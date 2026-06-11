document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INTEGRAÇÃO COM O LOGIN: Verifica se o usuário simulado está no localStorage
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert('Acesso negado. Por favor, faça login primeiro.');
        window.location.href = 'index.html'; // Redireciona para sua página de login
        return;
    }

    const passwordForm = document.querySelector('.password-form');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede a página de recarregar
            
            const currentPassword = document.getElementById('current-password');
            const newPassword = document.getElementById('new-password');
            const confirmPassword = document.getElementById('confirm-password');
            
            // Validação básica igual à do seu login
            if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
                alert('Por favor, preencha todos os campos para alterar sua senha.');
                return;
            }
            
            // Regra simples de tamanho mínimo
            if (newPassword.value.length < 6) {
                alert('A nova senha deve ter pelo menos 6 caracteres.');
                return;
            }
            
            // Verifica se a nova senha e a confirmação são iguais
            if (newPassword.value !== confirmPassword.value) {
                alert('A nova senha e a confirmação não coincidem.');
                return;
            }
            
            // Sucesso!
            alert('Senha alterada com sucesso!');
            
            // Limpa o formulário após salvar
            passwordForm.reset();
        });
    }
});