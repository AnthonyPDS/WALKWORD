document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Gerar um número de pedido aleatório simulado
    const generateOrderNumber = () => {
        const prefix = "WW";
        const randomNum = Math.floor(Math.random() * 90000000) + 10000000;
        return `${prefix}-${randomNum}`;
    };

    const orderElement = document.getElementById("order-number");
    if (orderElement) {
        orderElement.textContent = generateOrderNumber();
    }

    // 2. Calcular previsão de entrega (6 dias úteis)
    const calculateDeliveryDate = (businessDaysToAdd) => {
        let date = new Date();
        let addedDays = 0;

        while (addedDays < businessDaysToAdd) {
            date.setDate(date.getDate() + 1);
            // Pular finais de semana (0 = Domingo, 6 = Sábado)
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                addedDays++;
            }
        }

        // Formatar a data para o padrão Brasileiro (ex: 15 de Outubro)
        const options = { day: 'numeric', month: 'long' };
        return date.toLocaleDateString('pt-BR', options);
    };

    const deliveryElement = document.getElementById("delivery-date");
    if (deliveryElement) {
        // "A partir de 6 dias úteis" conforme o layout original
        deliveryElement.textContent = calculateDeliveryDate(6);
    }
});