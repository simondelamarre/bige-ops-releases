/* Shared left menu — same behavior on every page */
(function () {
  var toggle = document.getElementById("bige-nav-toggle");
  var nav = document.getElementById("bige-nav");
  var backdrop = document.getElementById("bige-nav-backdrop");
  if (!toggle || !nav) return;

  document.body.classList.add("bige-has-nav");

  function setOpen(open) {
    document.body.classList.toggle("bige-nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    if (backdrop) {
      backdrop.hidden = !open;
    }
    nav.hidden = false;
    if (open) {
      var active = nav.querySelector('a[aria-current="page"]') || nav.querySelector("a");
      if (active) active.focus();
    } else {
      toggle.focus();
    }
  }

  function closeNav() {
    if (document.body.classList.contains("bige-nav-open")) setOpen(false);
  }

  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!document.body.classList.contains("bige-nav-open"));
  });

  if (backdrop) {
    backdrop.addEventListener("click", closeNav);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  nav.querySelectorAll('a[href]').forEach(function (a) {
    a.addEventListener("click", function () {
      // Close drawer on mobile after navigation intent
      if (window.matchMedia && window.matchMedia("(max-width: 959px)").matches) {
        closeNav();
      }
    });
  });

  if (window.matchMedia) {
    var mq = window.matchMedia("(min-width: 960px)");
    var onChange = function () {
      if (mq.matches) closeNav();
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  // Mark current page in the shared menu
  try {
    var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!path || path === "") path = "index.html";
    var hash = location.hash || "";
    nav.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.indexOf("http") === 0) return;
      var file = href.split("#")[0] || "index.html";
      var linkHash = href.indexOf("#") >= 0 ? "#" + href.split("#")[1] : "";
      var isPage = file === path || (path === "" && file === "index.html");
      if (linkHash) {
        if (isPage && hash === linkHash) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      } else if (isPage && !hash) {
        a.setAttribute("aria-current", "page");
      } else if (isPage && file === path && !linkHash) {
        // e.g. on guide.html#glossaire, still highlight Guide for the file link
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  } catch (err) {}
})();
