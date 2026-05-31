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

    return (
      '<article class="card" data-tags="' +
      (p.tags || []).join(",") +
      '">' +
      '<div class="card__top">' +
      '<span class="card__icon">' + (p.icon || "📁") + "</span>" +
      '<span class="card__meta" data-repo="' + p.repo + '"></span>' +
      "</div>" +
      '<h3 class="card__title">' + p.title + "</h3>" +
      '<p class="card__blurb">' + p.blurb + "</p>" +
      '<div class="card__tags">' + tags + "</div>" +
      '<div class="card__links">' +
      '<a class="card__link" href="' + repoUrl(p.repo) + '" target="_blank" rel="noopener">View code →</a>' +
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
