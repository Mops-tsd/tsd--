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
    // safety net: anything scrolled past (fast swipes) becomes visible
    let rafPending = false;
    const sweep = () => {
      rafPending = false;
      reveals.forEach((el) => {
        if (!el.classList.contains("is-visible") && el.getBoundingClientRect().top < 0) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      });
    };
    window.addEventListener("scroll", () => {
      if (!rafPending) { rafPending = true; requestAnimationFrame(sweep); }
    }, { passive: true });
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
      timer = setInterval(() => go(idx + 1), 9500);
    };
    go(0);
    restart();
  }

  /* ---------- Film play button (перенос ролика со старого сайта) ---------- */
  const filmPlayer = document.getElementById("filmPlayer");
  if (filmPlayer) {
    const video = filmPlayer.querySelector("video");
    const poster = filmPlayer.querySelector(".film__poster");
    if (video && poster) {
      poster.addEventListener("click", () => {
        filmPlayer.classList.add("is-playing");
        video.setAttribute("preload", "auto");
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(function () {});
      });
    }
  }

  /* ---------- Lightbox for project galleries ---------- */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector("img");
    const lbCount = lightbox.querySelector(".lightbox__count");
    let group = [];
    let pos = 0;
    const show = () => {
      const btn = group[pos];
      if (!btn) return;
      lbImg.src = btn.dataset.full;
      lbCount.textContent = (pos + 1) + " / " + group.length;
    };
    const openLb = (btn) => {
      group = Array.from(btn.closest(".pj__gallery").querySelectorAll(".pj__ph"));
      pos = group.indexOf(btn);
      show();
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const closeLb = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lbImg.src = "";
    };
    const step = (d) => { pos = (pos + d + group.length) % group.length; show(); };

    document.addEventListener("click", (e) => {
      const ph = e.target.closest(".pj__ph");
      if (ph) { e.preventDefault(); openLb(ph); }
    });
    lightbox.querySelector(".lightbox__close").addEventListener("click", closeLb);
    lightbox.querySelector(".lightbox__prev").addEventListener("click", (e) => { e.stopPropagation(); step(-1); });
    lightbox.querySelector(".lightbox__next").addEventListener("click", (e) => { e.stopPropagation(); step(1); });
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---------- Forms (front-end only) ---------- */
  document.querySelectorAll("form.lead-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-status");
      if (status) {
        status.classList.add("ok");
        status.textContent = status.dataset.msg || "Заявка отправлена. Спасибо!";
      }
      form.reset();
    });
  });

  /* ---------- Callback modal (перенос формы со старого сайта) ---------- */
  const modal = document.querySelector(".modal");
  if (modal) {
    const openers = document.querySelectorAll("[data-open-callback]");
    const closeBtn = modal.querySelector(".modal__close");
    const open = () => { modal.classList.add("is-open"); document.body.style.overflow = "hidden"; };
    const close = () => { modal.classList.remove("is-open"); document.body.style.overflow = ""; };
    openers.forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); open(); }));
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    // date slots: today + 2 days (как на старом сайте)
    const dayWrap = modal.querySelector("[data-days]");
    const timeWrap = modal.querySelector("[data-times]");
    if (dayWrap && timeWrap) {
      const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
      const mkBtn = (wrap, label) => {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = label;
        b.addEventListener("click", () => {
          wrap.querySelectorAll("button").forEach((x) => x.classList.remove("is-active"));
          b.classList.add("is-active");
        });
        wrap.appendChild(b);
        return b;
      };
      for (let i = 0; i < 3; i++) {
        const d = new Date(); d.setDate(d.getDate() + i);
        const label = i === 0 ? "Сегодня" : `${d.getDate()} ${months[d.getMonth()]}`;
        const b = mkBtn(dayWrap, label);
        if (i === 0) b.classList.add("is-active");
      }
      ["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"].forEach((t, i) => {
        const b = mkBtn(timeWrap, t);
        if (i === 0) b.classList.add("is-active");
      });
    }
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
    "nav.news": "News",
    "nav.contacts": "Contacts",
    "nav.cta": "Get in touch",
    "nav.call": "Discuss a project",
    // hero
    "hero.badge": "Federal developer · <b>since 2008</b>",
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
    "stats.lead": "Russia is a country of scale and diversity. We build across the most varied regions — from temperate zones to the most climatically challenging — creating new points of economic growth where people live and work in comfort.",
    "stat.years": "years of experience — on the market since 2008",
    "stat.years2": "on the market — since 2008",
    "stat.staff": "employees",
    "stat.built": "m² delivered",
    "stat.coverage": "of Russia's territory",
    "stat.years.t": "of experience",
    "stat.years.d": "on the market since 2008 — from oil-and-gas infrastructure to federal development.",
    "stat.staff.t": "employees",
    "stat.staff.d": "engineers, builders and designers across 11 offices and branches nationwide.",
    "stat.built.t": "delivered",
    "stat.built.d": "housing, schools, kindergartens and sports facilities — from Vladivostok to Murmansk.",
    "stat.coverage.t": "of Russia's territory",
    "stat.coverage.d": "we work where others don't: the Far East, Siberia and the Arctic zone.",
    "about.years.u": "years",
    // country facts (from brand deck)
    "country.label": "Russia in numbers",
    "country.mln": "million",
    "country.people": "people",
    "country.peoples": "peoples",
    "country.zones": "climatic zones",
    // film
    "film.eyebrow": "Film about the group",
    "film.slogan": "We build where <span class=\"accent\">Russia is</span>",
    "film.lead": "At the scale of the country — with attention to everyone. We shape modern urban spaces and new points of economic growth across the most varied regions: from temperate zones to climatically challenging territories.",
    "film.a1": "Federal scale",
    "film.a2": "Partnership with the state",
    "film.a3": "Knowledge of regional specifics",
    "film.a4": "Integrated approach to development",
    "film.cap": "Corporate film",
    // directions
    "dir.eyebrow": "What we do",
    "dir.title": "Four directions, one system",
    "dir.sub": "A vertically integrated group: we develop territories, move them, produce for them and invest in them.",
    "dir1.t": "Integrated territory development",
    "dir1.d": "Master-planned residential districts with schools, sport and retail — cities built to last.",
    "dir2.t": "Logistics",
    "dir2.d": "Transport and warehouse infrastructure connecting remote regions to national supply chains.",
    "dir3.t": "Production",
    "dir3.d": "Our own production bases in Irkutsk and Belgorod — control over cost and quality on every site.",
    "dir4.t": "Investment",
    "dir4.d": "A ₽256 bn portfolio and public-private partnerships that turn strategy into infrastructure.",
    // projects
    "proj.eyebrow": "Projects",
    "proj.title": "From the Pacific to the Arctic",
    "proj.sub": "Residential quarters, social and industrial facilities — from the ESPO pipeline to Arctic districts.",
    "proj.all": "All projects →",
    "proj.flag": "Flagship",
    "proj.residential": "Residential",
    "proj.social": "Social",
    "proj.infra": "Infrastructure",
    "proj.biz": "Business class",
    "proj.delivered": "Phase 1 delivered",
    "proj.design": "In design",
    "proj.inwork": "In progress",
    "proj.chita.d": "The largest residential project in Zabaykalye: 392,784 m², 6,468 apartments, car-free courtyards by Lake Kenon.",
    "proj.arkhan.d": "A 200-ha district with 1.1 M m² of housing: schools, a water park and a Sports Palace. Investment — ₽171 bn.",
    "proj.murmansk.d": "A district of 225,390 m² and 3,941 apartments above the Arctic Circle. Investment — ₽27 bn.",
    // geography
    "geo.eyebrow": "Geography",
    "geo.title": "77% of Russia's territory",
    "geo.sub": "We operate where others do not — across the Far East, Siberia and the Arctic zone. Kenon Riviera Park is the largest residential project in Zabaykalsky Krai.",
    "geo.s1": "regions of presence",
    "geo.s2": "of Russia's area",
    "geo.s3": "offices and branches",
    "geo.s4": "production bases",
    // quote
    "quote.eyebrow": "Group philosophy",
    "quote.title": "Where it's hard, it's interesting",
    "quote.sub": "We come to regions seriously and for the long term. We build not just houses, but cities with character.",
    "quote1.t": "Quality neighbourhoods and the happiness of families can be designed and built.",
    "quote1.a": "TSD Group leadership",
    "quote1.r": "from the group's brand platform",
    "quote2.t": "People need warm homes, developed infrastructure, a civilised environment. That is what we create.",
    "quote2.a": "TSD Group leadership",
    "quote2.r": "from the group's brand platform",
    "quote3.t": "To be a federal developer means taking responsibility for the future of hundreds of thousands of people: changing the face of cities and launching new points of growth — from Murmansk to the Far East, from Arkhangelsk to Zabaykalye.",
    "quote3.a": "TSD Group leadership",
    "quote3.r": "from the group's brand platform",
    "quote4.t": "What matters is creating not just square metres, but complete urban environments with transport and social infrastructure.",
    "quote4.a": "Alexander Taskaev",
    "quote4.r": "Board member, Director for Development — SPIEF-2026",
    // partners
    "part.eyebrow": "Partners",
    "part.title": "Trusted by industry leaders",
    "part.sub": "We work alongside Russia's largest energy and financial institutions.",
    // news
    "news.eyebrow": "News",
    "news.title": "Company life",
    "news.sub": "Forums, project launches and key milestones of the group.",
    "news.all": "All news →",
    "news.h1": "News",
    "news.hsub": "SPIEF-2026, project hand-overs, new regions and partnerships — official news of the group.",
    "news.open": "Read more",
    "news.archive": "Earlier news",
    // map
    "map.legend.office": "offices and branches",
    "map.legend.hq": "headquarters — Moscow",
    "map.legend.flag": "flagship project — Chita",
    // callback modal
    "cb.title": "Request a call",
    "cb.sub": "Leave your number and a manager will call you back. We'll gladly tell you about our services.",
    "cb.name": "Name",
    "cb.phone": "Phone number",
    "cb.day": "Convenient day",
    "cb.time": "Convenient time (MSK)",
    "cb.submit": "Send",
    "cb.note": "By clicking the button, you agree to the processing of personal data.",
    "cb.ok": "Thank you! We will call you back at the chosen time.",
    // cta
    "cta.title": "Let's build the future together",
    "cta.sub": "From investment to hand-over of keys — talk to the team about your project or partnership.",
    "cta.btn1": "Contact us",
    "cta.btn2": "View projects",
    // footer
    "foot.about": "A federal developer and investment group creating comfortable environments across the Far East, Siberia and the Arctic. On the market since 2008.",
    "foot.company": "Company",
    "foot.directions": "Directions",
    "foot.contacts": "Contacts",
    "foot.trade": "Trade — AP TRADE",
    "foot.rights": "All rights reserved.",
    "foot.privacy": "Privacy policy",
    // ABOUT page
    "about.h1": "Building the country where it's hardest",
    "about.sub": "TSD Group (TransStroy Development) is a federal developer and investment group. Since 2008 we have grown from oil-and-gas infrastructure construction to integrated territory development across the Far East, Siberia and the Arctic.",
    "about.mission.eyebrow": "Mission",
    "about.mission.t": "Raising the quality of life for generations",
    "about.mission.d": "We raise the quality of life for people and future generations by applying advanced technology and uniting the best specialists. Responsibility to people is the foundation of trust in the company and of everything we do.",
    "about.turnover": "group turnover",
    "about.portfolio": "investment portfolio",
    "about.land": "land bank",
    "about.her.eyebrow": "Heritage",
    "about.her.t": "A school of megaprojects",
    "about.her.sub": "The group grew up on strategic national-scale sites — and brought that quality standard into residential construction.",
    "about.h.vsto.t": "ESPO oil pipeline",
    "about.h.vsto.d": "Eastern Siberia — Pacific Ocean: participation in the trunk line from Taishet to Kozmino port — helipads, storm-water drains and pumping stations.",
    "about.h.sila.t": "Power of Siberia gas pipeline",
    "about.h.sila.d": "Works on the eastern route carrying gas from the Chayanda and Kovykta fields to the Russian Far East and China.",
    "about.h.psp.t": "15-M-tonne oil custody transfer point",
    "about.h.psp.d": "An oil custody transfer point in Amur Oblast and the NPS-21 pumping station in Skovorodino — design and construction.",
    "about.h.zhil.t": "650,000 m² of housing and social facilities",
    "about.h.zhil.d": "Residential quarters, schools for 800 and 2,100 pupils, kindergartens and sports facilities from Vladivostok to Murmansk.",
    "about.values.eyebrow": "Values",
    "about.values.t": "The principles we stand on",
    "about.v1.t": "Responsibility to people",
    "about.v1.d": "We test every decision with one question: how will it affect people's lives — today and decades from now.",
    "about.v2.t": "Scale and reliability",
    "about.v2.d": "We take on tasks of national scale and see them through — from investment to hand-over.",
    "about.v3.t": "Technology and quality",
    "about.v3.d": "Our own production in Irkutsk and Belgorod and advanced construction technology give us control over quality at every stage.",
    "about.v4.t": "Territory development",
    "about.v4.d": "We come to regions seriously and for the long term — creating environments, jobs and the infrastructure of the future.",
    "about.path.eyebrow": "The group's journey",
    "about.path.t": "18 years of growth",
    "about.t1.t": "Company founded",
    "about.t1.d": "Start of construction operations: works on oil-and-gas infrastructure in Eastern Siberia and the Far East.",
    "about.t2.t": "Industrial scale",
    "about.t2.d": "Participation in the biggest builds: ESPO, Power of Siberia, a rail-welding plant, facilities for Mechel, Rosneft and airports.",
    "about.t3.t": "Residential construction",
    "about.t3.d": "Integrated development on Sakhalin, in Khabarovsk and Vladivostok: housing, schools and kindergartens — turnkey.",
    "about.t4.t": "Flagship in Chita",
    "about.t4.d": "Construction permit for Kenon Riviera Park — the largest residential project in Zabaykalsky Krai: 392,784 m², 6,468 apartments.",
    "about.t5.t": "Investment group",
    "about.t5.d": "₽60 bn turnover, ₽256 bn portfolio, 3.4 M m² land bank. The Arctic vector: Arkhangelsk, Murmansk, Kirovsk, Monchegorsk.",
    "about.lead.eyebrow": "Leadership",
    "about.lead.t": "Who leads the group forward",
    "about.lead.p1.tag": "Managing Director of the group",
    "about.lead.p1.d": "Leads the group's operations: construction, production and a regional network of 11 offices from Moscow to Vladivostok.",
    "about.lead.p2.tag": "Board member, Director for Development",
    "about.lead.p2.d": "Responsible for strategy and development, member of the General Council of Delovaya Rossiya. Represents the group at SPIEF, federal agencies and the regions.",
    // SERVICES page
    "serv.h1": "Full cycle — from investment to keys",
    "serv.sub": "A vertically integrated group uniting development, logistics, our own production and investment into one system.",
    "serv.d1": "Master-planned residential districts with full infrastructure: schools, kindergartens, sport, retail and landscaped courtyards. We create not houses, but ready-made urban environments.",
    "serv.d2": "Transport and warehouse infrastructure, container and machinery trading, warehouse robotisation — connecting remote regions to national supply chains.",
    "serv.d3": "Our own production bases in Irkutsk and Belgorod: steel structures and modular blocks, frame and frameless construction technology.",
    "serv.d4": "A ₽256 bn investment portfolio and public-private partnerships that turn long-term strategy into real regional infrastructure.",
    "serv.also.eyebrow": "Services",
    "serv.also.t": "What we build",
    "serv.also.sub": "A full scope of works — from multifunctional complexes and residential property to oilfield facilities. One of the market leaders in site facilities and pipeline transport systems in Russia.",
    "serv.c1.t": "Residential complexes and districts",
    "serv.c1.d": "Integrated development of quarters with infrastructure and social facilities — from studios to family apartments.",
    "serv.c2.t": "Industrial and civil construction",
    "serv.c2.d": "Oilfield development, construction and reconstruction of production facilities, service maintenance.",
    "serv.c3.t": "Public-private partnership",
    "serv.c3.d": "Long-term projects with the state: schools, affordable rental housing, utility modernisation and district reconstruction.",
    "serv.c4.t": "Urban improvement",
    "serv.c4.d": "Car-free courtyards, parks and public spaces — environments people want to live in.",
    "serv.c5.t": "Engineering infrastructure",
    "serv.c5.d": "Treatment plants, boiler houses, external networks, utilities, helipads and storm-water systems.",
    "serv.c6.t": "Harsh climate conditions",
    "serv.c6.d": "Large-scale projects in the Arctic and the Far East — where building is hardest. Turnkey construction.",
    // production
    "prod.eyebrow": "Production",
    "prod.t": "The biggest player in prefab construction",
    "prod.sub": "In-house production of steel structures and modular blocks. Two production bases — Irkutsk and Belgorod — plus established logistics and a branch network allow us to work effectively across Russia.",
    "prod.s1": "production workshops",
    "prod.s2": "production sites",
    "prod.s3": "bases: Irkutsk and Belgorod",
    "prod.s4": "technologies: frame and frameless",
    "prod.f1.tag": "Frame construction",
    "prod.f1.t": "From a hospital to an airport",
    "prod.f1.d": "A 5,500 m² infectious diseases hospital, special vehicle depots for Irkutsk airport, an 8,550 m² gold recovery plant building for Mangazeya Group, a 200-person dormitory for Buryatzoloto, and an EMERCOM rescue centre on Sakhalin.",
    "prod.f2.tag": "Frameless construction",
    "prod.f2.t": "Sports facilities for industry leaders",
    "prod.f2.d": "Fitness and sports centres from 530 to 1,800 m² for Rosneft, Vostokgeologia, Buryatzoloto and Grand Baikal — fast, warm and reliable in any climate.",
    // trade
    "trade.eyebrow": "Trade · AP TRADE",
    "trade.t": "Machinery, containers, logistics",
    "trade.d": "The group's trading arm: special machinery, crane and truck equipment, construction machinery and pipe products. Logistics and trading of 20- and 40-foot sea containers — Emirs and Emirs Trading companies.",
    "trade.link": "AP TRADE — division website ↗",
    // PROJECTS page
    "proj.h1": "Projects from the Pacific to the Arctic",
    "proj.hsub": "Residential quarters, social facilities and strategic infrastructure in the country's toughest regions — where building is hardest.",
    "proj.res.eyebrow": "Residential construction",
    "proj.res.t": "Quarters people want to live in",
    "proj.chita.full": "The largest residential project in Zabaykalsky Krai and a new centre of attraction on the shore of Lake Kenon: monolithic-brick technology, car-free courtyards; nearby — a martial-arts centre, a 50-metre pool and a shopping-and-entertainment centre. Project financing from Sberbank; the bank values the project at ₽24 bn.",
    "proj.chita.s2": "6,468 apartments",
    "proj.chita.s3": "10,000 residents",
    "proj.chita.s4": "car-free courtyards",
    "proj.chita.sales": "Sales office: <a href=\"tel:+79143577575\" style=\"color:#fff;text-decoration:underline\">+7 914 357-75-75</a> · <a href=\"tel:+73022577575\" style=\"color:#fff;text-decoration:underline\">+7 (3022) 57-75-75</a> · <a href=\"https://kenon-park.ru\" target=\"_blank\" rel=\"noopener\" style=\"color:#fff;text-decoration:underline\">kenon-park.ru</a>",
    "proj.arkhan.d2": "A 200-ha district by Talagi airport: 1.128 M m² of housing, 17,400 apartments, kindergartens for 1,800 children, schools for 3,000 pupils, a water park and a Sports Palace. Investment — ₽171 bn, 800 new jobs.",
    "proj.murm1.d": "A district in Murmansk's Pervomaysky okrug: parks, squares and a full set of services by the Kola highway. 3,941 apartments for 7,000 residents.",
    "proj.rosl.t": "Residential complex in Roslyakovo",
    "proj.rosl.d": "Buildings of 5–15 storeys with U-shaped courtyards opening onto the Kola Bay.",
    "proj.khab.t": "Residential complex on Pavlovicha St.",
    "proj.khab.d2": "Two 25-storey towers in the city centre with Amur River views and a 4,967 m² underground car park.",
    "proj.zab.t": "International Residential Quarter",
    "proj.zab.d2": "Russia's eastern gate — 127 m from the Chinese border. The first 124-apartment building was delivered in 2026 under the Far East affordable rental programme.",
    "proj.monch.t": "Moroshkovaya St. — Lenin Ave. complex",
    "proj.monch.d": "A new 13.83-ha quarter in the centre of the Arctic metallurgists' city.",
    "proj.kir.t": "Solnechnaya St. complex",
    "proj.kir.d": "Housing for the ski capital of the Khibiny mountains: 6 ha at the foothills.",
    "proj.sakh.t": "Housing on Sakhalin",
    "proj.sakh.d2": "Over 70,000 m² of housing, including relocation from dilapidated stock.",
    "proj.sakh.s": "3 cities",
    "proj.chitasoc.t": "Turnkey schools and social facilities",
    "proj.chitasoc.d": "Schools for 800 and 2,100 pupils, a 150-place kindergarten, utility modernisation and district reconstruction.",
    "proj.chitasoc.s1": "2 schools",
    "proj.chitasoc.s2": "kindergarten",
    "proj.ind.eyebrow": "Industrial projects",
    "proj.ind.t": "The country's strategic infrastructure",
    "proj.ind.sub": "A school of megaprojects: participation in Russia's main oil and gas trunk lines.",
    "proj.ind.tag": "Infrastructure",
    "proj.vsto.t": "ESPO oil pipeline",
    "proj.vsto.loc": "Taishet — Kozmino port",
    "proj.vsto.d": "Eastern Siberia — Pacific Ocean: design, storm-water drains and helipads for the trunk line connecting Siberian fields with Asian markets.",
    "proj.sila.t": "Power of Siberia gas pipeline",
    "proj.sila.loc": "Irkutsk Oblast — Yakutia — Amur region",
    "proj.sila.d": "Works on the eastern route: gas from the Chayanda and Kovykta fields to Russian consumers and export markets.",
    "proj.psp.t": "15-M-tonne oil custody point",
    "proj.psp.loc": "Amur Oblast",
    "proj.psp.d": "Oil custody transfer point: design and construction of the receiving, storage and metering complex.",
    "proj.nps.t": "NPS-21 Skovorodino",
    "proj.nps.loc": "Amur Oblast",
    "proj.nps.d": "An oil pumping station — a key element of the trunk pipeline: receiving, holding and pumping oil.",
    "proj.cta.t": "Want to know more about a project?",
    "proj.cta.d": "Get in touch with the team — we'll tell you about layouts, timelines and investment terms.",
    // CONTACTS page
    "cont.h1": "Get in touch",
    "cont.sub": "11 offices from Moscow to Vladivostok. Tell us about your project, investment or partnership — we'll reply within one business day.",
    "cont.phone": "Phone",
    "cont.email": "Email",
    "cont.address": "Head office",
    "cont.addr.v": "125284, Moscow, Nordstar Tower Business Centre, 3 Begovaya St., bldg. 1, office 501",
    "cont.hours": "Working hours",
    "cont.hours.v": "Mon–Fri, 9:00–18:00 (MSK)",
    "cont.form.t": "Leave a request",
    "cont.f.name": "Name",
    "cont.f.phone": "Phone",
    "cont.f.email": "Email",
    "cont.f.msg": "Message",
    "cont.f.submit": "Send request",
    "cont.f.note": "By clicking the button, you agree to the processing of personal data.",
    "cont.off.eyebrow": "Offices and branches",
    "cont.off.t": "We are nearby — in 11 cities",
    "cont.off.hq": "Head office",
    "cont.off.rec": "Reception",
    "cont.off.br": "Branch",
    "cont.off.msk2": "Moscow · Federation Tower",
    "cont.off.msk2.a": "12 Presnenskaya Emb., Federation complex, West Tower",
    "cont.off.tyva": "Republic of Tyva · Kyzyl",
    // privacy
    "priv.h1": "Privacy policy",
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
