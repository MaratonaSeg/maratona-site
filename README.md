# Site institucional — Maratona Segurança Eletrônica

Site estático (HTML5, CSS3 e JavaScript puro), sem backend e sem banco de dados, pronto para o Cloudflare Pages.

## Estrutura

```
/
├── index.html              Página inicial
├── style.css               Estilos (cores em :root, no topo do arquivo)
├── script.js               Menu mobile, formulário, animações
├── 404.html                Página de erro
├── cftv/  manutencao/  portoes/  interfonia/
├── controle-de-acesso/  condominios/  empresas/   Páginas internas (index.html em cada pasta)
├── assets/img/             Favicon, ícones e imagem de compartilhamento (og-image.png)
├── site.webmanifest  robots.txt  sitemap.xml  _headers
```

## Publicar no Cloudflare Pages

1. Envie todos os arquivos para um repositório no GitHub (na raiz do repositório).
2. No Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** e escolha o repositório.
3. Configuração de build: *Framework preset* **None**, *Build command* **vazio**, *Build output directory* **/** (ou deixe vazio).
4. Depois de publicado, em **Custom domains** adicione `maratonaseg.com.br`.

## Personalizações rápidas

| O quê | Onde |
|---|---|
| Logo | `assets/img/logo.png` e `logo@2x.png` (cabeçalho) e `assets/img/logo-escudo.png` (rodapé). Para trocar, substitua os arquivos mantendo os nomes. |
| Favicon | `favicon.ico` (raiz) e `assets/img/favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`. |
| Imagem de compartilhamento | `assets/img/og-image.png` (1200×630). |
| Número do WhatsApp | Links `wa.me/5571991448224` nos HTML e `CONFIG.whatsapp` em `script.js`. |
| Redes sociais | No rodapé do `index.html`, links com `data-social` (Instagram @maratonaseg, Facebook maratona.seg, TikTok @maratonaseg). |
| Cores | Variáveis no topo de `style.css` (`--roxo: #2A1147`, `--lilas`, `--dourado`). |

## Formulário de contato

Hoje o formulário valida os campos e abre o WhatsApp da empresa com a mensagem já preenchida.
Para integrar a um serviço (Formspree, Getform, Cloudflare Worker etc.), preencha o atributo
`data-endpoint` do `<form id="form-orcamento">` com a URL do serviço. O envio passa a ser feito
via `POST` em JSON (`nome`, `telefone`, `email`, `perfil`, `servico`, `mensagem`), com o WhatsApp como alternativa em caso de falha.

## Menu e páginas internas

O menu da página inicial leva às seções da própria página. Os botões "Saiba mais" e os links do rodapé
já levam às páginas internas (`/cftv/`, `/manutencao/` etc.). Para o menu apontar para as páginas,
troque, por exemplo, `href="#cftv"` por `href="cftv/"`.
