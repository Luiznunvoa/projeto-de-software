# Contexto do Projeto para Agentes IA (Ethnos)

Este documento resume o que já foi implementado e o estado atual da arquitetura do jogo Ethnos (TypeScript + Phaser), para alinhar as próximas IAs que trabalharem no projeto.

## 1. Arquitetura Básica Definida
A base da arquitetura e das separações das responsabilidades já foi estabelecida em `src/`:
- **`src/types/`**: Interfaces e tipos puros do domínio (`card.ts`, `flags.ts`, `game.ts`, `player.ts`, `region.ts`, `table.ts`, `tribe.ts`, `turn.ts`).
- **`src/game/state/`**: Gerenciamento de estado do jogo. Contém a lógica de domínio mutável para cada escopo do jogo (`band.ts`, `game.ts`, `player.ts`, `region.ts`, `table.ts`, `turn.ts`).
- **`src/game/scenes/`**: Lógica de interface gamificada usando Phaser. As cenas implementadas até agora incluem:
  - `GameSetup.ts`: Menu inicial interativo para escolher número de jogadores e cores.
  - `Game.ts` / `GameBoard.ts`: Cenas que comportam o motor central, o fluxo do jogo e do tabuleiro.

A diretriz visual foi implementada: artes pixeladas (stock com filtros), temática fantsia medieval, e a fonte Jersey ativada.

## 2. Regras de Domínio Já Implementadas (Estado)
Grande parte do domínio essencial (fluxo base de mesa, deck, e turno) já está modelado:
- **Setup e Mesa (`table.ts`)**: Draw e discard pile configurados. Os jogadores começam com 10 cartas na mão (limite da mão=`10`).
- **Lógica de Compra de Cartas**: 
  - Embaralhamento da pilha de descarte validado caso o deck se esgote. Tratamento de exceção incluído para quando ambos estão vazios.
  - Regra Especial do Dragão validada: Cartas de Dragão podem ou não ser pescadas dependendo de um flag. Caso não sejam, reinserem-se as cartas até que um Aliado seja exposto.
- **Estrutura de Fases do Turno (`turn.ts`)**: Ciclo do turno segue as fases -> `ChooseAction` -> `Draw` -> `BandCommand` -> `PowerCommand`.
- **Lógica do Bando (`band.ts`)**: 
  - Bandos armazenam cartas contendo um líder. A tribo governante (`tribe`) é estritamente inferida do líder (`leaderIndex`).
  - Cada bando já retém o estado de alvo (`targetRegion`).
- **Lógica de Regiões (`region.ts`)**: Grafo de verificação de vizinhos (`neighbors`) mapeado, controle de limites de tokens (`tokenLimit`), e tamanho de bandas condizentes com `bandSize`.

## 3. Em Aberto (Para Próximos Passos)
Ainda há vários sistemas semânticos a fechar:
- **Poderes das Tribos**: O esqueleto já está posicionado, mas as lógicas profundas (`triggerTribePower` e `calcPower`) estão com marcadores `TODO`.
- **Transação de Turno**: Validar as restrições completas da transição de fases. Inicializar corretamente variáveis como `currentTurn`, `currentAge`, e logs (`markerHistory` / controle de marcadores dos jogadores).
- **Cartas de Dragões (Fim de Era)**: Determinar o fluxo final exato da era toda vez que um Dragão é puxado / as bandeiras que indicam trigger de fim de era.
- **Aleatoriedade**: O sistema de shuffle ainda pode precisar de sementes (seed determinística) em vez de um math random volátil para melhor rastreabilidade caso demandado por multiplayer eventual.

## 4. Orientações Gerais (Reminder)
Ao atuar sobre essa base:
- **Mantenha passos pequenos**: Continue alterando módulo por módulo.
- **Cuidado com tipos**: O projeto usa modo strict.
- **Não altere estado sem ler os tipos globais**: Tudo deve conversar com a API estrutural documentada na pasta `src/types/`. 
