/* =========================================================
   TSD GROUP — main.js
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  const burger = document.querySelector(".burger");
  const drawer = document.querySelector(".drawer");
  if (burger && drawer) {
    const toggle = (open) => {
      burger.classList.toggle("is-open", open);
      drawer.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      burger.setAttribute("aria-expanded", String(open));
    };
    burger.addEventListener("click", () =>
      toggle(!drawer.classList.contains("is-open"))
    );
    drawer.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => toggle(false))
    );
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = val
        .toFixed(decimals)
        .replace(".", ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            co.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  }

  /* ---------- Quote slider ---------- */
  const slider = document.querySelector(".qslider");
  if (slider) {
    const slides = slider.querySelectorAll(".qslide");
    const dotsWrap = slider.querySelector(".qdots");
    let idx = 0;
    let timer;
    const dots = [];
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Цитата " + (i + 1));
      b.addEventListener("click", () => {
        go(i);
        restart();
      });
      dotsWrap.appendChild(b);
      dots.push(b);
    });
    const go = (n) => {
      slides[idx].classList.remove("is-active");
      dots[idx].classList.remove("is-active");
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add("is-active");
      dots[idx].classList.add("is-active");
    };
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => go(idx + 1), 6000);
    };
    go(0);
    restart();
  }

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.querySelector("form.lead-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-status");
      if (status) {
        status.classList.add("ok");
        status.textContent = status.dataset.msg || "Заявка отправлена. Спасибо!";
      }
      form.reset();
    });
  }

  /* =========================================================
     i18n — RU (default, in HTML) / EN (dictionary below)
     ========================================================= */
  const I18N = {
    // nav
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.projects": "Projects",
    "nav.geography": "Geography",
    "nav.contacts": "Contacts",
    "nav.cta": "Get in touch",
    // hero
    "hero.badge": "Federal developer · <b>since 2011</b>",
    "hero.title": "Federal developer and <span class=\"accent\">investment group</span>",
    "hero.year": "Strategy 2026",
    "hero.sub": "Integrated territory development, logistics, production and investment across the Far East, Siberia and the Arctic.",
    "hero.tag1": "Integrated territory development",
    "hero.tag2": "Logistics",
    "hero.tag3": "Production",
    "hero.tag4": "Investment",
    "hero.geo": "Far East • Siberia • Arctic",
    "hero.cta1": "Explore projects",
    "hero.cta2": "About the group",
    "metric.bn": "₽ bn",
    "metric.m2": "M m²",
    "metric.turnover": "group turnover",
    "metric.portfolio": "investment portfolio",
    "metric.land": "land bank",
    // stats
    "stats.eyebrow": "Scale",
    "stats.title": "Scale that speaks for itself",
    "stats.sub": "Fifteen years of building the country — from Far-Eastern coastlines to the Arctic frontier.",
    "stat.years": "years on the market",
    "stat.staff": "employees",
    "stat.built": "m² delivered",
    "stat.coverage": "of Russia's territory",
    // directions
    "dir.eyebrow": "What we do",
    "dir.title": "Four directions, one system",
    "dir.sub": "A vertically integrated group: we develop territories, move them, produce for them and invest in them.",
    "dir1.t": "Integrated territory development",
    "dir1.d": "Master-planned residential districts with schools, sport and retail — cities built to last.",
    "dir2.t": "Logistics",
    "dir2.d": "Transport and warehouse infrastructure connecting remote regions to national supply chains.",
    "dir3.t": "Production",
    "dir3.d": "Our own manufacturing base for building materials and structures — control over cost and quality.",
    "dir4.t": "Investment",
    "dir4.d": "A ₽256 bn portfolio and public-private partnerships that turn strategy into infrastructure.",
    // projects
    "proj.eyebrow": "Projects",
    "proj.title": "From the Pacific to the Arctic",
    "proj.sub": "Residential complexes, social and infrastructure facilities across nine regions.",
    "proj.all": "All projects",
    "proj.flag": "Flagship",
    "proj.residential": "Residential",
    "proj.social": "Social",
    "proj.infra": "Infrastructure",
    "proj.chita.d": "20 buildings by Lake Kenon, car-free courtyards, a martial-arts centre, a 50-metre pool and a shopping mall.",
    "proj.arkhan.d": "A modern residential quarter in the Arctic climate — warm façades, park-courtyards and energy efficiency.",
    "proj.murmansk.d": "Residential complexes by the Kola Bay — a comfortable environment above the Arctic Circle.",
    // geography
    "geo.eyebrow": "Geography",
    "geo.title": "77% of Russia's territory",
    "geo.sub": "We operate where others do not — across the Far East, Siberia and the Arctic zone. By project scale, the group is among the leaders of Zabaykalsky Krai.",
    "geo.s1": "regions of presence",
    "geo.s2": "of Russia's area",
    "geo.s3": "climate zones",
    "geo.s4": "year founded",
    // quote
    "quote.eyebrow": "Our philosophy",
    "quote.title": "Why we build",
    "quote1.t": "We don't simply build houses — we create environments where people want to live, work and raise their children. Responsibility to people is the foundation of trust in the company.",
    "quote1.a": "TSD Group leadership",
    "quote1.r": "Group development strategy",
    "quote2.t": "To develop the country's toughest territories — from the Pacific to the Arctic — means believing in its future and investing in it for real.",
    "quote2.a": "TSD Group",
    "quote2.r": "Company mission",
    "quote3.t": "Real development is measured not in square metres, but in the quality of life it leaves people for decades to come.",
    "quote3.a": "TSD Group",
    "quote3.r": "Our principles",
    // partners
    "part.eyebrow": "Partners",
    "part.title": "Trusted by industry leaders",
    "part.sub": "We work alongside Russia's largest energy and financial institutions.",
    // cta
    "cta.title": "Let's build the future together",
    "cta.sub": "From investment to hand-over of keys — talk to the team about your project or partnership.",
    "cta.btn1": "Contact us",
    "cta.btn2": "View projects",
    // footer
    "foot.about": "A federal developer and investment group creating comfortable environments across the Far East, Siberia and the Arctic.",
    "foot.company": "Company",
    "foot.directions": "Directions",
    "foot.contacts": "Contacts",
    "foot.rights": "All rights reserved.",
    "foot.privacy": "Privacy policy",
    // ABOUT page
    "about.h1": "Building the country where it's hardest",
    "about.sub": "TSD Group (TransStroy Development) is a federal developer and investment group. Since 2011 we have delivered large-scale projects across the Far East, Siberia and the Arctic.",
    "about.mission.eyebrow": "Mission",
    "about.mission.t": "Raising the quality of life for generations",
    "about.mission.d": "We raise the quality of life for people and future generations by applying advanced technology and uniting the best specialists. Responsibility to people is the foundation of trust in the company and of everything we do.",
    "about.turnover": "group turnover",
    "about.portfolio": "investment portfolio",
    "about.land": "land bank",
    "about.values.eyebrow": "Values",
    "about.values.t": "The principles we stand on",
    "about.v1.t": "Responsibility to people",
    "about.v1.d": "We test every decision with one question: how will it affect people's lives — today and decades from now.",
    "about.v2.t": "Scale and reliability",
    "about.v2.d": "We take on tasks of national scale and see them through — from investment to hand-over.",
    "about.v3.t": "Technology and quality",
    "about.v3.d": "Our own production and advanced construction technology give us control over quality at every stage.",
    "about.v4.t": "Territory development",
    "about.v4.d": "We come to regions seriously and for the long term — creating environments, jobs and the infrastructure of the future.",
    "about.path.eyebrow": "The group's journey",
    "about.path.t": "15 years of growth",
    "about.t1.t": "Founding of the group",
    "about.t1.d": "Start of construction operations and first infrastructure projects in the Far East.",
    "about.t2.t": "Into new regions",
    "about.t2.d": "Expansion to Sakhalin, Khabarovsk and Zabaykalsky Krai, turnkey social facilities.",
    "about.t3.t": "The Arctic vector",
    "about.t3.d": "Launch of residential projects in Murmansk and Arkhangelsk — building above the Arctic Circle.",
    "about.t4.t": "Flagship in Chita",
    "about.t4.d": "Start of Kenon Riviera Park — one of the largest residential projects in Zabaykalsky Krai.",
    "about.t5.t": "Investment group",
    "about.t5.d": "₽60 bn turnover, ₽256 bn investment portfolio, 3.4 M m² land bank.",
    // SERVICES page
    "serv.h1": "Full cycle — from investment to keys",
    "serv.sub": "A vertically integrated group uniting development, logistics, production and investment into one system.",
    "serv.d1": "Master-planned residential districts with full infrastructure: schools, kindergartens, sport, retail and landscaped courtyards. We create not houses, but ready-made urban environments.",
    "serv.d2": "Transport and warehouse infrastructure connecting remote regions of the Far East, Siberia and the Arctic to national supply chains.",
    "serv.d3": "Our own production base for materials and structures ensures control over cost, timing and quality on every site.",
    "serv.d4": "A ₽256 bn investment portfolio and public-private partnerships that turn long-term strategy into real regional infrastructure.",
    "serv.also.eyebrow": "Competencies",
    "serv.also.t": "What we build",
    "serv.also.sub": "Over 15 years the group has built expertise across the most demanding construction segments.",
    "serv.c1.t": "Residential construction",
    "serv.c1.d": "Comfort- and business-class residential complexes — from studios to family apartments with well-considered layouts.",
    "serv.c2.t": "Industrial and civil construction",
    "serv.c2.d": "Oil-and-gas and industrial infrastructure, turnkey social and commercial buildings.",
    "serv.c3.t": "Public-private partnership",
    "serv.c3.d": "Delivering socially important projects together with the state — schools, sport, roads and utilities.",
    "serv.c4.t": "Social facilities",
    "serv.c4.d": "Martial-arts centres, swimming pools, shopping-and-entertainment centres and public spaces.",
    "serv.c5.t": "Infrastructure",
    "serv.c5.d": "Roads, utilities, helipads and storm-water systems in demanding climates.",
    "serv.c6.t": "Trade",
    "serv.c6.d": "The group's trading division, including a network of year-round fairs within residential quarters.",
    // PROJECTS page
    "proj.h1": "Projects from the Pacific to the Arctic",
    "proj.hsub": "Residential complexes, social and infrastructure facilities in the country's toughest regions — where building is hardest.",
    "proj.chita.full": "A new centre of attraction on the shore of Lake Kenon: 20 buildings, monolithic-brick technology, car-free courtyards. Nearby — a martial-arts centre, a 50-metre pool, a shopping-and-entertainment centre and a network of year-round fairs. One of the largest residential projects in Zabaykalsky Krai.",
    "proj.khab.t": "Residential complex on Pavlovicha St.",
    "proj.khab.d": "A residential complex in central Khabarovsk with modern architecture and developed infrastructure.",
    "proj.zab.t": "Residential complex in Zabaykalsk",
    "proj.zab.d": "Housing for the growing border logistics hub on the frontier with China.",
    "proj.sakh.t": "Turnkey social facilities",
    "proj.sakh.d": "Construction of social and commercial infrastructure for the island region.",
    "proj.vlad.t": "Infrastructure facilities",
    "proj.vlad.d": "Helipads, storm-water systems and engineering facilities in a coastal climate.",
    "proj.cta.t": "Want to know more about a project?",
    "proj.cta.d": "Get in touch with the team — we'll tell you about layouts, timelines and investment terms.",
    // CONTACTS page
    "cont.h1": "Get in touch",
    "cont.sub": "Tell us about your project, investment or partnership — we'll reply within one business day.",
    "cont.phone": "Phone",
    "cont.email": "Email",
    "cont.address": "Address",
    "cont.addr.v": "Moscow, Nordstar Tower Business Centre, 3 Begovaya St., office 501",
    "cont.hours": "Working hours",
    "cont.hours.v": "Mon–Fri, 9:00–18:00 (MSK)",
    "cont.form.t": "Leave a request",
    "cont.f.name": "Name",
    "cont.f.phone": "Phone",
    "cont.f.email": "Email",
    "cont.f.msg": "Message",
    "cont.f.submit": "Send request",
    "cont.f.note": "By clicking the button, you agree to the processing of personal data.",
    // language names shown in drawer etc.
    "lang.label": "Language"
  };

  const langButtons = document.querySelectorAll(".lang button");
  const nodes = document.querySelectorAll("[data-i18n]");
  // capture original RU text
  nodes.forEach((n) => (n.dataset.ru = n.innerHTML));

  const applyLang = (lang) => {
    document.documentElement.lang = lang;
    nodes.forEach((n) => {
      const key = n.dataset.i18n;
      if (lang === "en" && I18N[key]) n.innerHTML = I18N[key];
      else n.innerHTML = n.dataset.ru;
    });
    langButtons.forEach((b) =>
      b.classList.toggle("is-active", b.dataset.lang === lang)
    );
    try { localStorage.setItem("tsd_lang", lang); } catch (e) {}
  };

  langButtons.forEach((b) =>
    b.addEventListener("click", () => applyLang(b.dataset.lang))
  );

  let saved = "ru";
  try { saved = localStorage.getItem("tsd_lang") || "ru"; } catch (e) {}
  applyLang(saved);

  /* ---------- Year in footer ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
