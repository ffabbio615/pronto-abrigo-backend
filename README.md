# 🚨 Pronto Abrigo

## 1 - Apresentação da Ideia

Esse é o meu projeto  **Pronto Abrigo** .

A ideia surgiu a partir do desafio relacionado a desastres naturais, como enchentes que vêm acontecendo com frequência no Brasil.

Pensando nesse cenário, decidi focar no problema da  **organização de abrigos e gestão de pessoas e recursos durante situações de emergência** , onde muitas vezes há descontrole, falta de informação e dificuldade de comunicação entre abrigos e população.

---

## 2 - Problema Escolhido

Em situações de desastre, alguns problemas críticos acontecem:

* Falta de controle sobre **capacidade dos abrigos**
* Dificuldade em gerenciar **doações e suprimentos**
* Pessoas desaparecidas ou deslocadas sem um sistema organizado de busca
* Falta de transparência para o público sobre o que está acontecendo
* Processos manuais e desorganizados

---

## 3 - Solução Proposta

O **Pronto Abrigo** é um sistema que permite:

### 🏠 Abrigos

* Cadastro e autenticação de abrigos
* Controle de status (open, closed, full)
* Gestão de capacidade e localização (latitude/longitude)

### 📦 Suprimentos

* Cadastro de itens (água, comida, roupas, etc.)
* Controle de quantidade mínima, máxima e atual
* Atualização e exclusão de itens

### 🎁 Doações (Reservas)

* Usuários podem reservar doações para um abrigo
* O sistema controla automaticamente:
* Atualização de estoque
* Expiração da reserva (24h)
* Confirmação pelo abrigo

### 🧍‍♂️ Pessoas / Animais (Entities)

* Registro de pessoas ou animais resgatados
* Status:
* `in_shelter`
* `looking_for_family`
* `reunited`
* `released`
* Controle de saída com motivo obrigatório
* Sistema público de busca (respeitando LGPD)

### 🔍 Busca Pública (LGPD)

O público pode:

* Buscar por pessoas desaparecidas
* Ver apenas informações seguras:
* Nome
* Idade estimada
* Espécie
* Descrição física

Informações sensíveis como:

* Data de nascimento
* Foto (se não autorizada)

👉 Só são visíveis para o abrigo

---

## 4 - Estrutura do Sistema

O projeto foi dividido em três partes principais:

---

### 💻 Front-end *(em desenvolvimento / planejado)*

* Interface para usuários e abrigos
* Busca de pessoas desaparecidas
* Visualização de abrigos e status
* Interação com doações

---

### ⚙️ Back-end

Desenvolvido com:

* Node.js
* Express
* PostgreSQL

#### Estrutura:

<pre class="overflow-visible! px-0!" data-start="2436" data-end="2538"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼ5 ͼj"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>src/</span><br/><span>├── controllers/</span><br/><span>├── services/</span><br/><span>├── routes/</span><br/><span>├── middlewares/</span><br/><span>├── validators/</span><br/><span>├── database/</span></div></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

#### Funcionalidades:

* Autenticação com JWT
* Validação com middleware
* Regras de negócio (services)
* API REST completa

---

### 🗄️ Banco de Dados

Utilizando  **PostgreSQL** , com tabelas principais:

* `shelters`
* `supplies`
* `donation_reservations`
* `registered_entities`

#### Destaques:

* Relacionamento entre abrigos e recursos
* Controle de integridade dos dados
* Regras de negócio aplicadas via backend

---

## 🚀 Objetivo do Projeto

Criar uma solução real que possa:

* Organizar abrigos em situações de crise
* Facilitar reencontro de pessoas
* Melhorar a distribuição de recursos
* Trazer mais transparência e eficiência
