# Contexto do Projeto

## Visao geral
Projeto de jogo digital inspirado em **Ethnos**, com implementacao em **TypeScript** e **Phaser**.

Objetivo principal: entregar uma base de jogo correta e facil de evoluir, com foco em:
- simplicidade
- legibilidade
- padronizacao

## Direcao visual do jogo
- Linguagem visual pixelada em toda a experiencia.
- Base visual com imagens de stock footage tratadas com filtro pixelado.
- Ambientacao fantastica medieval como tema artistico central.
- Interfaces e elementos de jogo devem seguir a mesma identidade visual.

## Objetivos tecnicos
- Criar uma arquitetura clara entre cena, estado e tipos.
- Garantir comportamento previsivel do jogo.
- Facilitar contribuicoes de pessoas e IAs.

## Principios de engenharia
1. Simples primeiro: implementar o caminho mais direto que resolve o problema.
2. Clareza primeiro: codigo deve ser facil de ler sem contexto oculto.
3. Consistencia primeiro: usar os mesmos padroes em todo o projeto.
4. Incrementalismo: mudancas pequenas, revisaveis e testaveis.
5. Separacao de responsabilidades: renderizacao separada de regra de negocio.

## Estrutura relevante
- `src/main.ts`: bootstrap da aplicacao.
- `src/game/main.ts`: inicializacao do jogo.
- `src/game/scenes/`: cenas Phaser.
- `src/game/scenes/base/ResponsiveScene.ts`: base para resize e ciclo de vida.
- `src/game/state/`: estruturas de estado do dominio.
- `src/types/`: declaracoes de tipos globais.

## Padroes obrigatorios para contribuicoes IA
- Nao criar abstracoes sem necessidade.
- Nao duplicar regras que podem ficar em um unico ponto.
- Nao misturar regra de jogo com detalhes visuais sem justificativa.
- Nao adicionar dependencia externa para problema simples.
- Sempre descrever impacto funcional da alteracao.
- Ao alterar arte/UI/cena, manter a direcao pixelada com fantasia medieval.

## Qualidade minima esperada
- Build continua funcional.
- Lint sem novos problemas.
- Tipagem sem degradar seguranca.
- Arquivos e simbolos com nomes autoexplicativos.

## Comandos uteis
- Desenvolvimento: `bun run dev`
- Build: `bun run build`
- Lint: `bun run lint`
- Auto fix lint: `bun run fix`
- Formatar: `bun run format`
- Checar formatacao: `bun run check`

## Decisoes de escopo
- Priorizar implementacao funcional do nucleo de Ethnos antes de refinamentos avancados.
- Melhor uma versao correta e clara hoje do que uma versao "perfeita" e dificil de manter.
- Qualquer excecao a padroes deve ser documentada com motivo tecnico.
