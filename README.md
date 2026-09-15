# Vitor Luiz Galves — research portfolio

Site em inglês com Vite, TypeScript, D3, MapLibre e MiniSearch. Capa editorial, paleta Stormy Morning, mapas imersivos e roda de formações. GitHub Pages hospeda o frontend; Cloudflare Workers faz a chamada Gemini. Nenhum PDF é publicado ou versionado: `*.pdf` está no `.gitignore`.

**Fotos:** coloque arquivos em `public/images/portraits/`, `public/images/zoey/` e `public/images/stories/`, e configure os caminhos em `src/data/media.json`. Instruções em `public/images/README.md`.

**RAG:** consulte `RAG.md` para a lista de fontes e o fluxo completo de recuperação/contexto/geração.

## Testar localmente

1. Instale Node.js **22**. Se usa nvm: `nvm install` e `nvm use` na pasta do projeto.
2. Execute `npm install` (ou `npm ci` se já existir lockfile).
3. Execute `npm run dev`.
4. Abra **http://localhost:5173**. Se a porta estiver ocupada, use a URL exibida pelo Vite.

Sem configuração adicional você verá todas as seções, os mapas OpenStreetMap, filtros das publicações e a Zoey em **busca local**. Nesse modo são apresentados trechos reais da base; não são respostas de um modelo. Mapas e fontes externas precisam de internet, com fallback de texto e fontes do sistema.

Para validar a versão de produção:

```sh
npm test
npm run build
npm run preview
```

Abra **http://localhost:4173**. Teste também com a janela estreita, teclado, diálogo da Zoey, filtros e preferência de movimento reduzido.

Teste automatizado de navegador (desktop e celular): execute `npx playwright install chromium`, depois `npm run build` e `npm run test:e2e`.

## Gemini local (opcional)

1. Crie uma chave em https://aistudio.google.com/apikey num projeto elegível ao plano gratuito. Verifique modelos, cotas e termos atuais no AI Studio; não habilite faturamento se pretende manter custo zero.
2. Crie `.dev.vars` na raiz com `GEMINI_API_KEY=sua-chave` (exemplo: `.dev.vars.example`).
3. Em `wrangler.jsonc`, ajuste `GEMINI_MODEL` para um modelo disponível no free tier da sua conta. O projeto está configurado para `gemini-3.5-flash-lite`, conforme solicitado; se sua conta não oferecer esse identificador, troque pelo nome exibido no AI Studio.
4. Em outro terminal execute `npm run worker:dev` (normalmente porta 8787).
5. Crie `.env.local` com `VITE_ZOEY_API_URL=http://localhost:8787/api/chat`.
6. Reinicie `npm run dev` e faça uma pergunta.

A chave fica exclusivamente no Worker. Variáveis `VITE_*` são públicas. O Worker aceita apenas IDs conhecidos e reconstrói o contexto a partir da base canônica; limita payload e chamadas por IP. O rate limiter é local ao ponto de presença Cloudflare, não um teto financeiro global. CORS também não é autenticação. Há limite de 5 chamadas/minuto por IP; sem banco de dados, login ou serviço pago obrigatório.

O histórico visual é compartilhado entre os três acessos à Zoey, fica em memória e se apaga ao recarregar. Cada pergunta é recuperada e respondida independentemente: perguntas de acompanhamento devem repetir o assunto.

## Publicar

### Worker

```sh
npx wrangler login
npx wrangler secret put GEMINI_API_KEY
npm run worker:deploy
```

Em `wrangler.jsonc`, adicione a origem exata do Pages em `ALLOWED_ORIGINS`: `https://USUARIO.github.io` (sem `/repositorio/`). Inclua o domínio próprio se houver. Faça novo deploy. Use a URL `https://vitor-zoey-api.SEUSUBDOMINIO.workers.dev/api/chat` no frontend.

O workflow `deploy-worker.yml` é manual e requer os secrets GitHub `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`. A chave Gemini é um secret Cloudflare, não uma variável do frontend. Atualizações em `src/data/` precisam de novo deploy do Worker e do site, pois ambos incorporam o conteúdo no build.

### GitHub Pages

1. Crie um repositório e envie o código. O projeto não faz commit ou push automaticamente.
2. Em **Settings → Pages → Source**, selecione **GitHub Actions**.
3. Em **Settings → Secrets and variables → Actions → Variables**, configure:
   - `VITE_BASE_PATH=/NOME-DO-REPOSITORIO/` para project Pages, ou `/` para `USUARIO.github.io` e domínio próprio.
   - `VITE_ZOEY_API_URL` com a URL completa do Worker, ou deixe vazia para busca local.
   - `VITE_MAP_STYLE_URL` opcional, para outro estilo MapLibre.
4. Execute o workflow Pages ou envie alterações para `main`.

Não crie `CNAME` até ter um domínio. Sitemap com fragmentos não é necessário; só há uma página. O conteúdo é renderizado via JavaScript: pré-renderização pode ser acrescentada posteriormente para melhorar indexação sem JavaScript.

## Dados, fontes e manutenção

- `src/data/profile.json`: biografia e links. Campos não fornecidos não são inventados.
- `education.json`, `experience.json`, `research.json`: narrativas em inglês derivadas do Lattes fornecido e do brief do autor.
- `publications.json`: 18 registros do Scholar NnKfs9kAAAAJ, snapshot de 14/09/2026. DOIs direcionam para páginas oficiais. O frontend nunca consulta ou raspa o Scholar. Os dois artigos Derbyana são original e tradução, com DOIs próprios. Espaçamento de alguns títulos foi normalizado; o nome “V. Galvez” preserva o registro do organizador EGU.
- `expertise.json`: roda de nove formações, vinculadas por `educationId`, com anel interdisciplinar. Tamanho dos segmentos não representa porcentagem ou proficiência.
- `knowledge-base.md`: informação adicional curada, convertida automaticamente por `scripts/prepare-data.mjs` em `knowledge.generated.json` antes do desenvolvimento, testes e build. Não edite o JSON gerado diretamente.
- `locations.geojson`: pontos e referências fornecidos pelo autor e associados por `locationId`. Os mapas mostram a localização institucional; Prefeitura de Niterói é uma referência para o Fórum, e o ponto Neuromatch representa a organização, não comprova presença física no curso.

Formato de um ponto (substitua valores, não use como coordenada real):

```text
Feature.geometry.type = "Point"
Feature.geometry.coordinates = [longitude_verificada, latitude_verificada]
Feature.properties = { id, label, sourceUrl, verifiedAt }
```

Tiles padrão: OpenStreetMap, com atribuição, sem prefetch/offline ou chave. Uso sujeito a https://operations.osmfoundation.org/policies/tiles/; para tráfego maior configure um provedor apropriado. Fontes Google têm fallback local.

## Pendências por arquivo

| Pendência | Arquivo/configuração |
|---|---|
| Atualizar contatos quando necessário (GitHub e email já cadastrados) | `src/data/profile.json`, array `links` |
| Confirmar datas do MBA e modalidade/local das formações | `src/data/education.json` |
| Atualizar localizações, se necessário (pontos já associados) | `src/data/locations.geojson`, `education.json`, `experience.json` |
| Atualizar períodos e descrições dos vínculos | `src/data/experience.json` |
| Confirmar detalhes do financiamento CNPq e resultados do projeto | `src/data/research.json` |
| Atualizar registros bibliográficos (citações não são exibidas nem usadas para ordenar) | `src/data/publications.json` |
| Escolher modelo realmente disponível gratuitamente | `wrangler.jsonc`, `GEMINI_MODEL` |
| Cadastrar chave API e origem do Pages | secret `GEMINI_API_KEY`, `wrangler.jsonc` |
| Configurar caminho e URL do Worker no deploy | GitHub Actions Variables / `.env.local` |
| Acrescentar retrato, foto da Zoey e imagem de capa | `public/images/`, `src/data/media.json` |

Não foram incluídas figuras científicas fictícias, percentuais de impacto, coordenadas presumidas ou um PDF de download. Turnstile e cotas globais não foram adicionados; se houver abuso do endpoint público, podem ser implementados além do rate limiter existente. Não há garantia de disponibilidade contínua ou gratuidade futura dos serviços externos.
