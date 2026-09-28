/* ==========================================================
   MARATONA SEGURANÇA ELETRÔNICA — script.js
   Sem dependências externas.
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Configuração central ---------- */
  var CONFIG = {
    whatsapp: '5571991448224',           // DDI + DDD + número (somente dígitos)
    mensagemPadrao: 'Olá, vim pelo site da Maratona e gostaria de um atendimento.'
  };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Ano no rodapé ---------- */
  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Header com sombra ao rolar ---------- */
  var header = $('.header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = $('.menu-toggle');
  var nav = $('#menu');

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', nav).forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1180) setMenu(false);
    });
  }

  /* ---------- Link ativo no menu conforme a seção ---------- */
  var navLinks = $$('.nav__list a[href^="#"]');
  if ('IntersectionObserver' in window && navLinks.length) {
    var map = {};
    navLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) map[id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && map[entry.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove('is-active'); });
          map[entry.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* ---------- Animações de entrada ---------- */
  var revealTargets = $$('.section__head, .card, .trust__item, .maint__content, .maint__systems, .segment__content, .segment__media, .step, .about__badge, .about__content, .cta-final__inner, .contact__info, .form');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el, i) {
      if (el.classList.contains('card') || el.classList.contains('step')) {
        el.style.transitionDelay = (i % 4) * 70 + 'ms';
      }
      io.observe(el);
    });
  }

  /* ---------- Pré-selecionar serviço no formulário ---------- */
  var selServico = $('#f-servico');
  var selPerfil = $('#f-perfil');

  function selectOption(select, value) {
    if (!select || !value) return;
    $$('option', select).forEach(function (opt) {
      if (opt.value === value || opt.textContent.trim() === value) select.value = opt.value || opt.textContent.trim();
    });
  }

  $$('[data-servico]').forEach(function (el) {
    el.addEventListener('click', function () {
      selectOption(selServico, el.getAttribute('data-servico'));
      selectOption(selPerfil, el.getAttribute('data-perfil'));
    });
  });

  /* ---------- Formulário de orçamento ---------- */
  var form = $('#form-orcamento');
  var status = $('#form-status');

  function setError(name, msg) {
    var input = form.elements[name];
    var err = $('#e-' + name);
    var field = input && input.closest('.field');
    if (field) field.classList.toggle('has-error', !!msg);
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (input && err) input.setAttribute('aria-describedby', 'e-' + name);
    if (err) err.textContent = msg || '';
  }

  function validate(data) {
    var ok = true;
    setError('nome', ''); setError('telefone', ''); setError('email', '');
    if (!data.nome || data.nome.length < 2) { setError('nome', 'Informe seu nome.'); ok = false; }
    if (!data.telefone || data.telefone.replace(/\D/g, '').length < 10) { setError('telefone', 'Informe um telefone com DDD.'); ok = false; }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setError('email', 'Informe um e-mail válido.'); ok = false; }
    return ok;
  }

  function montarMensagem(d) {
    var linhas = ['*Pedido de orçamento — site Maratona*', ''];
    linhas.push('*Nome:* ' + d.nome);
    linhas.push('*Telefone:* ' + d.telefone);
    if (d.email) linhas.push('*E-mail:* ' + d.email);
    if (d.perfil) linhas.push('*Perfil:* ' + d.perfil);
    if (d.servico) linhas.push('*Serviço:* ' + d.servico);
    if (d.mensagem) { linhas.push(''); linhas.push(d.mensagem); }
    return linhas.join('\n');
  }

  // Máscara simples de telefone
  var tel = $('#f-telefone');
  if (tel) {
    tel.addEventListener('input', function () {
      var v = tel.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
      else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      else if (v.length > 0) v = v.replace(/^(\d*)/, '($1');
      tel.value = v;
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.empresa_site && form.elements.empresa_site.value) return; // anti-spam

      var data = {
        nome: form.elements.nome.value.trim(),
        telefone: form.elements.telefone.value.trim(),
        email: form.elements.email.value.trim(),
        perfil: form.elements.perfil.value,
        servico: form.elements.servico.value,
        mensagem: form.elements.mensagem.value.trim()
      };

      if (!validate(data)) {
        status.textContent = 'Verifique os campos destacados.';
        status.classList.add('is-error');
        var firstErr = $('.has-error input', form);
        if (firstErr) firstErr.focus();
        return;
      }
      status.classList.remove('is-error');

      var endpoint = form.getAttribute('data-endpoint');

      // Integração futura: se houver endpoint configurado, envia via POST (JSON)
      if (endpoint) {
        status.textContent = 'Enviando...';
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error('Falha no envio');
          status.textContent = 'Pedido enviado! Em breve entraremos em contato.';
          form.reset();
        }).catch(function () {
          status.textContent = 'Não foi possível enviar agora. Abrindo o WhatsApp...';
          abrirWhatsApp(montarMensagem(data));
        });
        return;
      }

      // Padrão atual: abre o WhatsApp com a mensagem preenchida
      abrirWhatsApp(montarMensagem(data));
      status.textContent = 'Abrindo o WhatsApp com seus dados...';
    });
  }

  function abrirWhatsApp(texto) {
    var url = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto || CONFIG.mensagemPadrao);
    window.open(url, '_blank', 'noopener');
  }

  /* ---------- Placeholders de redes sociais ---------- */
  $$('[data-social]').forEach(function (a) {
    if (a.getAttribute('href') === '#') {
      a.addEventListener('click', function (e) { e.preventDefault(); });
      a.setAttribute('title', 'Em breve');
    }
  });
})();
