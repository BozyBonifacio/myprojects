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

  // --- Sorting ---
  // GitHub metadata (created_at / pushed_at / stars), filled in best-effort.
  // Persisted to localStorage so reloads don't re-hit GitHub's 60 req/hr/IP
  // unauthenticated limit — exhausting it leaves the date sorts with no data.
  var META_KEY = "bozy.meta";
  var META_TTL = 6 * 60 * 60 * 1000; // refetch at most every 6h
  var metaCache = {};
  var metaFetchedAt = 0;
  try {
    var rawMeta = localStorage.getItem(META_KEY);
    if (rawMeta) {
      var parsedMeta = JSON.parse(rawMeta);
      if (parsedMeta && parsedMeta.data) {
        metaCache = parsedMeta.data;
        metaFetchedAt = parsedMeta.at || 0;
      }
    }
  } catch (e) {
    /* unreadable/absent cache — start empty */
  }

  // Ascending tie-break, always applied in natural order regardless of direction.
  function nameCmp(a, b) {
    return (a.title || "").localeCompare(b.title || "");
  }

  // Each comparator is a factory taking dir (+1 ascending, -1 descending).
  function makeName() {
    return function (dir) {
      return function (a, b) {
        return dir * nameCmp(a, b);
      };
    };
  }
  // Ascending base = oldest first. Projects without loaded metadata always sink
  // to the bottom (direction-independent) so the list stays sensible offline.
  function makeDate(field) {
    return function (dir) {
      return function (a, b) {
        var ta = metaCache[a.repo] && metaCache[a.repo][field];
        var tb = metaCache[b.repo] && metaCache[b.repo][field];
        // No dates loaded yet (e.g. rate-limited): order by name, but still
        // respond to the direction toggle so the control visibly works.
        if (!ta && !tb) return dir * nameCmp(a, b);
        if (!ta) return 1;
        if (!tb) return -1;
        var d = new Date(ta).getTime() - new Date(tb).getTime();
        return d !== 0 ? dir * d : nameCmp(a, b);
      };
    };
  }

  // Insertion order doubles as dropdown order; first entry is the default.
  var SORTS = {
    modified: { label: "Last modified", cmp: makeDate("pushed_at") },
    created: { label: "Date created", cmp: makeDate("created_at") },
    name: { label: "Name", cmp: makeName() },
  };
  var SORT_KEY = "bozy.sort";
  var DIR_KEY = "bozy.sortDir";
  // Restore the saved choice, falling back to the default if it's missing/stale.
  var activeSort = "modified";
  var activeDir = "desc"; // newest-first / Z–A
  try {
    var saved = localStorage.getItem(SORT_KEY);
    if (saved && SORTS[saved]) activeSort = saved;
    var savedDir = localStorage.getItem(DIR_KEY);
    if (savedDir === "asc" || savedDir === "desc") activeDir = savedDir;
  } catch (e) {
    /* localStorage unavailable (private mode / disabled) — use defaults */
  }

  function dirSign() {
    return activeDir === "asc" ? 1 : -1;
  }
  function sortComparator() {
    return (SORTS[activeSort] || SORTS.modified).cmp(dirSign());
  }

  var sortSelect = document.getElementById("sort-select");
  Object.keys(SORTS).forEach(function (key) {
    var o = document.createElement("option");
    o.value = key;
    o.textContent = SORTS[key].label;
    if (key === activeSort) o.selected = true;
    sortSelect.appendChild(o);
  });
  sortSelect.addEventListener("change", function () {
    activeSort = sortSelect.value;
    try {
      localStorage.setItem(SORT_KEY, activeSort);
    } catch (e) {
      /* ignore write failures */
    }
    renderCards();
  });

  var dirBtn = document.getElementById("sort-dir");
  function updateDirBtn() {
    dirBtn.textContent = activeDir === "asc" ? "↑" : "↓";
    dirBtn.title = activeDir === "asc" ? "Ascending" : "Descending";
    dirBtn.setAttribute("aria-label", "Sort direction: " + dirBtn.title);
  }
  dirBtn.addEventListener("click", function () {
    activeDir = activeDir === "asc" ? "desc" : "asc";
    try {
      localStorage.setItem(DIR_KEY, activeDir);
    } catch (e) {
      /* ignore write failures */
    }
    updateDirBtn();
    renderCards();
  });
  updateDirBtn();

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

  // Explicit `url` wins; otherwise build the GitHub URL from `repo`.
  function projectUrl(p) {
    return p.url || repoUrl(p.repo);
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
      '<a class="card__link" href="' + projectUrl(p) + '" target="_blank" rel="noopener">View code →</a>' +
      shotsBtn +
      demoBtn +
      "</div>" +
      "</article>"
    );
  }

  function renderCards(instant) {
    var visible = projects.filter(function (p) {
      return activeFilter === "All" || (p.tags || []).indexOf(activeFilter) !== -1;
    });
    visible.sort(sortComparator());
    grid.innerHTML = visible.map(cardHTML).join("");
    fillMeta(visible);
    if (instant) {
      // Used for the re-render after metadata loads — avoids replaying the fade-in.
      Array.prototype.forEach.call(grid.children, function (c) {
        c.classList.add("card--in");
      });
    } else {
      observeCards();
    }
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

  // Write the cached GitHub stats (★ / "updated …") into rendered cards.
  function fillMeta(list) {
    list.forEach(function (p) {
      var m = metaCache[p.repo];
      if (!m) return;
      var el = grid.querySelector('.card__meta[data-repo="' + p.repo + '"]');
      if (!el) return;
      var bits = [];
      if (typeof m.stars === "number" && m.stars > 0) bits.push("★ " + m.stars);
      if (m.pushed_at) bits.push("updated " + timeAgo(m.pushed_at));
      el.textContent = bits.join(" · ");
    });
  }

  // Fetch all repo metadata once, then re-render so the date sorts have data.
  function prefetchMeta() {
    if (!projects.length) return;
    // If the cache is fresh and complete, trust it and skip the network
    // entirely — this is what keeps us under the rate limit across reloads.
    var fresh = metaFetchedAt && Date.now() - metaFetchedAt < META_TTL;
    var complete = projects.every(function (p) {
      return metaCache[p.repo];
    });
    if (fresh && complete) {
      renderCards(true);
      return;
    }
    var pending = projects.map(function (p) {
      return fetch("https://api.github.com/repos/" + user + "/" + p.repo)
        .then(function (r) {
          return r.ok ? r.json() : null;
        })
        .then(function (data) {
          if (!data) return;
          metaCache[p.repo] = {
            created_at: data.created_at,
            pushed_at: data.pushed_at,
            stars: data.stargazers_count,
          };
        })
        .catch(function () {
          /* offline or rate-limited — silently keep static card */
        });
    });
    Promise.all(pending).then(function () {
      metaFetchedAt = Date.now();
      try {
        localStorage.setItem(
          META_KEY,
          JSON.stringify({ at: metaFetchedAt, data: metaCache })
        );
      } catch (e) {
        /* storage full/unavailable — cache stays in-memory only */
      }
      renderCards(true);
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
    lbRepo.href = projectUrl(p);
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
  prefetchMeta();
  countUp();
})();
