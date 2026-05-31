(function () {
  "use strict";

  var grid = document.getElementById("project-grid");
  var filterBar = document.getElementById("filters");
  var projects = window.PROJECTS || [];
  var user = window.GITHUB_USER || "BozyBonifacio";

  // --- Build tag filter set ---
  var allTags = ["All"];
  projects.forEach(function (p) {
    (p.tags || []).forEach(function (t) {
      if (allTags.indexOf(t) === -1) allTags.push(t);
    });
  });

  var activeFilter = "All";

  allTags.forEach(function (tag) {
    var b = document.createElement("button");
    b.className = "filter" + (tag === "All" ? " filter--active" : "");
    b.textContent = tag;
    b.setAttribute("role", "tab");
    b.addEventListener("click", function () {
      activeFilter = tag;
      Array.prototype.forEach.call(filterBar.children, function (c) {
        c.classList.toggle("filter--active", c.textContent === tag);
      });
      renderCards();
    });
    filterBar.appendChild(b);
  });

  function repoUrl(repo) {
    return "https://github.com/" + user + "/" + repo;
  }

  function cardHTML(p) {
    var tags = (p.tags || [])
      .map(function (t) {
        return '<span class="tag">' + t + "</span>";
      })
      .join("");

    var demoBtn = p.demo
      ? '<a class="card__link card__link--demo" href="' +
        p.demo +
        '" target="_blank" rel="noopener">Live demo ↗</a>'
      : "";

    var hasShots = p.shots && p.shots.length;
    var shotsBtn = hasShots
      ? '<button class="card__link card__link--shots" data-shots="' +
        p.repo +
        '">▦ Screenshots (' + p.shots.length + ")</button>"
      : "";

    return (
      '<article class="card' + (hasShots ? " card--clickable" : "") + '" data-tags="' +
      (p.tags || []).join(",") +
      '"' + (hasShots ? ' data-open="' + p.repo + '"' : "") + ">" +
      '<div class="card__top">' +
      '<span class="card__icon">' + (p.icon || "📁") + "</span>" +
      '<span class="card__meta" data-repo="' + p.repo + '"></span>' +
      "</div>" +
      '<h3 class="card__title">' + p.title + "</h3>" +
      '<p class="card__blurb">' + p.blurb + "</p>" +
      '<div class="card__tags">' + tags + "</div>" +
      '<div class="card__links">' +
      '<a class="card__link" href="' + repoUrl(p.repo) + '" target="_blank" rel="noopener">View code →</a>' +
      shotsBtn +
      demoBtn +
      "</div>" +
      "</article>"
    );
  }

  function renderCards() {
    var visible = projects.filter(function (p) {
      return activeFilter === "All" || (p.tags || []).indexOf(activeFilter) !== -1;
    });
    grid.innerHTML = visible.map(cardHTML).join("");
    observeCards();
    enrichWithGitHub(visible);
  }

  // --- Reveal-on-scroll animation ---
  var io;
  function observeCards() {
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(grid.children, function (c) {
        c.classList.add("card--in");
      });
      return;
    }
    if (io) io.disconnect();
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e, i) {
          if (e.isIntersecting) {
            e.target.style.transitionDelay = (i % 6) * 60 + "ms";
            e.target.classList.add("card--in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    Array.prototype.forEach.call(grid.children, function (c) {
      io.observe(c);
    });
  }

  // --- Progressive enhancement: live GitHub stats (best-effort) ---
  function timeAgo(dateStr) {
    var then = new Date(dateStr).getTime();
    var diff = Math.max(0, Date.now() - then);
    var d = Math.floor(diff / 86400000);
    if (d === 0) return "today";
    if (d < 30) return d + "d ago";
    var m = Math.floor(d / 30);
    if (m < 12) return m + "mo ago";
    return Math.floor(m / 12) + "y ago";
  }

  function enrichWithGitHub(list) {
    list.forEach(function (p) {
      fetch("https://api.github.com/repos/" + user + "/" + p.repo)
        .then(function (r) {
          return r.ok ? r.json() : null;
        })
        .then(function (data) {
          if (!data) return;
          var el = grid.querySelector('.card__meta[data-repo="' + p.repo + '"]');
          if (!el) return;
          var bits = [];
          if (typeof data.stargazers_count === "number" && data.stargazers_count > 0) {
            bits.push("★ " + data.stargazers_count);
          }
          if (data.pushed_at) bits.push("updated " + timeAgo(data.pushed_at));
          el.textContent = bits.join(" · ");
        })
        .catch(function () {
          /* offline or rate-limited — silently keep static card */
        });
    });
  }

  // --- Animated count-up for hero stats ---
  function countUp() {
    var els = document.querySelectorAll(".stat__num[data-count]");
    els.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      if (isNaN(target)) return;
      var start = 0;
      var dur = 900;
      var t0 = performance.now();
      function step(now) {
        var prog = Math.min(1, (now - t0) / dur);
        el.textContent = Math.floor(start + (target - start) * prog);
        if (prog < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  // --- Smooth-scroll for in-page anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      var target = id ? document.getElementById(id) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ---------- App-Store-style screenshot gallery ----------
  function frame(kind, inner, urlLabel) {
    if (kind === "phone") {
      return (
        '<div class="frame frame--phone"><div class="frame__notch"></div>' +
        '<div class="frame__screen">' + inner + "</div></div>"
      );
    }
    return (
      '<div class="frame frame--browser"><div class="frame__bar">' +
      '<span class="frame__dots"><i></i><i></i><i></i></span>' +
      '<span class="frame__url">' + (urlLabel || "") + "</span></div>" +
      '<div class="frame__screen">' + inner + "</div></div>"
    );
  }

  function termSlide(s) {
    var body = (s.lines || [])
      .map(function (l) {
        var cls = l.c ? " term__line--" + l.c : "";
        var text = (l.t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return '<div class="term__line' + cls + '">' + (text || "&nbsp;") + "</div>";
      })
      .join("");
    return (
      '<div class="term">' +
      '<div class="term__bar"><span class="frame__dots"><i></i><i></i><i></i></span>' +
      '<span class="term__title">' + (s.prompt || s.title || "") + "</span></div>" +
      '<div class="term__body">' + body + "</div></div>"
    );
  }

  function costSlide(s) {
    var cur = s.currency || "$";
    var total = 0;
    var rows = (s.rows || [])
      .map(function (r) {
        total += r.monthly || 0;
        return (
          '<div class="cost__row">' +
          '<div class="cost__name">' + r.name + '<small>' + (r.detail || "") + "</small></div>" +
          '<div class="cost__amt">+' + cur + (r.monthly || 0).toFixed(2) + "</div></div>"
        );
      })
      .join("");
    return (
      '<div class="cost">' +
      '<div class="cost__head">' + (s.title || "Cost estimate") + "</div>" +
      '<div class="cost__cols"><span>Resource</span><span>Monthly</span></div>' +
      rows +
      '<div class="cost__total"><span>OVERALL TOTAL</span><b>+' + cur + total.toFixed(2) + "/mo</b></div>" +
      (s.note ? '<div class="cost__note">' + s.note + "</div>" : "") +
      "</div>"
    );
  }

  function slideInner(s, repo) {
    if (s.kind === "terminal") return termSlide(s);
    if (s.kind === "cost") return costSlide(s);
    if (s.kind === "image") {
      return frame(s.frame, '<img src="' + s.src + '" alt="' + (s.caption || repo) + '" loading="lazy" />', repo);
    }
    if (s.kind === "screen") return frame(s.frame, s.html, repo);
    return "";
  }

  var lb, lbTrack, lbDots, lbTitle, lbRepo, lbIndex = 0, lbCount = 0;

  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lb";
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<div class="lb__backdrop" data-close></div>' +
      '<div class="lb__dialog" role="dialog" aria-modal="true" aria-label="Project screenshots">' +
      '<header class="lb__head">' +
      '<h3 class="lb__title"></h3>' +
      '<a class="lb__repo" target="_blank" rel="noopener">View code ↗</a>' +
      '<button class="lb__close" data-close aria-label="Close">✕</button>' +
      "</header>" +
      '<button class="lb__nav lb__nav--prev" aria-label="Previous">‹</button>' +
      '<div class="lb__track"></div>' +
      '<button class="lb__nav lb__nav--next" aria-label="Next">›</button>' +
      '<div class="lb__dots"></div>' +
      "</div>";
    document.body.appendChild(lb);
    lbTrack = lb.querySelector(".lb__track");
    lbDots = lb.querySelector(".lb__dots");
    lbTitle = lb.querySelector(".lb__title");
    lbRepo = lb.querySelector(".lb__repo");

    lb.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeLb();
    });
    lb.querySelector(".lb__nav--prev").addEventListener("click", function () { goTo(lbIndex - 1); });
    lb.querySelector(".lb__nav--next").addEventListener("click", function () { goTo(lbIndex + 1); });
    lbTrack.addEventListener("scroll", function () {
      var w = lbTrack.clientWidth || 1;
      var i = Math.round(lbTrack.scrollLeft / w);
      if (i !== lbIndex) { lbIndex = i; syncDots(); }
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("lb--open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowRight") goTo(lbIndex + 1);
      else if (e.key === "ArrowLeft") goTo(lbIndex - 1);
    });
  }

  function syncDots() {
    Array.prototype.forEach.call(lbDots.children, function (d, i) {
      d.classList.toggle("lb__dot--active", i === lbIndex);
    });
  }

  function goTo(i) {
    lbIndex = Math.max(0, Math.min(lbCount - 1, i));
    lbTrack.scrollTo({ left: lbIndex * lbTrack.clientWidth, behavior: "smooth" });
    syncDots();
  }

  function openGallery(repo) {
    if (!lb) buildLightbox();
    var p = projects.filter(function (x) { return x.repo === repo; })[0];
    if (!p || !p.shots) return;
    lbTitle.textContent = p.title;
    lbRepo.href = repoUrl(p.repo);
    lbCount = p.shots.length;
    lbIndex = 0;
    lbTrack.innerHTML = p.shots
      .map(function (s) {
        return (
          '<div class="slide"><div class="slide__inner">' +
          slideInner(s, p.repo) +
          "</div>" +
          (s.caption ? '<p class="slide__cap">' + s.caption + "</p>" : "") +
          "</div>"
        );
      })
      .join("");
    lbDots.innerHTML = p.shots
      .map(function (_, i) {
        return '<button class="lb__dot' + (i === 0 ? " lb__dot--active" : "") + '" aria-label="Slide ' + (i + 1) + '"></button>';
      })
      .join("");
    Array.prototype.forEach.call(lbDots.children, function (d, i) {
      d.addEventListener("click", function () { goTo(i); });
    });
    lb.classList.add("lb--open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbTrack.scrollLeft = 0;
  }

  function closeLb() {
    lb.classList.remove("lb--open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Open gallery from card / button click (but let real links work normally)
  grid.addEventListener("click", function (e) {
    if (e.target.closest("a")) return;
    var trigger = e.target.closest("[data-shots],[data-open]");
    if (!trigger) return;
    var repo = trigger.getAttribute("data-shots") || trigger.getAttribute("data-open");
    if (repo) openGallery(repo);
  });

  // --- Spotlight follows cursor on cards ---
  grid.addEventListener("mousemove", function (e) {
    var card = e.target.closest(".card");
    if (!card) return;
    var rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - rect.left + "px");
    card.style.setProperty("--my", e.clientY - rect.top + "px");
  });

  renderCards();
  countUp();
})();
