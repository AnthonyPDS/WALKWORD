const buttons = document.querySelectorAll(".size-buttons button");

buttons.forEach((button) => {

    button.addEventListener("click", () => {

        if (button.disabled) {
            return;
        }

        buttons.forEach((btn) => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

    });

});
const produtos = [

    // COLEÇÃO INVERNO
    {
        nome: "Cardigan de Lã Cinza",
        preco: "R$ 179,90",
        descricao: "Cardigan em lã com acabamento sofisticado e toque macio para os dias frios.",
        imagens: ["imagens/cardiganfrente.png", "imagens/cardiganatras.PNG", "imagens/cardigantecido.png"]
    },

    {
        nome: "Jaqueta Puffer Marrom",
        preco: "R$ 299,90",
        descricao: "Jaqueta puffer marrom com excelente isolamento térmico e visual moderno.",
        imagens: ["imagens/pufferfrente.png", "imagens/pufferatras.png", "imagens/puffertecido.png"]
    },

    {
        nome: "Calça Marrom",
        preco: "R$ 149,90",
        descricao: "Calça marrom versátil para composições elegantes e casuais.",
        imagens: ["imagens/calcamarromfrente.png", "imagens/calcamarromatras.png", "imagens/calcamarromtecido.png"]
    },

    {
        nome: "Suéter de Lã Bege",
        preco: "R$ 159,90",
        descricao: "Suéter em lã bege com caimento confortável e estilo clássico.",
        imagens: ["imagens/sueterfrente.png", "imagens/sueteratras.png", "imagens/suetertecido.png"]
    },

    {
        nome: "Sobretudo Bege",
        preco: "R$ 349,90",
        descricao: "Sobretudo bege elegante para os dias mais frios.",
        imagens: ["imagens/sobretudofrente.png", "imagens/sobretudoatras.png", "imagens/sobretudotecido.png"]
    },

    // COLEÇÃO OUTONO
    {
        nome: "Suéter Xadrez Preto e Branco",
        preco: "R$ 169,90",
        descricao: "Suéter xadrez com design moderno e acabamento premium.",
        imagens: ["imagens/sueterxadrezfrente.webp", "imagens/sueterxadrezcosta.png", "imagens/sueterxadreztecido.png"]
    },

    {
        nome: "Trench Coat Bege",
        preco: "R$ 379,90",
        descricao: "Trench coat bege inspirado na moda atemporal.",
        imagens: ["imagens/trenchfrente.png", "imagens/trenchcostas.png", "imagens/trenchtextura.png"]
    },

    {
        nome: "Jaqueta Marrom em Couro Sintético",
        preco: "R$ 319,90",
        descricao: "Jaqueta em couro sintético com visual sofisticado.",
        imagens: ["imagens/jaquetafrente.png", "imagens/jaquetacostas.png", "imagens/jaquetatextura.png"]
    },

    {
        nome: "Bota Preta de Couro",
        preco: "R$ 259,90",
        descricao: "Bota preta elegante com acabamento refinado.",
        imagens: ["imagens/botinalonge.avif", "imagens/botinaperto.png", "imagens/botinatextura.png"]
    },

    // NOVOS
    {
        nome: "Bracelete Dourado",
        preco: "R$ 59,90",
        descricao: "Bracelete dourado delicado para complementar qualquer visual.",
        imagens: ["imagens/braceletelonge.png", "imagens/braceleteperto.png", "imagens/braceletetextura.png"]
    },

    {
        nome: "Calça Social Azul-Marinho",
        preco: "R$ 169,90",
        descricao: "Calça social azul-marinho com modelagem elegante.",
        imagens: ["imagens/calcalonge.png", "imagens/calcaperto.png", "imagens/calcatecido.png"]
    },

    {
        nome: "Camisa Branca",
        preco: "R$ 129,90",
        descricao: "Camisa branca clássica indispensável para o guarda-roupa.",
        imagens: ["imagens/camisalonge.png", "imagens/camisaperto.png", "imagens/camisatecido.png"]
    },

    {
        nome: "Cardigan Verde de Tricô",
        preco: "R$ 189,90",
        descricao: "Cardigan verde em tricô com estilo aconchegante e moderno.",
        imagens: ["imagens/verdelonge.png", "imagens/verdeperto.png", "imagens/verdetecido.png"]
    },

    {
    nome: "Bota Marrom de Couro",
    preco: "R$ 249,90",
    descricao: "Bota marrom de couro com acabamento sofisticado e estilo atemporal.",
    imagens: ["imagens/botalonge.png", "imagens/botaperto.png", "imagens/botatextura.png"]
}

];


// Captura os parâmetros da URL
const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

// Verifica se o ID foi passado na URL e se o produto existe no array/objeto 'produtos'
if (id !== null && produtos[id]) {

    // 1. Desestruturação: Extraímos as variáveis de dentro do produto para não ter que digitar "produto." toda hora
    const { nome, preco, descricao, imagens } = produtos[id];

    // 2. Populando os textos
    document.getElementById("nomeProduto").textContent = nome;
    document.getElementById("precoProduto").textContent = preco;
    document.getElementById("descricaoProduto").textContent = descricao;
    document.getElementById("breadcrumbProduto").textContent = nome;
    document.title = `WalkWord - ${nome}`;

    // 3. Imagem principal com Acessibilidade (Alt)
    const imgPrincipal = document.getElementById("imagemPrincipal");
    if (imgPrincipal && imagens.length > 0) {
        imgPrincipal.src = imagens[0];
        imgPrincipal.alt = nome; // Importante para SEO e leitores de tela
    }

    // 4. Verificação de Thumbnails (Evita erros caso o produto não tenha 3 imagens cadastradas)
    const thumb1 = document.getElementById("thumb1");
    if (thumb1 && imagens.length > 1) {
        thumb1.src = imagens[1];
        thumb1.alt = `Miniatura 1 - ${nome}`;
    }

    const thumb2 = document.getElementById("thumb2");
    if (thumb2 && imagens.length > 2) {
        thumb2.src = imagens[2];
        thumb2.alt = `Miniatura 2 - ${nome}`;
    }

} else {
    // 5. Tratamento de Erros (Fallback)
    // Se o ID não existir, avisa o usuário e manda ele de volta para o catálogo
    alert("Produto não encontrado ou indisponível.");
    window.location.href = "novidades.html"; 
}