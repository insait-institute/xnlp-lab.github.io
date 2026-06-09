(function () {
  const data = window.LAB_DATA;
  const page = document.body.dataset.page;

  function renderHeader() {
    const nav = [
      ["Home", "index.html"],
      ["People", "people.html"],
      ["Papers", "papers.html"],
      ["News", "news.html"],
      ["Projects", "projects.html"],
      ["Activities", "activities.html"],
      // ["Connections", "connections.html"],
      ["Join us", "join.html"]
    ];

    const current = page || "home";

    const navLinks = nav
      .map(([label, href]) => {
        const key = href.replace(".html", "").replace("index", "home");
        const active = key === current ? ' class="active"' : "";
        return `<a${active} href="${href}">${label}</a>`;
      })
      .join("");

    const header = `
      <header class="site-header">
        <div class="container nav-wrap">
          <div class="brand-group">
            <a
              class="insait-logo-link"
              href="https://insait.ai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="INSAIT Homepage"
            >
              <img
                src="assets/img/insait-logo.png"
                alt="INSAIT"
                class="insait-logo"
              />
            </a>

            <a class="brand" href="index.html" aria-label="${data.lab.name}">
              <span>${data.lab.shortName}</span>
            </a>
          </div>
          <button class="menu-button" aria-label="Toggle navigation">Menu</button>
          <nav class="nav">${navLinks}</nav>
        </div>
      </header>
    `;
    document.body.insertAdjacentHTML("afterbegin", header);

    const menuButton = document.querySelector(".menu-button");
    const navElement = document.querySelector(".nav");
    if (menuButton && navElement) {
      menuButton.addEventListener("click", () => navElement.classList.toggle("open"));
      navElement.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => navElement.classList.remove("open"));
      });
    }
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    const footer = `
      <footer class="site-footer">
        <div class="container footer-wrap">
          <div>
            <strong>${data.lab.name}</strong><br/>
            <span>${data.lab.institution}</span>
          </div>
          <div class="footer-links">
            <a href="mailto:${data.lab.email}">${data.lab.email}</a>
            <span>·</span>
            <a href="join.html">Join the lab</a>
          </div>
          <div>© <span id="year">${year}</span> ${data.lab.shortName}</div>
        </div>
      </footer>
    `;
    document.body.insertAdjacentHTML("beforeend", footer);
  }

  function revealOnScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
  }

  function renderHome() {
    const main = document.getElementById("page-root");
    const stats = data.lab.stats
      .map((item) => `<li><strong>${item.value}</strong><span>${item.label}</span></li>`)
      .join("");

    const bullets = data.lab.homeBullets
      .map((item) => `<li>${item}</li>`)
      .join("");

    main.innerHTML = `
      <section class="hero container reveal visible">
        <div class="hero-copy">
          <div class="hero-brand-block">
            <span class="eyebrow">Academic · Creative · Open</span>
            <a
              class="hero-affiliation"
              href="https://insait.ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="assets/img/insait-logo.png"
                alt="INSAIT"
                class="hero-insait-logo"
              />
            </a>
          </div>
          <h1>${data.lab.name}</h1>
          <p class="hero-tagline">${data.lab.tagline}</p>
          <p class="hero-text">${data.lab.homeIntro}</p>
          <div class="hero-actions">
            <a class="button primary" href="projects.html">Explore Projects</a>
            <a class="button secondary" href="join.html">Work With Us</a>
          </div>
          <ul class="mini-stats">${stats}</ul>
        </div>
        <aside class="hero-panel">
          <div class="hero-card">
            <img src="assets/img/cover.png" alt="Lab illustration"/>
            <div class="hero-card-body">
              <p class="eyebrow light">Institution</p>
              <h2>${data.lab.institution}</h2>
              <p>${data.lab.location}</p>
              <ul class="clean-list">${bullets}</ul>
            </div>
          </div>
        </aside>
      </section>

      <section class="section">
        <div class="container section-head reveal">
          <span class="eyebrow">Research Themes</span>
          <h2>What we study</h2>
        </div>
        <div class="container topic-grid">
          <article class="card reveal">
            <h3>Reliable AI</h3>
            <p>Reasoning, safety, factuality, and empathy of LLMs and agentic systems.</p>
          </article>
          <article class="card reveal delay-1">
            <h3>Digital Divisions</h3>
            <p>Personal digital divisions simulating users to enhance productivity and human well-being.</p>
          </article>
          <article class="card reveal delay-2">
            <h3>Continual Learning</h3>
            <p>Enable models and systems with lifelong learning.</p>
          </article>
          <article class="card reveal">
            <h3>AI for Good</h3>
            <p>AI applications for medical and financial domains.</p>
          </article>
        </div>
      </section>

      <section class="section">
        <div class="container section-head reveal">
          <span class="eyebrow">Visitor Map</span>
          <h2>Where visitors come from</h2>
        </div>
        <div class="container card map-card reveal">
          <div class="map-shell">
            <div class="widget-slot" id="visitor-widget-slot" aria-live="polite"></div>
          </div>
        </div>
      </section>
    `;

    mountVisitorMap();
  }

  function mountVisitorMap() {
    const slot = document.getElementById("visitor-widget-slot");
    if (!slot) return;

    slot.innerHTML = `
      <div class="flat-map-frame">
        <div class="flat-map-host" id="flat-map-host"></div>
      </div>
    `;

    const host = document.getElementById("flat-map-host");
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "mapmyvisitors";
    script.src = data.lab.mapWidgetSrc;
    script.async = true;
    host.appendChild(script);
  }

  function renderPeople() {
    const main = document.getElementById("page-root");
    const visitingPeople = data.people.visiting || data.people.collaborators || [];
    const sections = [
      ["Faculty", data.people.faculty || [], "Core research leadership and mentorship."],
      ["PhD Candidates", data.people.phd || [], "Doctoral researchers building the lab’s long-term research agenda."],
      ["Explorers", data.people.explorer || [], "Students exploring new questions, prototypes, and directions."],
      ["SURF Students", data.people.surf || [], "Summer Undergraduate Research Fellowship (SURF)."],
      ["Visiting Researchers", data.people.visiting || [], "Visiting and collaborating students across institutions."],
      ["Collaborators", data.people.collaborator || [], "Collaborative and associated senior staff across institutions."]
    ].filter(([, people]) => Array.isArray(people) && people.length > 0);

    const renderWebsite = (person) => {
      if (!person.website || person.website === "#") return "";
      return `<a class="person-homepage" href="${person.website}" target="_blank" rel="noopener noreferrer">Homepage ↗</a>`;
    };

    const renderPersonCard = (person, idx) => {
      const hasWebsite = !!(person.website && person.website !== "#");
      const imageHtml = hasWebsite
        ? `<a class="person-img-link" href="${person.website}" target="_blank" rel="noopener noreferrer"><img src="${person.image}" alt="${person.name}" loading="lazy" /></a>`
        : `<div class="person-img-link"><img src="${person.image}" alt="${person.name}" loading="lazy" /></div>`;
      const nameHtml = hasWebsite
        ? `<a class="person-name-link" href="${person.website}" target="_blank" rel="noopener noreferrer">${person.name}</a>`
        : person.name;

      return `
        <article class="card person-card reveal delay-${idx % 3}">
          <div class="person-media">${imageHtml}</div>
          <div class="person-content">
            <div class="person-heading">
              <h3>${nameHtml}</h3>
              <p class="person-role">${person.role || ""}</p>
            </div>
            <div class="tag-row person-tags">
              ${(person.interests || []).map((it) => `<span class="tag compact-tag">${it}</span>`).join("")}
            </div>
            <div class="person-links">
              ${person.email ? `<a class="inline-link" href="mailto:${person.email}">${person.email}</a>` : ""}
              ${renderWebsite(person)}
            </div>
          </div>
        </article>
      `;
    };

    main.innerHTML = `
      <section class="page-hero container reveal visible page-hero-compact">
        <span class="eyebrow">People</span>
        <h1>Meet the lab</h1>
        <p>Our community brings together faculty, doctoral researchers, explorers, and close collaborators who enjoy careful thinking and ambitious experimentation.</p>
      </section>
      ${sections
        .map(
          ([title, people, description]) => `
            <section class="section section-people-block">
              <div class="container section-head reveal section-head-slim">
                <span class="eyebrow light">${people.length} people</span>
                <h2>${title}</h2>
                <p>${description}</p>
              </div>
              <div class="container people-grid">
                ${people.map((person, idx) => renderPersonCard(person, idx)).join("")}
              </div>
            </section>
          `
        )
        .join("")}
    `;
  }

  function renderPapers() {
    const main = document.getElementById("page-root");
    const groups = {};
    data.papers.forEach((paper) => {
      if (!groups[paper.year]) groups[paper.year] = [];
      groups[paper.year].push(paper);
    });

    main.innerHTML = `
      <section class="page-hero container reveal visible">
        <span class="eyebrow">Papers</span>
        <h1>Published work</h1>
        <p>Selected papers from the lab. Replace placeholder links with project pages, PDF URLs, and citation records as needed.</p>
      </section>
      ${Object.keys(groups)
        .sort((a, b) => Number(b) - Number(a))
        .map(
          (year) => `
          <section class="section">
            <div class="container section-head reveal">
              <h2>${year}</h2>
            </div>
            <div class="container paper-list">
              ${groups[year]
                .map(
                  (paper) => `
                    <article class="card paper-entry reveal">
                      <div class="paper-main">
                        <h3>${paper.title}</h3>
                        <p class="paper-authors">${paper.authors}</p>
                        <p class="paper-venue">${paper.venue}</p>
                      </div>
                      <div class="paper-side">
                        <div class="tag-row">
                          ${paper.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                        </div>
                        <a class="button tertiary" href="${paper.link}">Details</a>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>
          </section>
        `
        )
        .join("")}
    `;
  }

  function renderNews() {
    const main = document.getElementById("page-root");
    main.innerHTML = `
      <section class="page-hero container reveal visible">
        <span class="eyebrow">News</span>
        <h1>Latest updates</h1>
        <p>Highlights from publications, visits, awards, demos, and everything that keeps the lab lively.</p>
      </section>
      <section class="section">
        <div class="container timeline">
          ${data.news
            .map(
              (item, idx) => `
                <article class="timeline-item reveal delay-${idx % 3}">
                  <div class="timeline-dot"></div>
                  <div class="card timeline-content">
                    <span class="timeline-date">${item.date}</span>
                    <span class="chip">${item.category}</span>
                    <h3>
                      ${
                        item.link
                          ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>`
                          : item.title
                      }
                    </h3>
                    <p>${item.description}</p>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderProjects() {
  const projectCards = (items, kind) =>
    items
      .map(
        (item, idx) => `
          <article class="card project-card reveal delay-${idx % 3}">
            <div class="project-top">
              <h3>${item.name}</h3>
              <span class="chip">${item.status}</span>
            </div>
            <p>${item.summary}</p>
            ${
              kind === "seek"
                ? `
                  ${item.stack ? `<div class="tag-row">${item.stack.map((x) => `<span class="tag">${x}</span>`).join("")}</div>` : ""}
                  ${item.link ? `<a class="button tertiary" href="${item.link}">Learn more</a>` : ""}
                `
                : `
                  ${item.milestones ? `<ul class="clean-list">${item.milestones.map((m) => `<li>${m}</li>`).join("")}</ul>` : ""}
                `
            }
          </article>
        `
      )
      .join("");

  const main = document.getElementById("page-root");
  main.innerHTML = `
    <section class="page-hero container reveal visible">
      <span class="eyebrow">Projects</span>
      <h1>Active research and collaboration opportunities</h1>
      <p>We pursue ongoing research projects and also welcome collaborators on selected topics where shared expertise can accelerate progress.</p>
    </section>

    <section class="section">
      <div class="container section-head reveal">
        <h2>Ongoing projects</h2>
      </div>
      <div class="container project-grid">${projectCards(data.projects.ongoing || [], "ongoing")}</div>
    </section>

    <section class="section">
      <div class="container section-head reveal">
        <h2>Seeking collaborators</h2>
      </div>
      <div class="container project-grid">${projectCards(data.projects.seekcollaborators || [], "seek")}</div>
    </section>
  `;
}

  function renderActivities() {
    const main = document.getElementById("page-root");
    main.innerHTML = `
      <section class="page-hero container reveal visible">
        <span class="eyebrow">Activities</span>
        <h1>Research with warmth</h1>
        <p>We aim for a culture that is serious about ideas and cheerful about collaboration. Retreats, reading groups, demos, and community events keep the lab connected.</p>
      </section>
      <section class="section">
        <div class="container activity-grid">
          ${data.activities
            .map((activity, idx) => {
              const cardInner = `
                <img src="${activity.image}" alt="${activity.title}" />
                <div class="activity-copy">
                  <h3>${activity.title}</h3>
                  <p>${activity.caption}</p>
                </div>
              `;

              if (activity.link) {
                return `
                  <a class="card activity-card activity-link reveal delay-${idx % 3}" href="${activity.link}">
                    ${cardInner}
                  </a>
                `;
              }

              return `
                <article class="card activity-card reveal delay-${idx % 3}">
                  ${cardInner}
                </article>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  function renderMemory() {
    const main = document.getElementById("page-root");
    main.innerHTML = `
      <section class="page-hero container reveal visible">
        <span class="eyebrow">Group Memory</span>
        <h1>Moments we keep</h1>
        <p>A shared archive of visits, talks, conferences, celebrations, and everyday lab moments.</p>
      </section>

      <section class="section">
        <div class="container memory-list">
          ${(data.memoryRecords || [])
            .map(
              (item, idx) => `
                <article class="card memory-item reveal delay-${idx % 3}">
                  <div class="memory-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy" />
                  </div>
                  <div class="memory-copy">
                    <span class="timeline-date">${item.date}</span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }
  // function renderConnections() {
  //   const main = document.getElementById("page-root");
  //   main.innerHTML = `
  //     <section class="page-hero container reveal visible">
  //       <span class="eyebrow">Connections</span>
  //       <h1>Organizations we work with</h1>
  //       <p>Our collaborations cross academia, industry, and open-source communities. We value partnerships that strengthen research quality and broaden real-world impact.</p>
  //     </section>
  //     <section class="section">
  //       <div class="container connections-grid">
  //         ${data.connections
  //           .map(
  //             (item, idx) => `
  //               <article class="card connection-card reveal delay-${idx % 3}">
  //                 <div class="connection-mark">${item.name.slice(0, 2).toUpperCase()}</div>
  //                 <div>
  //                   <h3>${item.name}</h3>
  //                   <p>${item.type}</p>
  //                 </div>
  //               </article>
  //             `
  //           )
  //           .join("")}
  //       </div>
  //     </section>
  //   `;
  // }

  function renderJoin() {
    const main = document.getElementById("page-root");
    main.innerHTML = `
      <section class="page-hero container reveal visible">
        <span class="eyebrow">Join us</span>
        <h1>Work with the lab</h1>
        <p>We welcome self-motivated students and collaborators who are interested in NLP and AI research. Reach out with a short introduction, research interests, desired positions and CV.</p>
      </section>

      <section class="section">
        <div class="container">
          <article class="card join-why-card reveal">
            <h2>${data.recruit.whyJoin.title}</h2>

            <div class="join-why-images">
              ${data.recruit.whyJoin.images
                .map(
                  (item) => `
                    <div class="join-why-image">
                      <img src="${item.src}" alt="${item.alt}" loading="lazy" />
                    </div>
                  `
                )
                .join("")}
            </div>

            <ul class="clean-list join-why-list">
              ${data.recruit.whyJoin.bullets.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </article>
        </div>

        <div class="container join-stack">
          <article class="card join-card reveal">
            <h2>Opportunities</h2>
            <ul class="clean-list">
              ${data.recruit.regular.map((item) => `<li>${item}</li>`).join("")}
            </ul>
            <div class="contact-panel">
              <p><strong>Contact</strong></p>
              <a class="inline-link" href="mailto:${data.lab.email}">${data.lab.email}</a>
              <p>${data.lab.address}</p>
            </div>
          </article>

          <article class="card urgent-card reveal delay-1">
            <h2>Openings</h2>
            <div class="urgent-list urgent-list-grid">
              ${data.recruit.urgent
                .map(
                  (item) => `
                    <section class="urgent-item">
                      <h3>${item.title}</h3>
                      <p>${item.summary}</p>
                      <div class="tag-row">
                        ${item.needs.map((x) => `<span class="tag">${x}</span>`).join("")}
                      </div>
                      <a class="inline-link" href="mailto:${item.contact}">${item.contact}</a>
                    </section>
                  `
                )
                .join("")}
            </div>
          </article>
        </div>
      </section>
    `;
  }


  renderHeader();
  renderFooter();

  switch (page) {
    case "people":
      renderPeople();
      break;
    case "papers":
      renderPapers();
      break;
    case "news":
      renderNews();
      break;
    case "projects":
      renderProjects();
      break;
    case "activities":
      renderActivities();
      break;
    case "memory":
      renderMemory();
      break;
    // case "connections":
    //   renderConnections();
    //   break;
    case "join":
      renderJoin();
      break;
    default:
      renderHome();
      break;
  }

  revealOnScroll();
})();