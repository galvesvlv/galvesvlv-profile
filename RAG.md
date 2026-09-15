# Zoey AI — arquivos e fluxo do RAG

## Onde editar o conhecimento

| Arquivo | Conteúdo recuperado |
|---|---|
| `src/data/profile.json` | Nome, headline, biografia (links de contato não são indexados atualmente) |
| `src/data/education.json` | Cada formação, instituição, período, descrição e tags |
| `src/data/experience.json` | Cada experiência, descrição, período, impacto e tecnologias |
| `src/data/research.json` | Temas e projetos curados; continuam na base embora a seção visual tenha sido removida |
| `src/data/publications.json` | Título, autores, veículo e ano; não inclui texto integral dos artigos ou contagens de citações no contexto |
| `src/data/knowledge-base.md` | Contexto complementar, limites de evidência e história do nome Zoey AI |

## Onde acontece o processamento

1. **`scripts/prepare-data.mjs`** divide o Markdown por títulos `##` e grava `src/data/knowledge.generated.json`. Executa antes de dev, build, testes e comandos do Worker. O JSON gerado não deve ser editado manualmente.
2. **`src/ai/corpus.ts`** reúne os seis conjuntos acima em chunks com `id`, `title`, `text` e `href`.
3. **`src/ai/retrieval.ts`** cria o índice MiniSearch no navegador, normaliza a pergunta e seleciona até cinco chunks. É recuperação lexical (sem embeddings ou banco vetorial).
4. **`src/components/zoey-chat.ts`** recebe a pergunta e envia `{ question, sourceIds }` ao endereço `VITE_ZOEY_API_URL`. Sem API configurada, mostra trechos locais, identificados como busca local. Mantém o estado compartilhado entre hero, seção final e diálogo.
5. **`worker/cloudflare-worker.ts`** valida os IDs e reconstrói o contexto canônico importando o mesmo corpus. O prompt de sistema está nesse arquivo. Chama o Gemini e retorna o texto gerado.
6. **`wrangler.jsonc`** configura modelo, origens e limite de requisições. `GEMINI_API_KEY` é secret do Worker; localmente fica em `.dev.vars`. `VITE_ZOEY_API_URL` fica em `.env.local` ou nas Variables do GitHub Actions.

As referências dos temas de pesquisa apontam para About, já que a seção Research não existe mais. Referências de publicações limpam filtros para revelar o registro citado.

## O que não entra automaticamente

`expertise.json` organiza a roda visual. `locations.geojson` alimenta os mapas. `media.json` configura fotos/legenda. Imagens em `public/images/` e PDFs locais não são lidos pelo RAG. A história da Zoey está também no Markdown para que ela possa responder sobre seu nome.

Após editar conteúdo, publique novamente **site e Worker**, pois cada um incorpora uma cópia da base. Em desenvolvimento reinicie o Worker se necessário. Não há memória de conversa enviada ao modelo: cada pergunta é respondida com seu contexto recuperado.
