// URL base da API - usada em todas as chamadas fetch
const API_URL = "http://127.0.0.1:5000";

// Controla o deslocamento do conteúdo quando o menu lateral abre/fecha
const sidebarTrigger = document.querySelector(".sidebar-trigger");
const sidebarMenu = document.querySelector(".sidebar");

function abrirMenu() {
    document.body.classList.add("menu-aberto");
}

function fecharMenu() {
    document.body.classList.remove("menu-aberto");
}

sidebarTrigger.addEventListener("mouseenter", abrirMenu);
sidebarMenu.addEventListener("mouseenter", abrirMenu);
sidebarMenu.addEventListener("mouseleave", fecharMenu);

const menuItens = document.querySelectorAll(".menu-item");
const secoes = document.querySelectorAll(".secao");

menuItens.forEach(item => {
    item.addEventListener("click", () => {
        menuItens.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        secoes.forEach(secao => secao.classList.add("oculta"));
        const secaoId = "secao-" + item.dataset.secao;
        document.getElementById(secaoId).classList.remove("oculta");
    });
});

function abrirModal(idModal) {
    document.getElementById(idModal).classList.remove("oculta");
}

function fecharModal(idModal) {
    document.getElementById(idModal).classList.add("oculta");
}

document.getElementById("btn-abrir-modal-barbeiro").addEventListener("click", () => abrirModal("modal-barbeiro"));
document.getElementById("btn-abrir-modal-tipo-corte").addEventListener("click", () => abrirModal("modal-tipo-corte"));
document.getElementById("btn-abrir-modal-corte").addEventListener("click", () => abrirModal("modal-corte"));
document.getElementById("btn-abrir-modal-agendamento").addEventListener("click", () => abrirModal("modal-agendamento"));

document.querySelectorAll(".btn-cancelar-modal").forEach(botao => {
    botao.addEventListener("click", () => {
        fecharModal(botao.dataset.modal);
    });
});

// =================== BARBEIROS ===================

const formBarbeiro = document.getElementById("form-barbeiro");
const tabelaBarbeiros = document.getElementById("tabela-barbeiros");

async function carregarBarbeiros() {
    try {
        const resposta = await fetch(`${API_URL}/barbeiros`);
        const barbeiros = await resposta.json();
        tabelaBarbeiros.innerHTML = "";
        if (barbeiros.length === 0) {
            tabelaBarbeiros.innerHTML = `<tr><td colspan="3" class="mensagem-vazia-tabela">Nenhum barbeiro cadastrado</td></tr>`;
            return;
        }
        barbeiros.forEach(barbeiro => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${barbeiro.nome}</td>
                <td>${barbeiro.telefone || "-"}</td>
                <td><button class="btn-remover" data-id="${barbeiro.id}">Remover</button></td>
            `;
            tabelaBarbeiros.appendChild(linha);
        });
        document.querySelectorAll("#tabela-barbeiros .btn-remover").forEach(botao => {
            botao.addEventListener("click", () => removerBarbeiro(botao.dataset.id));
        });
    } catch (erro) {
        console.error("Erro ao carregar barbeiros:", erro);
    }
}

formBarbeiro.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nome = document.getElementById("input-nome-barbeiro").value;
    const telefone = document.getElementById("input-telefone-barbeiro").value;
    try {
        await fetch(`${API_URL}/barbeiros`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, telefone })
        });
        formBarbeiro.reset();
        fecharModal("modal-barbeiro");
        carregarBarbeiros();
    } catch (erro) {
        console.error("Erro ao cadastrar barbeiro:", erro);
    }
});

async function removerBarbeiro(id) {
    try {
        await fetch(`${API_URL}/barbeiros/${id}`, { method: "DELETE" });
        carregarBarbeiros();
    } catch (erro) {
        console.error("Erro ao remover barbeiro:", erro);
    }
}

carregarBarbeiros();

// =================== TIPOS DE CORTE ===================

const formTipoCorte = document.getElementById("form-tipo-corte");
const tabelaTiposCorte = document.getElementById("tabela-tipos-corte");

async function carregarTiposCorte() {
    try {
        const resposta = await fetch(`${API_URL}/tipos_corte`);
        const tipos = await resposta.json();
        tabelaTiposCorte.innerHTML = "";
        if (tipos.length === 0) {
            tabelaTiposCorte.innerHTML = `<tr><td colspan="3" class="mensagem-vazia-tabela">Nenhum tipo de corte cadastrado</td></tr>`;
            return;
        }
        tipos.forEach(tipo => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${tipo.nome}</td>
                <td>R$ ${tipo.valor.toFixed(2)}</td>
                <td><button class="btn-remover" data-id="${tipo.id}">Remover</button></td>
            `;
            tabelaTiposCorte.appendChild(linha);
        });
        document.querySelectorAll("#tabela-tipos-corte .btn-remover").forEach(botao => {
            botao.addEventListener("click", () => removerTipoCorte(botao.dataset.id));
        });
    } catch (erro) {
        console.error("Erro ao carregar tipos de corte:", erro);
    }
}

formTipoCorte.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nome = document.getElementById("input-nome-tipo").value;
    const valor = parseFloat(document.getElementById("input-valor-tipo").value);
    try {
        await fetch(`${API_URL}/tipos_corte`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, valor })
        });
        formTipoCorte.reset();
        fecharModal("modal-tipo-corte");
        carregarTiposCorte();
        carregarTiposCorteNoGeral();
    } catch (erro) {
        console.error("Erro ao cadastrar tipo de corte:", erro);
    }
});

async function removerTipoCorte(id) {
    try {
        await fetch(`${API_URL}/tipos_corte/${id}`, { method: "DELETE" });
        carregarTiposCorte();
        carregarTiposCorteNoGeral();
    } catch (erro) {
        console.error("Erro ao remover tipo de corte:", erro);
    }
}

carregarTiposCorte();

// =================== PAINEL GERAL: TIPOS DE CORTE ===================

const tabelaTiposCorteGeral = document.getElementById("tabela-tipos-corte-geral");

async function carregarTiposCorteNoGeral() {
    try {
        const resposta = await fetch(`${API_URL}/tipos_corte`);
        const tipos = await resposta.json();
        tabelaTiposCorteGeral.innerHTML = "";
        if (tipos.length === 0) {
            tabelaTiposCorteGeral.innerHTML = `<tr><td colspan="2" class="mensagem-vazia-tabela">Nenhum tipo de corte cadastrado</td></tr>`;
            return;
        }
        tipos.forEach(tipo => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${tipo.nome}</td>
                <td>R$ ${tipo.valor.toFixed(2)}</td>
            `;
            tabelaTiposCorteGeral.appendChild(linha);
        });
    } catch (erro) {
        console.error("Erro ao carregar tipos de corte no painel geral:", erro);
    }
}

carregarTiposCorteNoGeral();

// =================== CORTES (COM OPÇÃO "OUTROS") ===================

const formCorte = document.getElementById("form-corte");
const tabelaCortes = document.getElementById("tabela-cortes");
const selectBarbeiroCorte = document.getElementById("select-barbeiro-corte");
const checkboxesTiposCorte = document.getElementById("checkboxes-tipos-corte");
const previewValorTotal = document.getElementById("preview-valor-total");
const checkboxOutros = document.getElementById("checkbox-outros");
const camposOutros = document.getElementById("campos-outros");
const inputDescricaoOutros = document.getElementById("input-descricao-outros");
const inputValorOutros = document.getElementById("input-valor-outros");

// Mostra ou esconde os campos de "Outros" conforme o checkbox
checkboxOutros.addEventListener("change", () => {
    if (checkboxOutros.checked) {
        camposOutros.classList.remove("oculta");
    } else {
        camposOutros.classList.add("oculta");
        inputDescricaoOutros.value = "";
        inputValorOutros.value = "";
    }
    atualizarPreviewValorTotal();
});

// Atualiza o preview ao digitar o valor de "Outros"
inputValorOutros.addEventListener("input", atualizarPreviewValorTotal);

async function preencherSelectBarbeiros(selectElemento) {
    try {
        const resposta = await fetch(`${API_URL}/barbeiros`);
        const barbeiros = await resposta.json();
        selectElemento.innerHTML = `<option value="">Selecione o barbeiro</option>`;
        barbeiros.forEach(barbeiro => {
            const opcao = document.createElement("option");
            opcao.value = barbeiro.id;
            opcao.textContent = barbeiro.nome;
            selectElemento.appendChild(opcao);
        });
    } catch (erro) {
        console.error("Erro ao preencher select de barbeiros:", erro);
    }
}

async function preencherCheckboxesTiposCorte() {
    try {
        const resposta = await fetch(`${API_URL}/tipos_corte`);
        const tipos = await resposta.json();
        checkboxesTiposCorte.innerHTML = "";
        tipos.forEach(tipo => {
            const linha = document.createElement("label");
            linha.classList.add("checkbox-servico");
            linha.innerHTML = `
                <input type="checkbox" value="${tipo.id}" data-valor="${tipo.valor}">
                ${tipo.nome} - R$ ${tipo.valor.toFixed(2)}
            `;
            checkboxesTiposCorte.appendChild(linha);
        });
        checkboxesTiposCorte.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
            checkbox.addEventListener("change", atualizarPreviewValorTotal);
        });
        atualizarPreviewValorTotal();
    } catch (erro) {
        console.error("Erro ao preencher checkboxes de tipos de corte:", erro);
    }
}

function atualizarPreviewValorTotal() {
    const marcados = checkboxesTiposCorte.querySelectorAll("input[type=checkbox]:checked");
    let total = 0;
    marcados.forEach(checkbox => {
        total += parseFloat(checkbox.dataset.valor);
    });
    if (checkboxOutros.checked && inputValorOutros.value) {
        total += parseFloat(inputValorOutros.value);
    }
    previewValorTotal.textContent = `R$ ${total.toFixed(2)}`;
}

async function carregarCortes() {
    try {
        const resposta = await fetch(`${API_URL}/cortes`);
        const cortes = await resposta.json();
        tabelaCortes.innerHTML = "";
        if (cortes.length === 0) {
            tabelaCortes.innerHTML = `<tr><td colspan="6" class="mensagem-vazia-tabela">Nenhum atendimento registrado</td></tr>`;
            return;
        }
        cortes.forEach(corte => {
            const nomesServicos = corte.servicos.map(s => s.nome).join(", ");
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${corte.barbeiro_nome}</td>
                <td>${nomesServicos}</td>
                <td>R$ ${corte.valor_total.toFixed(2)}</td>
                <td>${corte.data}</td>
                <td>${corte.forma_pagamento}</td>
                <td><button class="btn-remover" data-id="${corte.id}">Remover</button></td>
            `;
            tabelaCortes.appendChild(linha);
        });
        document.querySelectorAll("#tabela-cortes .btn-remover").forEach(botao => {
            botao.addEventListener("click", () => removerCorte(botao.dataset.id));
        });
    } catch (erro) {
        console.error("Erro ao carregar cortes:", erro);
    }
}

formCorte.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const barbeiro_id = selectBarbeiroCorte.value;
    const data = document.getElementById("input-data-corte").value;
    const forma_pagamento = document.getElementById("select-forma-pagamento").value;

    const marcados = checkboxesTiposCorte.querySelectorAll("input[type=checkbox]:checked");
    let tipos_corte_ids = Array.from(marcados).map(checkbox => parseInt(checkbox.value));

    if (tipos_corte_ids.length === 0 && !checkboxOutros.checked) {
        alert("Selecione pelo menos um serviço realizado.");
        return;
    }

    if (checkboxOutros.checked) {
        const descricao = inputDescricaoOutros.value.trim();
        const valorOutros = parseFloat(inputValorOutros.value);

        if (!descricao || isNaN(valorOutros) || valorOutros <= 0) {
            alert("Preencha a descrição e o valor do serviço em 'Outros'.");
            return;
        }

        try {
            const respostaTipo = await fetch(`${API_URL}/tipos_corte`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome: descricao, valor: valorOutros })
            });
            const novoTipo = await respostaTipo.json();
            tipos_corte_ids.push(novoTipo.id);

            await fetch(`${API_URL}/cortes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ barbeiro_id, tipos_corte_ids, data, forma_pagamento })
            });

            await fetch(`${API_URL}/tipos_corte/${novoTipo.id}`, { method: "DELETE" });

        } catch (erro) {
            console.error("Erro ao registrar serviço extra:", erro);
            return;
        }
    } else {
        try {
            await fetch(`${API_URL}/cortes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ barbeiro_id, tipos_corte_ids, data, forma_pagamento })
            });
        } catch (erro) {
            console.error("Erro ao registrar atendimento:", erro);
            return;
        }
    }

    formCorte.reset();
    checkboxOutros.checked = false;
    camposOutros.classList.add("oculta");
    inputDescricaoOutros.value = "";
    inputValorOutros.value = "";
    fecharModal("modal-corte");
    carregarCortes();
    carregarResumoSemana();
});

async function removerCorte(id) {
    try {
        await fetch(`${API_URL}/cortes/${id}`, { method: "DELETE" });
        carregarCortes();
        carregarResumoSemana();
    } catch (erro) {
        console.error("Erro ao remover atendimento:", erro);
    }
}

document.getElementById("btn-abrir-modal-corte").addEventListener("click", () => {
    preencherSelectBarbeiros(selectBarbeiroCorte);
    preencherCheckboxesTiposCorte();
    checkboxOutros.checked = false;
    camposOutros.classList.add("oculta");
    inputDescricaoOutros.value = "";
    inputValorOutros.value = "";
});

carregarCortes();

// =================== AGENDAMENTOS ===================

const formAgendamento = document.getElementById("form-agendamento");
const tabelaAgendamentos = document.getElementById("tabela-agendamentos");
const selectBarbeiroAgendamento = document.getElementById("select-barbeiro-agendamento");
const gradeHorarios = document.getElementById("grade-horarios");
const inputHorarioSelecionado = document.getElementById("input-horario-selecionado");

async function carregarAgendamentos() {
    try {
        const resposta = await fetch(`${API_URL}/agendamentos`);
        const agendamentos = await resposta.json();
        tabelaAgendamentos.innerHTML = "";
        if (agendamentos.length === 0) {
            tabelaAgendamentos.innerHTML = `<tr><td colspan="4" class="mensagem-vazia-tabela">Nenhum agendamento</td></tr>`;
            return;
        }
        agendamentos.forEach(agendamento => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${agendamento.nome_cliente}</td>
                <td>${agendamento.data_hora}</td>
                <td>${agendamento.barbeiro_nome}</td>
                <td><button class="btn-remover" data-id="${agendamento.id}">Cancelar</button></td>
            `;
            tabelaAgendamentos.appendChild(linha);
        });
        document.querySelectorAll("#tabela-agendamentos .btn-remover").forEach(botao => {
            botao.addEventListener("click", () => cancelarAgendamento(botao.dataset.id));
        });
    } catch (erro) {
        console.error("Erro ao carregar agendamentos:", erro);
    }
}

async function consultarDisponibilidade() {
    const barbeiroId = selectBarbeiroAgendamento.value;
    const data = document.getElementById("input-data-agendamento").value;
    if (!barbeiroId || !data) {
        alert("Selecione o barbeiro e a data antes de ver os horários.");
        return;
    }
    try {
        const resposta = await fetch(`${API_URL}/agendamentos/disponibilidade?barbeiro_id=${barbeiroId}&data=${data}`);
        const horarios = await resposta.json();
        gradeHorarios.innerHTML = "";
        inputHorarioSelecionado.value = "";
        horarios.forEach(item => {
            const slot = document.createElement("div");
            slot.classList.add("horario-slot", item.status);
            slot.textContent = item.horario;
            if (item.status === "disponivel") {
                slot.addEventListener("click", () => {
                    document.querySelectorAll(".horario-slot.selecionado").forEach(s => {
                        s.classList.remove("selecionado");
                        s.classList.add("disponivel");
                    });
                    slot.classList.remove("disponivel");
                    slot.classList.add("selecionado");
                    inputHorarioSelecionado.value = item.horario;
                });
            }
            gradeHorarios.appendChild(slot);
        });
    } catch (erro) {
        console.error("Erro ao consultar disponibilidade:", erro);
    }
}

document.getElementById("btn-ver-disponibilidade").addEventListener("click", consultarDisponibilidade);

formAgendamento.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const barbeiro_id = selectBarbeiroAgendamento.value;
    const nome_cliente = document.getElementById("input-nome-cliente").value;
    const data = document.getElementById("input-data-agendamento").value;
    const horario = inputHorarioSelecionado.value;
    if (!horario) {
        alert("Selecione um horário disponível na grade antes de salvar.");
        return;
    }
    const data_hora = `${data} ${horario}`;
    try {
        const resposta = await fetch(`${API_URL}/agendamentos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ barbeiro_id, nome_cliente, data_hora })
        });
        if (resposta.status === 409) {
            alert("Esse horário já foi ocupado. Escolha outro.");
            return;
        }
        formAgendamento.reset();
        gradeHorarios.innerHTML = "";
        fecharModal("modal-agendamento");
        carregarAgendamentos();
        carregarProximosAgendamentos();
    } catch (erro) {
        console.error("Erro ao criar agendamento:", erro);
    }
});

async function cancelarAgendamento(id) {
    try {
        await fetch(`${API_URL}/agendamentos/${id}`, { method: "DELETE" });
        carregarAgendamentos();
        carregarProximosAgendamentos();
    } catch (erro) {
        console.error("Erro ao cancelar agendamento:", erro);
    }
}

document.getElementById("btn-abrir-modal-agendamento").addEventListener("click", () => {
    preencherSelectBarbeiros(selectBarbeiroAgendamento);
    gradeHorarios.innerHTML = "";
});

carregarAgendamentos();

// =================== PAINEL GERAL: PRÓXIMOS AGENDAMENTOS ===================

const abasDias = document.getElementById("abas-dias");
const listaProximosAgendamentos = document.getElementById("lista-proximos-agendamentos");
let diaSelecionadoOffset = 0;

function formatarDataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function montarAbasDias() {
    const nomesDias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    abasDias.innerHTML = "";
    for (let i = 0; i <= 4; i++) {
        const data = new Date();
        data.setDate(data.getDate() + i);
        const aba = document.createElement("button");
        aba.classList.add("aba-dia");
        if (i === diaSelecionadoOffset) aba.classList.add("ativa");
        aba.textContent = i === 0 ? "Hoje" : nomesDias[data.getDay()];
        aba.addEventListener("click", () => {
            diaSelecionadoOffset = i;
            montarAbasDias();
            carregarProximosAgendamentos();
        });
        abasDias.appendChild(aba);
    }
}

async function carregarProximosAgendamentos() {
    try {
        const data = new Date();
        data.setDate(data.getDate() + diaSelecionadoOffset);
        const dataISO = formatarDataISO(data);
        const resposta = await fetch(`${API_URL}/agendamentos?data=${dataISO}`);
        const agendamentos = await resposta.json();
        let agendamentosFiltrados = agendamentos;
        if (diaSelecionadoOffset === 0) {
            const horaAtual = new Date().toTimeString().slice(0, 5);
            agendamentosFiltrados = agendamentos.filter(a => {
                const horaAgendamento = a.data_hora.split(" ")[1];
                return horaAgendamento >= horaAtual;
            });
        }
        listaProximosAgendamentos.innerHTML = "";
        if (agendamentosFiltrados.length === 0) {
            listaProximosAgendamentos.innerHTML = `<p class="mensagem-vazia">Nenhum agendamento para este dia</p>`;
            return;
        }
        agendamentosFiltrados.forEach(agendamento => {
            const horario = agendamento.data_hora.split(" ")[1];
            const item = document.createElement("div");
            item.classList.add("item-proximo");
            item.innerHTML = `
                <span class="horario">${horario}</span>
                <span class="cliente">${agendamento.nome_cliente}</span>
                <span class="barbeiro">${agendamento.barbeiro_nome}</span>
            `;
            listaProximosAgendamentos.appendChild(item);
        });
    } catch (erro) {
        console.error("Erro ao carregar próximos agendamentos:", erro);
    }
}

montarAbasDias();
carregarProximosAgendamentos();

// =================== PAINEL GERAL: RANKING EM BARRAS ===================

const rankingBarras = document.getElementById("ranking-barras");

function obterInicioDaSemana() {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const diasParaSegunda = diaSemana === 0 ? 6 : diaSemana - 1;
    const segunda = new Date(hoje);
    segunda.setDate(hoje.getDate() - diasParaSegunda);
    return formatarDataISO(segunda);
}

function obterFimDaSemana(dataInicioISO) {
    const [ano, mes, dia] = dataInicioISO.split("-").map(Number);
    const dataFim = new Date(ano, mes - 1, dia + 6);
    return formatarDataISO(dataFim);
}

async function carregarRankingGeral() {
    try {
        const dataInicio = obterInicioDaSemana();
        const dataFim = obterFimDaSemana(dataInicio);
        const resposta = await fetch(`${API_URL}/relatorio?data_inicio=${dataInicio}&data_fim=${dataFim}`);
        const dados = await resposta.json();
        const barbeiros = dados.barbeiros;
        rankingBarras.innerHTML = "";
        if (barbeiros.length === 0) {
            rankingBarras.innerHTML = `<p class="mensagem-vazia">Nenhum atendimento registrado nesta semana</p>`;
            return;
        }
        barbeiros.sort((a, b) => b.faturamento_total - a.faturamento_total);
        const maiorFaturamento = barbeiros[0].faturamento_total;
        barbeiros.forEach((barbeiro, indice) => {
            const porcentagemBarra = maiorFaturamento > 0 ? (barbeiro.faturamento_total / maiorFaturamento) * 100 : 0;
            const item = document.createElement("div");
            item.classList.add("item-ranking");
            if (indice === 0) item.classList.add("primeiro");
            item.innerHTML = `
                <div class="linha-topo">
                    <span class="nome">${barbeiro.barbeiro_nome}</span>
                    <span class="valor-rank">R$ ${barbeiro.faturamento_total.toFixed(2)}</span>
                </div>
                <div class="barra-fundo">
                    <div class="barra-preenchida" style="width: ${porcentagemBarra}%;"></div>
                </div>
            `;
            rankingBarras.appendChild(item);
        });
    } catch (erro) {
        console.error("Erro ao carregar ranking geral:", erro);
    }
}

carregarRankingGeral();

// =================== PAINEL GERAL: RESUMO SEMANAL ===================

const cardsResumoSemana = document.getElementById("cards-resumo-semana");

async function buscarResumoDoDia(dataISO) {
    try {
        const resposta = await fetch(`${API_URL}/cortes?data=${dataISO}`);
        const cortesDoDia = await resposta.json();
        const faturamento = cortesDoDia.reduce((total, corte) => total + corte.valor_total, 0);
        return { quantidade: cortesDoDia.length, faturamento };
    } catch (erro) {
        console.error("Erro ao buscar resumo do dia:", erro);
        return { quantidade: 0, faturamento: 0 };
    }
}

async function carregarResumoSemana() {
    const nomesDias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    const inicioSemana = obterInicioDaSemana();
    const hojeISO = formatarDataISO(new Date());
    cardsResumoSemana.innerHTML = "";
    let faturamentoSemanal = 0;
    for (let i = 0; i < 7; i++) {
        const [anoInicio, mesInicio, diaInicio] = inicioSemana.split("-").map(Number);
        const dataDia = new Date(anoInicio, mesInicio - 1, diaInicio + i);
        const dataISO = formatarDataISO(dataDia);
        const resumo = await buscarResumoDoDia(dataISO);
        faturamentoSemanal += resumo.faturamento;
        const card = document.createElement("div");
        card.classList.add("card-dia");
        if (dataISO === hojeISO) card.classList.add("hoje");
        card.innerHTML = `
            <p class="nome-dia">${nomesDias[i]}</p>
            <p class="qtd-cortes">${resumo.quantidade} corte${resumo.quantidade === 1 ? "" : "s"}</p>
            <p class="valor-dia">R$ ${resumo.faturamento.toFixed(2)}</p>
        `;
        cardsResumoSemana.appendChild(card);
    }
    const cardTotal = document.createElement("div");
    cardTotal.classList.add("card-dia", "total");
    cardTotal.innerHTML = `
        <p class="nome-dia">Semana</p>
        <p class="qtd-cortes">Total</p>
        <p class="valor-dia">R$ ${faturamentoSemanal.toFixed(2)}</p>
    `;
    cardsResumoSemana.appendChild(cardTotal);
}

carregarResumoSemana();

// =================== RELATÓRIOS ===================

const tabelaRelatorio = document.getElementById("tabela-relatorio");
const tabelaRanking = document.getElementById("tabela-ranking");
const inputDataInicioRelatorio = document.getElementById("input-data-inicio-relatorio");
const inputDataFimRelatorio = document.getElementById("input-data-fim-relatorio");

async function gerarRelatorioSemanal() {
    const dataInicio = inputDataInicioRelatorio.value;
    const dataFim = inputDataFimRelatorio.value;
    if (!dataInicio || !dataFim) {
        alert("Escolha a data de início e a data de fim para gerar o relatório.");
        return;
    }
    try {
        const resposta = await fetch(`${API_URL}/relatorio?data_inicio=${dataInicio}&data_fim=${dataFim}`);
        const dados = await resposta.json();
        tabelaRelatorio.innerHTML = "";
        if (dados.barbeiros.length === 0) {
            tabelaRelatorio.innerHTML = `<tr><td colspan="3" class="mensagem-vazia-tabela">Nenhum atendimento neste período</td></tr>`;
            return;
        }
        dados.barbeiros.forEach(barbeiro => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${barbeiro.barbeiro_nome}</td>
                <td>${barbeiro.quantidade_atendimentos}</td>
                <td>R$ ${barbeiro.faturamento_total.toFixed(2)}</td>
            `;
            tabelaRelatorio.appendChild(linha);
        });
    } catch (erro) {
        console.error("Erro ao gerar relatório:", erro);
    }
}

async function carregarRankingCompleto() {
    try {
        const resposta = await fetch(`${API_URL}/ranking`);
        const ranking = await resposta.json();
        tabelaRanking.innerHTML = "";
        if (ranking.length === 0) {
            tabelaRanking.innerHTML = `<tr><td colspan="4" class="mensagem-vazia-tabela">Nenhum atendimento registrado</td></tr>`;
            return;
        }
        ranking.forEach((barbeiro, indice) => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${indice + 1}º</td>
                <td>${barbeiro.barbeiro_nome}</td>
                <td>${barbeiro.quantidade_atendimentos}</td>
                <td>R$ ${barbeiro.faturamento_total.toFixed(2)}</td>
            `;
            tabelaRanking.appendChild(linha);
        });
    } catch (erro) {
        console.error("Erro ao carregar ranking completo:", erro);
    }
}

document.getElementById("btn-gerar-relatorio").addEventListener("click", gerarRelatorioSemanal);
document.getElementById("btn-ver-ranking").addEventListener("click", carregarRankingCompleto);