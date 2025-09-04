# Peças Automotivas Compatíveis

Repositório da interface React para catálogo de peças automotivas compatíveis.

- Projeto: pecas-automotivas-compativeis
- Stack: React + Vite + Tailwind (configurada)

Scripts

- npm run dev — start dev server
- npm run build — build produção
- npm run preview — preview da build

Estrutura relevante

- src/ — código fonte
  - src/components — componentes reutilizáveis
  - src/page-*.jsx — páginas

Observações

- Alguns arquivos de dados (db/) foram adicionados ao repositório. Se preferir, recomendo movê-los para um repositório separado ou adicioná-los ao `.gitignore`.

Repositório remoto: https://github.com/luciofreitas/pecas-automotivas-compativeis

Licença: MIT

## Abrir no Chrome para desenvolvimento

Este projeto inclui um script que abre automaticamente o navegador Google Chrome para desenvolvimento sem alterar o navegador padrão do sistema (útil se você usa OperaGX como navegador padrão).

- Iniciar servidor de desenvolvimento e abrir no Chrome:

```powershell
npm run dev:chrome
```

- O que o script faz:
  - Inicia o servidor Vite (`npm run dev`).
  - Aguarda a URL do servidor (`http://localhost:5174`) ficar disponível.
  - Abre o Google Chrome nessa URL usando um arquivo `open-chrome.bat` (não altera o navegador padrão do Windows).

- Notas:
  - Se o Chrome não abrir automaticamente, verifique se está instalado no caminho padrão (`C:\Program Files\Google\Chrome\Application\chrome.exe`) e se o comando `chrome` funciona no terminal.
  - Você também pode usar as configurações de Debug do VS Code (F5) — selecione `Launch Chrome with Vite`.
