# Guia de Agentes IA

## Objetivo do projeto
Este projeto implementa digitalmente o jogo **Ethnos** usando **TypeScript + Phaser**.

## Direcao tecnica
- Priorizar simplicidade: solucoes pequenas, diretas e faceis de manter.
- Priorizar legibilidade: nomes claros, funcoes curtas e fluxo facil de seguir.
- Priorizar padronizacao: manter estilo consistente em estrutura, estado e nomenclatura.
- Evitar complexidade desnecessaria: sem over-engineering.

## Direcao visual
- Estilo grafico pixelado.
- Uso de imagens de stock footage com filtro pixelado.
- Ambientacao fantastica medieval como identidade artistica principal.
- Manter consistencia visual entre personagens, cenarios, UI e efeitos.
- Fonte principal para a maioria dos textos: Jersey (TTF).

## Stack e comandos
- Runtime e scripts: `bun`
- Motor de jogo: `phaser`
- Build/dev: `vite`
- Linguagem: `typescript` (strict)
- Qualidade:
  - `bun run dev`
  - `bun run build`
  - `bun run lint`
  - `bun run fix`
  - `bun run format`
  - `bun run check`

## Estrutura base
- `src/game/scenes/`: cenas de jogo do Phaser
- `src/game/scenes/base/`: cenas abstratas 
- `src/game/state/`: estado do dominio (jogo, jogador, regiao, turno, mesa etc.)
- `src/types/`: tipos globais do jogo
- Alias: `@/* -> src/*`

## Regras para agentes
1. Ler contexto antes de editar (arquitetura, tipos e estado).
2. Propor mudancas pequenas e incrementais.
3. Nao quebrar APIs existentes sem justificativa explicita.
4. Reaproveitar tipos e funcoes antes de criar novos artefatos.
5. Preservar consistencia com o padrao atual do projeto.
6. Evitar dependencias novas sem necessidade real.
7. Sempre validar com lint/build quando possivel.

## Convencoes de implementacao
- Use nomes explicitos e orientados ao dominio de Ethnos.
- Evite funcoes muito grandes; prefira passos pequenos.
- Mantenha logica de jogo separada da logica de renderizacao.
- Prefira tipos explicitos nos limites do dominio.
- Trate estados invalidos de forma defensiva.
- Ao implementar apresentacao, preservar a direcao visual pixelada e fantastica medieval.

## Regras de dominio atuais (inferidas do state)
- Setup de jogadores: cada jogador inicia com 10 cartas de aliado na mao.
- Limite de mao: `MAX_HAND_SIZE = 10`.
- Compra de cartas na mesa:
  - Se o deck acabar, embaralhar descarte no deck.
  - Se deck e descarte estiverem vazios, erro de estado.
  - Carta dragao comprada com `drawDragons = true` vai para area de dragoes e nao entra na mao.
  - Carta dragao com `drawDragons = false` e reinserida no fundo ate sair um aliado.
- Turno:
  - Fases existentes: `ChooseAction`, `Draw`, `BandCommand`, `PowerCommand`.
  - Proximo turno avanca jogador por modulo da quantidade de jogadores e reinicia em `ChooseAction`.
- Bando:
  - `tribe` do bando e derivada da carta lider (`leaderIndex`).
  - Bando guarda `targetRegion`, `playerId`, cartas e lider.
  - Contrato de tipo diz que cartas do bando devem ser da mesma tribo.
- Regioes:
  - Regiao valida adjacencia por lista de vizinhos.
  - Regiao exige tamanho minimo de bando (`bandSize`).
  - Regiao limita tokens por `tokenLimit`.

## Especificacoes que ainda faltam fechar
- Ordem oficial e validacoes de transicao entre fases do turno.
- Condicoes de vitoria por era e pontuacao detalhada.
- Regras completas de comando de bando (movimento, conquista, desempate).
- Efeitos de tribo e calculo de poder (`triggerTribePower` e `calcPower` ainda TODO).
- Regras de dragoes e ativacao de bandeiras no fluxo de turno.
- Definicao inicial obrigatoria para `currentTurn`, `currentAge` e `markerHistory`.
- Regras de inicializacao de `markersLeft` e `controlTokens` por jogador.
- Validacao explicita de bando monotribo e faixa valida de `leaderIndex`.
- Politica de aleatoriedade (deterministica por seed ou nao) para embaralhamento.

## Fluxo sugerido para tarefas
1. Entender o pedido e listar impacto em arquivos.
2. Definir criterio de aceitacao objetivo.
3. Implementar em passos pequenos.
4. Executar checks (`lint`, `build` quando cabivel).
5. Entregar resumo com:
   - o que mudou
   - por que mudou
   - riscos e proximos passos

## Definition of Done
- Funcionalidade implementada conforme pedido.
- Codigo legivel e consistente com o projeto.
- Sem erros de lint introduzidos pela mudanca.
- Sem regressao evidente no fluxo principal.
- Mudancas documentadas quando alterarem regras/comportamento.

## Escopo e limites
- Foco atual: implementacao funcional e clara de Ethnos.
- Se houver conflito entre "ser completo" e "ser simples", escolher simplicidade.
- Regras avancadas podem ser adicionadas depois, com base em iteracoes.
