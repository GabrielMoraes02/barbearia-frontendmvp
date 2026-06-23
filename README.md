# Barbearia Frontend

Painel administrativo (SPA) para gestão de uma barbearia, desenvolvido em HTML, CSS e JavaScript puro, sem frameworks. Consome a API REST do projeto [barbearia-backendmvp](https://github.com/GabrielMoraes02/barbearia-backendmvp).

Projeto desenvolvido como MVP para a disciplina de Desenvolvimento Full Stack Básico.

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla, sem frameworks)

## Funcionalidades

- Painel "Visão Geral": próximos agendamentos do dia (com navegação entre os próximos 5 dias), ranking semanal de barbeiros em barras, catálogo de tipos de corte e resumo de faturamento dia a dia da semana
- Cadastro, listagem e remoção de barbeiros
- Cadastro, listagem e remoção de tipos de corte (catálogo de serviços)
- Registro de atendimentos com seleção de múltiplos serviços (ex: corte + barba no mesmo atendimento), com cálculo automático do valor total
- Agendamentos com grade visual de disponibilidade de horários (verde = disponível, vermelho = ocupado)
- Relatórios de faturamento por período (data início e data fim) e ranking completo de barbeiros

## Instalação

### Pré-requisitos

- O backend [barbearia-backendmvp](https://github.com/GabrielMoraes02/barbearia-backendmvp) precisa estar rodando em `http://127.0.0.1:5000` antes de usar este frontend

### Passo a passo

1. Clone este repositório:
git clone [url-do-repositorio]

cd barbearia-frontend

2. Abra o arquivo `index.html` diretamente no navegador (duplo clique no arquivo). Não é necessário nenhum servidor local, instalação de dependências ou configuração adicional.

3. Certifique-se de que o backend já está rodando antes de interagir com o painel, já que todas as ações fazem chamadas à API.

## Estrutura do projeto
barbearia-frontend/

├── index.html      # Estrutura das páginas e modais

├── style.css       # Estilização visual (paleta clara/dourada)

├── script.js       # Lógica de integração com a API

└── README.md

## Observações

- Este frontend não utiliza frameworks ou bibliotecas baseadas em SPA (React, Vue, Angular), conforme exigido pelo escopo do projeto.
- A comunicação com a API é feita via `fetch`, e o backend utiliza Flask-CORS para permitir o acesso a partir de um arquivo aberto localmente (`file://`).