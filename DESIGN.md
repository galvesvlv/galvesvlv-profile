# Direção visual — Stormy Morning / narrativa editorial

Referências consultadas:
- [Figma — Manhã tempestuosa](https://www.figma.com/pt-br/resource-library/combinacoes-de-cores/): família monocromática azul-acinzentada, associada a névoa e manhãs tempestuosas. A paleta abaixo é uma adaptação para esta interface, não uma reprodução de valores oficiais.
- StoryMaps: [Pacheco Pass](https://storymaps.arcgis.com/stories/c10f0ba992b742d7bdd00565a1ad8407) e [Digital Resume](https://storymaps.arcgis.com/stories/7448b4773b3b49eb80c2c7249941f896). Capa editorial com retrato; mapas ocupam toda a largura e permanecem ao fundo enquanto os relatos avançam.
- [Arup — City Resilience Framework](https://www.arup.com/insights/city-resilience-framework/): roda com anéis e rótulos. A nossa usa nove formações: três ambientais, quatro computacionais e duas pontes interdisciplinares em um anel compartilhado. Áreas não representam proficiência, porcentagens nem horas de estudo.

| Papel | Cor |
|---|---|
| Fundo | `#e9eff2` |
| Capa | `#dce5eb` |
| Superfície de leitura | `#f6f8f9` |
| Texto | `#293b48` |
| Texto secundário | `#546773` |
| Ação | `#405f76` |
| Bordas | `#ccd7de` |

Estilos em `src/styles/main.css`. Mapa sticky com relatos em superfícies claras sobrepostas; em celular, relatos estreitos preservam espaço para ver o mapa entre as etapas. Câmera usa `flyTo`, ou `jumpTo` com movimento reduzido. Texto continua disponível quando WebGL/tiles falham.

Imagens: configuração em `src/data/media.json`; instruções em `public/images/README.md`. A identidade não reutiliza imagens proprietárias das referências.
