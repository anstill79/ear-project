class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["site-name"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const menuButton = this.shadowRoot.querySelector(".mobile-menu-button");
    menuButton.addEventListener("click", () => {
      const mobileMenu = this.shadowRoot.querySelector(".mobile-menu");
      mobileMenu.classList.toggle("hidden");

      // Toggle menu icon
      const menuIcon = this.shadowRoot.querySelector(".menu-icon");
      const closeIcon = this.shadowRoot.querySelector(".close-icon");
      menuIcon.classList.toggle("hidden");
      closeIcon.classList.toggle("hidden");
    });
  }

  render() {
    const siteName = this.getAttribute("site-name") || "Site Name";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 900px;
          margin: auto;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .header {
          background-image: linear-gradient(6deg, #13547a94, #80d0c730);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
          margin: auto;
        }

        .nav-container {
          max-width: 1200px;
          margin: auto;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 4rem;
        }

        .logo {
          font-size: 1.75rem;
          font-weight: bold;
         color: #9d1779f0;
          text-decoration: none;
        }

        .desktop-menu {
          display: none;
        }

        @media (min-width: 768px) {
          .desktop-menu {
            display: flex;
            gap: 2rem;
          }
        }

        .nav-link {
          color: #4B5563;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          transition: color 0.2s, background-color 0.2s;
        }

        .nav-link:hover {
          color: #111827;
          background-color: #F3F4F6;
        }

        .mobile-menu-button {
          display: flex;
          padding: 0.5rem;
          border: none;
          background: none;
          cursor: pointer;
          color: #4B5563;
        }

        @media (min-width: 768px) {
          .mobile-menu-button {
            display: none;
          }
        }

        .mobile-menu {
          padding: 0.5rem 0;
        }

        .mobile-menu:not(.hidden) {
          display: block;
        }

        .hidden {
          display: none;
        }

        .mobile-link {
          display: block;
          padding: 0.5rem 0.75rem;
          color: #4B5563;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
        }

        .mobile-link:hover {
          color: #111827;
          background-color: #F3F4F6;
        }

        /* Menu Icons */
        .menu-icon, .close-icon {
          width: 24px;
          height: 24px;
        }
      </style>
      <header class="header">
        <nav class="nav-container">
          <div class="nav-content">
            <a href="http://ear-project.netlify.app" class="logo">${siteName}</a>

            <div class="desktop-menu">
              <a href="http://ear-project.netlify.app" class="nav-link">Home</a>
            </div>

            <button class="mobile-menu-button" aria-label="Menu">
              <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg class="close-icon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="mobile-menu hidden">
            <a href="#" class="mobile-link">Home</a>
            <a href="#about" class="mobile-link">About</a>
            <a href="#services" class="mobile-link">Services</a>
            <a href="#contact" class="mobile-link">Contact</a>
          </div>
        </nav>
      </header>

    `;
  }
}

// Register the custom element
customElements.define("site-header", SiteHeader);
