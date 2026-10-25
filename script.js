/* Antunes & Calisto — comportamento do site (JS puro, sem dependências) */
(function () {
  var SITE = window.SITE || {}, PROJECTS = window.PROJECTS || [], NEWS = window.NEWS || [];
  var STATUS = { em_construcao: "Em Construção", concluido: "Concluído", em_projeto: "Em Projeto", em_comercializacao: "Em Comercialização" };
  var ICON = {
    arrowRight: '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    arrowUpRight: '<svg class="icon" viewBox="0 0 24 24"><path d="M7 7h10v10M7 17 17 7"/></svg>',
    pin: '<svg class="icon" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    left: '<svg class="icon" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    right: '<svg class="icon" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
    layers: '<svg class="icon" viewBox="0 0 24 24"><path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></svg>',
    building: '<svg class="icon" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>',
    maximize: '<svg class="icon" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    calendar: '<svg class="icon" viewBox="0 0 24 24"><path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/></svg>',
    zap: '<svg class="icon" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/></svg>',
    x: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function img(src, alt, cls) { return src ? '<img src="' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy"' + (cls ? ' class="' + cls + '"' : "") + ">" : ""; }

  /* ----- logótipo e hero a partir de SITE ----- */
  var brand = $(".brand");
  if (brand && SITE.logo) brand.innerHTML = '<img src="' + esc(SITE.logo) + '" alt="Antunes &amp; Calisto">';
  var heroImg = $("#hero-img");
  if (heroImg && SITE.heroImage) heroImg.src = SITE.heroImage;
  $$(".year").forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* ----- menu mobile ----- */
  var burger = $(".burger"), menu = $(".menu");
  if (burger && menu) {
    var toggle = function (open) { burger.classList.toggle("open", open); menu.classList.toggle("open", open); document.body.style.overflow = open ? "hidden" : ""; };
    burger.addEventListener("click", function () { toggle(!menu.classList.contains("open")); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { toggle(false); }); });
  }

  /* ----- animações de entrada ----- */
  function initReveal(root) {
    var els = $$(".reveal:not(.in)", root);
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -80px 0px", threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ----- contadores ----- */
  function initCountUp() {
    $$("[data-count]").forEach(function (el) {
      var raw = el.getAttribute("data-count"), m = raw.match(/^([\d.,]+)(.*)$/);
      if (!m) { el.textContent = raw; return; }
      var usesDot = m[1].indexOf(".") > -1, target = parseFloat(m[1].replace(/\./g, "").replace(",", ".")), suffix = m[2];
      if (isNaN(target)) { el.textContent = raw; return; }
      var fmt = function (n) { n = Math.round(n); return usesDot ? n.toLocaleString("pt-PT").replace(/\s/g, ".") : String(n); };
      el.textContent = "0" + suffix;
      var run = function () {
        var t0 = null, dur = 1800;
        (function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(e * target) + suffix; if (p < 1) requestAnimationFrame(step); })(performance.now());
      };
      if (!("IntersectionObserver" in window)) { run(); return; }
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { run(); io.disconnect(); } }, { rootMargin: "0px 0px -80px 0px" });
      io.observe(el);
    });
  }

  /* ----- parallax do hero ----- */
  var hero = $(".hero");
  if (hero) {
    var bg = $(".hero-bg"), content = $(".hero-content");
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      bg.style.transform = "translateY(" + Math.min(y / 600, 1) * 25 + "%)";
      content.style.opacity = Math.max(0, 1 - y / 400);
      content.style.transform = "translateY(" + (-60 * Math.min(y / 400, 1)) + "px)";
    }, { passive: true });
  }

  /* ----- cartões ----- */
  function corners() { return '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>'; }
  function homeCard(p, large, cls) {
    var st = p.status ? '<span class="badge st-' + esc(p.status) + '">' + esc(STATUS[p.status] || p.status) + "</span>" : "";
    return '<a class="pcard reveal ' + (cls || "") + '" href="projeto.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="pimg ' + (large ? "ar-4-3 ar-md-16-10" : "ar-16-9") + '">' + img(p.cover_image, p.title) +
      '<div class="shade"></div>' + corners() +
      '<div class="pinfo ' + (large ? "large" : "") + '">' + st + "<h3>" + esc(p.title) + "</h3>" +
      (p.location ? '<div class="ploc">' + ICON.pin + "<span>" + esc(p.location) + "</span></div>" : "") + "</div>" +
      '<div class="parrow">' + ICON.arrowRight + "</div></div></a>";
  }

  /* ----- home: destaques ----- */
  var featBox = $("#featured-grid");
  if (featBox) {
    var list = PROJECTS.filter(function (p) { return p.featured; });
    if (!list.length) { var sec = $("#featured-section"); if (sec) sec.remove(); }
    else {
      var first = list[0], rest = list.slice(1);
      if (rest.length) {
        featBox.className = "feat-grid multi";
        featBox.innerHTML = '<div class="big">' + homeCard(first, true) + '</div><div class="side">' + rest.map(function (p, i) { return homeCard(p, false, "d" + Math.min(i + 1, 4)); }).join("") + "</div>";
      } else { featBox.className = "feat-grid"; featBox.innerHTML = '<div class="only">' + homeCard(first, true) + "</div>"; }
    }
  }

  /* ----- home: notícias ----- */
  var newsBox = $("#news-grid");
  if (newsBox) {
    newsBox.innerHTML = NEWS.map(function (n, i) {
      return '<a class="ncard reveal ' + (i % 2 ? "right" : "left") + '" href="' + esc(n.url || "#") + '"' + (n.url ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
        '<div class="top"><div class="tags">' + (n.tag ? '<span class="tag">' + esc(n.tag) + "</span>" : "") + (n.date_label ? '<span class="date">' + esc(n.date_label) + "</span>" : "") + "</div>" +
        (n.url ? '<span class="ext">' + ICON.arrowUpRight + "</span>" : "") + "</div>" +
        "<h3>" + esc(n.title) + '</h3><p class="sum">' + esc(n.summary) + '</p><p class="src">' + esc(n.source) + "</p></a>";
    }).join("");
    var line = $(".news-line");
    if (line && "IntersectionObserver" in window) { new IntersectionObserver(function (en, o) { if (en[0].isIntersecting) { line.classList.add("in"); o.disconnect(); } }).observe(line); } else if (line) line.classList.add("in");
  }

  /* ----- portefólio ----- */
  var pfBox = $("#pf-list");
  if (pfBox) {
    var FILTERS = ["Todos", "Em Comercialização", "Em Construção", "Concluído", "Em Projeto"], active = "Todos";
    var fbox = $("#filters");
    fbox.innerHTML = FILTERS.map(function (f) { return '<button class="filter' + (f === active ? " active" : "") + '" data-f="' + f + '">' + f + "</button>"; }).join("");
    var draw = function () {
      var items = active === "Todos" ? PROJECTS : PROJECTS.filter(function (p) { return STATUS[p.status] === active; });
      if (!items.length) { pfBox.innerHTML = '<p class="empty">Nenhum empreendimento encontrado.</p>'; return; }
      var f = items[0], rest = items.slice(1), html = "";
      var bd = function (p) { return p.status ? '<span class="badge bordered st-' + esc(p.status) + '">' + esc(STATUS[p.status]) + "</span>" : ""; };
      html += '<a class="pcard pf-feature reveal" href="projeto.html?id=' + encodeURIComponent(f.id) + '"><div class="pimg ar-16-7" style="aspect-ratio:16/9">' + img(f.cover_image, f.title) + '<div class="shade"></div>' +
        '<i class="corner tl"></i><i class="corner tr"></i><div class="stbadge">' + bd(f) + "</div>" +
        '<div class="pinfo"><div><p class="kicker">Destaque</p><h2>' + esc(f.title) + '</h2><div class="meta">' + ICON.pin + "<span>" + esc(f.location) + "</span>" +
        (f.typology ? "<span>·</span><span>" + esc(f.typology) + "</span>" : "") + (f.year ? "<span>·</span><span>" + esc(f.year) + "</span>" : "") + "</div></div>" +
        '<div class="cta-pill">Ver Empreendimento ' + ICON.arrowRight + "</div></div></div></a>";
      if (rest.length) {
        html += '<div class="pf-grid">' + rest.map(function (p, i) {
          return '<a class="pcard reveal d' + (i % 3 + 1) + '" href="projeto.html?id=' + encodeURIComponent(p.id) + '"><div class="pimg ar-3-4">' +
            (p.cover_image ? img(p.cover_image, p.title) : '<div class="empty" style="padding:0;display:flex;height:100%;align-items:center;justify-content:center;font-size:.75rem">Sem imagem</div>') +
            '<div class="shade"></div><i class="corner tl"></i><i class="corner tr"></i><div class="stbadge">' + bd(p) + "</div>" +
            '<div class="pinfo"><h3>' + esc(p.title) + '</h3><div class="ploc">' + ICON.pin + "<span>" + esc(p.location) + "</span></div>" +
            ((p.typology || p.area_range) ? '<div class="sub">' + (p.typology ? "<span>" + esc(p.typology) + "</span>" : "") + (p.typology && p.area_range ? "<span>·</span>" : "") + (p.area_range ? "<span>" + esc(p.area_range) + "</span>" : "") + "</div>" : "") +
            "</div></div></a>";
        }).join("") + "</div>";
      }
      pfBox.innerHTML = html; initReveal(pfBox);
    };
    fbox.addEventListener("click", function (e) {
      var b = e.target.closest(".filter"); if (!b) return;
      active = b.getAttribute("data-f");
      $$(".filter", fbox).forEach(function (x) { x.classList.toggle("active", x === b); });
      draw();
    });
    draw();
  }

  /* ----- detalhe do projeto ----- */
  var pd = $("#project");
  if (pd) {
    var id = new URLSearchParams(location.search).get("id");
    var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
    if (!p) {
      pd.innerHTML = '<div class="notfound"><div><h2 class="font-display" style="font-size:1.5rem;margin-bottom:1rem;font-weight:400">Empreendimento não encontrado</h2><a href="portfolio.html">Voltar ao portefólio</a></div></div>';
    } else {
      document.title = p.title + " — Antunes & Calisto";
      var specs = [
        p.typology && [ICON.layers, "Tipologias", p.typology], p.total_units && [ICON.building, "Frações", p.total_units],
        p.area_range && [ICON.maximize, "Áreas", p.area_range], p.year && [ICON.calendar, "Conclusão", p.year],
        p.energy_rating && [ICON.zap, "Energia", p.energy_rating], p.floors && [ICON.pin, "Pisos", p.floors]
      ].filter(Boolean);
      var media = p.media_items || [];
      var ytId = function (u) { var m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/); return m && m[1]; };
      var embed = function (u) { var y = ytId(u); if (y) return "https://www.youtube.com/embed/" + y; var v = u.match(/vimeo\.com\/(\d+)/); return v ? "https://player.vimeo.com/video/" + v[1] : null; };
      pd.innerHTML =
        '<div class="pd-hero">' + (p.cover_image ? img(p.cover_image, p.title).replace('loading="lazy"', "") : "") + '<div class="shade"></div><div class="inner"><div class="container">' +
        '<a class="pd-back" href="portfolio.html">' + ICON.left + "Portefólio</a><h1>" + esc(p.title) + '</h1><div class="pd-meta"><div class="loc">' + ICON.pin + "<span>" + esc(p.location) + "</span></div>" +
        (p.status ? '<span class="st">' + esc(STATUS[p.status] || p.status) + "</span>" : "") + "</div></div></div></div>" +
        '<div class="container pd-body"><div class="pd-side"><div class="pd-sticky">' +
        (specs.length ? '<p class="eyebrow" style="margin-bottom:1.5rem">Especificações Técnicas</p><div class="specs">' + specs.map(function (s) { return '<div class="spec">' + s[0] + '<p class="l">' + s[1] + '</p><p class="v">' + esc(s[2]) + "</p></div>"; }).join("") + "</div>" : "") +
        (p.materials ? '<div class="box"><p class="l">Materiais</p><p>' + esc(p.materials) + "</p></div>" : "") +
        '<a class="btn-block" href="contacto.html?assunto=' + encodeURIComponent(p.title) + '">Solicitar Informações</a></div></div>' +
        '<div class="pd-main">' +
        (p.description ? '<div class="pd-block"><p class="eyebrow" style="margin-bottom:1.5rem">Sobre o Empreendimento</p><p class="pd-desc">' + esc(p.description) + "</p></div>" : "") +
        ((p.features || []).length ? '<div class="pd-block"><p class="eyebrow" style="margin-bottom:1.5rem">Características</p><div class="features">' + p.features.map(function (f) { return "<div><i></i>" + esc(f) + "</div>"; }).join("") + "</div></div>" : "") +
        (media.length ? '<div><p class="eyebrow" style="margin-bottom:1.5rem">Galeria</p><div class="gallery">' + media.map(function (m, i) {
          if (m.type === "video") { var y = ytId(m.url); return '<div class="gitem video" data-i="' + i + '">' + (y ? '<img src="https://img.youtube.com/vi/' + y + '/hqdefault.jpg" alt="">' : '<video src="' + esc(m.url) + '" preload="metadata" muted style="width:100%;height:100%;object-fit:cover"></video>') + '<div class="play"><span>▶</span></div></div>'; }
          return '<div class="gitem" data-i="' + i + '">' + img(m.url, "") + "</div>";
        }).join("") + "</div></div>" : "") + "</div></div>" +
        '<div class="lb" id="lb"><button class="lb-btn lb-close" aria-label="Fechar">' + ICON.x + '</button><div class="lb-count"></div><button class="lb-btn lb-prev" aria-label="Anterior">' + ICON.left + '</button><button class="lb-btn lb-next" aria-label="Seguinte">' + ICON.right + '</button><div class="lb-media"></div></div>';

      var lb = $("#lb"), cur = 0;
      var show = function (i) {
        cur = (i + media.length) % media.length; var m = media[cur], box = $(".lb-media", lb);
        if (m.type === "video") { var e = embed(m.url); box.innerHTML = e ? '<iframe src="' + e + '" allowfullscreen title="vídeo"></iframe>' : '<video src="' + esc(m.url) + '" controls autoplay></video>'; }
        else box.innerHTML = '<img src="' + esc(m.url) + '" alt="">';
        $(".lb-count", lb).textContent = (cur + 1) + " / " + media.length;
      };
      var open = function (i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; };
      var close = function () { lb.classList.remove("open"); $(".lb-media", lb).innerHTML = ""; document.body.style.overflow = ""; };
      $$(".gitem", pd).forEach(function (g) { g.addEventListener("click", function () { open(+g.getAttribute("data-i")); }); });
      $(".lb-close", lb).addEventListener("click", close);
      $(".lb-prev", lb).addEventListener("click", function (e) { e.stopPropagation(); show(cur - 1); });
      $(".lb-next", lb).addEventListener("click", function (e) { e.stopPropagation(); show(cur + 1); });
      lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
      document.addEventListener("keydown", function (e) { if (!lb.classList.contains("open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowRight") show(cur + 1); if (e.key === "ArrowLeft") show(cur - 1); });
    }
  }

  /* ----- formulário de contacto (abre o cliente de email) ----- */
  var form = $("#contact-form");
  if (form) {
    var subj = new URLSearchParams(location.search).get("assunto");
    if (subj) form.elements.subject.value = subj;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var body = "Nome: " + f.name.value + "\nEmail: " + f.email.value + "\nTelefone: " + f.phone.value + "\n\n" + f.message.value;
      location.href = "mailto:" + (SITE.email || "info@antunescalisto.pt") + "?subject=" + encodeURIComponent(f.subject.value) + "&body=" + encodeURIComponent(body);
      var t = $("#toast"); t.classList.add("show"); setTimeout(function () { t.classList.remove("show"); }, 5000);
      form.reset();
    });
  }

  initReveal(document); initCountUp();
})();
