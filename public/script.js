const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));

// Executa automaticamente quando a página index.html abre
if (usuario) {
    document.getElementById('boasVindas').innerText = `Olá, ${usuario.nome}! Calcule sua pegada de carbono mensal:`;
    carregarHistorico(); // Busca os dados do banco na inicialização
}

// Função responsável por buscar o histórico no MySQL e montar a tabela
async function carregarHistorico() {
    if (!usuario) return;

    try {
        const response = await fetch(`http://localhost:3000/api/historico/${usuario.id}`);
        const dados = await response.json();
        
        const corpoHistorico = document.getElementById('corpoHistorico');
        const historicoVazio = document.getElementById('historicoVazio');
        
        corpoHistorico.innerHTML = ""; // Limpa a tabela antes de renderizar

        if (dados.length === 0) {
            historicoVazio.style.display = "block";
            return;
        }

        historicoVazio.style.display = "none";

        // Mapeia e cria as linhas da tabela dinamicamente
        dados.forEach(item => {
            let emoji = item.nivel.includes("baixa") ? "🟢" : item.nivel.includes("moderada") ? "🟡" : "🔴";
            
            const linha = document.createElement('tr');
            linha.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
            linha.innerHTML = `
                <td style="padding: 12px 5px; opacity: 0.8;">${item.data}</td>
                <td style="padding: 12px 5px;">${item.km_rodados}</td>
                <td style="padding: 12px 5px;">${item.energia_kwh}</td>
                <td style="padding: 12px 5px; font-weight: 600;">${emoji} ${item.total_co2} kg</td>
            `;
            corpoHistorico.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao carregar o histórico:', error);
    }
}

async function calcular(){
    const km = parseFloat(document.getElementById("km").value) || 0;
    const energia = parseFloat(document.getElementById("energia").value) || 0;

    if (km <= 0 && energia <= 0){
        alert("Preencha pelo menos um campo.");
        return;
    }

    const total = ((km * 0.20) + (energia * 0.09)).toFixed(2);

    document.getElementById("valor").innerText = total;
    document.getElementById("resultado").classList.remove("hidden");

    const nivel = document.getElementById("nivel");
    const dica = document.getElementById("dica");
    let nivelTexto = "";

    if (total < 80){
        nivelTexto = "Pegada baixa";
        nivel.innerHTML = `🟢 ${nivelTexto}`;
        dica.innerHTML = "Muito bem! Seu impacto ambiental está baixo.";
    } else if (total < 150){
        nivelTexto = "Pegada moderada";
        nivel.innerHTML = `🟡 ${nivelTexto}`;
        dica.innerHTML = "Você está na média. Pequenas mudanças podem ajudar.";
    } else {
        nivelTexto = "Pegada alta";
        nivel.innerHTML = `🔴 ${nivelTexto}`;
        dica.innerHTML = "Tente reduzir deslocamentos e economizar energia.";
    }

    // ENVIO PARA O HISTÓRICO DO BANCO DE DADOS
    if (usuario) {
        try {
            const response = await fetch('http://localhost:3000/api/historico', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: usuario.id,
                    km_rodados: km,
                    energia_kwh: energia,
                    total_co2: total,
                    nivel: nivelTexto
                })
            });

            if (response.ok) {
                // Atualiza a tabela na tela imediatamente sem precisar atualizar a página!
                carregarHistorico(); 
            }
        } catch (error) {
            console.error('Erro ao salvar histórico de forma persistente:', error);
        }
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}