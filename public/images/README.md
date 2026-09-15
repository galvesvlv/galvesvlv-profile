# Imagens do portfólio

- `portraits/`: sua foto para a capa (recomendação: WebP/JPG, proporção 4:5, até 500 KB).
- `zoey/`: foto da Zoey (proporção quadrada ou 4:5).
- `stories/`: fotos de campo, instituições e paisagens; a capa pode usar uma imagem daqui.

Depois de adicionar uma imagem, informe seu caminho em **`src/data/media.json`**:

```json
"portrait": {"src":"images/portraits/vitor.webp","alt":"Vitor Luiz Victalino Galves","placeholder":"Your portrait here"}
```

Use o mesmo formato para `zoey.src` e `cover.src`. Os caminhos não começam com `/` nem `public/`; o componente aplica o base path do GitHub Pages. Caminho vazio mostra um espaço reservado, sem requisições a fotos inexistentes. Imagens quebradas também mostram fallback. A legenda da Zoey fica em `zoey.caption`.

Fotos colocadas em `stories/` só aparecem na capa ao configurar `cover.src`; outras ilustrações precisam ser inseridas na seção desejada. Prefira arquivos otimizados e registre fonte/créditos quando necessário. Imagens não entram automaticamente no RAG.
