# Template de Tarefa para IA

Use este template para pedir implementacoes consistentes para outras IAs.

---

## 1) Contexto
- Projeto: implementacao do jogo Ethnos.
- Stack: TypeScript, Phaser, Vite, Bun.
- Principios obrigatorios: simplicidade, legibilidade, padronizacao.
- Direcao visual obrigatoria: estilo pixelado com stock footage filtrado em pixel e ambientacao fantastica medieval.

## 2) Objetivo da tarefa
Descreva o que deve ser implementado em uma frase curta e objetiva.

## 3) Escopo
- Entradas:
- Saidas esperadas:
- Arquivos possivelmente afetados:

## 4) Requisitos funcionais
Liste regras observaveis que precisam funcionar.

## 5) Requisitos nao funcionais
- Nao introduzir complexidade desnecessaria.
- Manter nomes claros e consistentes.
- Evitar duplicacao de logica.
- Preservar separacao entre regra de jogo e renderizacao.
- Preservar consistencia visual pixelada e tema fantastico medieval.

## 6) Criterios de aceitacao
- [ ] Comportamento principal implementado.
- [ ] Sem regressao obvia no fluxo existente.
- [ ] Lint sem novos erros.
- [ ] Codigo aderente ao padrao do projeto.

## 7) Restricoes
- Nao adicionar bibliotecas novas sem justificativa.
- Nao alterar API publica existente sem explicitar impacto.
- Nao fazer refatoracao ampla fora do escopo.

## 8) Validacao
Peca explicitamente para a IA executar e reportar:
- `bun run lint`
- `bun run build` (quando aplicavel)

## 9) Formato da resposta esperada
Solicite que a IA retorne:
1. Resumo do que mudou.
2. Lista de arquivos alterados.
3. Riscos ou pontos de atencao.
4. Proximos passos sugeridos.

---

## Exemplo rapido de uso
"Implemente [X] respeitando o AGENTS.md, com mudancas minimas e legiveis. Atualize tipos se necessario, rode lint/build e devolva resumo, arquivos alterados e riscos."
