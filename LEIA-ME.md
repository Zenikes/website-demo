# Site Antunes & Calisto — versão estática (GitHub Pages)

HTML + CSS + JavaScript puro. Sem build, sem Node, sem base de dados.

## Ficheiros
- `index.html`, `portfolio.html`, `projeto.html` (detalhe, lê `?id=`), `sobre.html`, `contacto.html`, `404.html`
- `style.css` — todo o design (cores, tipografia, layout)
- `script.js` — menu, animações, filtros, galeria, formulário
- `data.js` — **empreendimentos, notícias, imagem do hero e logótipo** (edita aqui)
- `embed_images.py` — descarrega as imagens e embute-as no site (base64)

## Passo importante: embutir as imagens
O export do Base44 não trouxe as imagens (as imagens e os empreendimentos estavam na base de dados do Base44).
Neste momento o site aponta para os URLs `media.db.com` — funcionam enquanto a app Base44 existir.
Para ficarem **embutidas**, no teu computador, dentro desta pasta:

    pip install pillow      # opcional: otimiza/redimensiona
    python embed_images.py

Corre isto **enquanto as imagens ainda estiverem online**. O script faz cópia dos originais para `_backup_antes_de_embutir/` (ignorada pelo git).
Se adicionares mais imagens em `data.js` (URLs), volta a correr o script. Cada ficheiro no GitHub tem de ter < 100 MB (o script reduz as imagens a ≤ 1920 px).

## Publicar no GitHub Pages
1. Cria um repositório no GitHub e faz upload de **todos** os ficheiros desta pasta (sem a pasta `_backup_...`).
2. Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
3. O site fica em `https://<utilizador>.github.io/<repositório>/`.

## O que mudou face ao Base44
- Removidos: `/admin`, login/registo e restantes páginas que precisam de backend. Para mudar conteúdos, edita `data.js`.
- Formulário de contacto: abre o cliente de email com a mensagem pré-preenchida (para `info@antunescalisto.pt`). Para envio direto, podes ligar a um serviço como Formspree.
- Tipos de letra (Inter e Playfair Display) vêm do Google Fonts; sem internet usa fontes do sistema.
- Os 4 empreendimentos em `data.js` são os exemplos que estavam no código — substitui pelos reais.
