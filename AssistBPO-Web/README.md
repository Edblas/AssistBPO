# AssistBPO-Web

Este repositório contém o frontend e backend do projeto AssistBPO.

Estrutura principal:
- `backend/` — aplicação Java (Maven)
- `frontend/` — aplicação frontend (Vite + React)

Como usar localmente
1. Backend (Java/Maven)
   - Entre em `backend/`
   - Execute: `mvn spring-boot:run` ou construa com `mvn package` e execute o jar
2. Frontend (Node)
   - Entre em `frontend/`
   - Instale dependências: `npm install` (ou `pnpm`/`yarn` se preferir)
   - Inicie: `npm run dev`

Subir para o GitHub
1. Crie um repositório vazio no GitHub (via web ou `gh repo create`).
2. Adicione o remoto:
   ```
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

Se quiser, me passe a URL do repositório remoto e eu adiciono o remoto e faço o push por você (ou posso instruir passo a passo se preferir fazer manualmente).