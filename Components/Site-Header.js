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
    //this.setupEventListeners();
  }

  // setupEventListeners() {
  //   const menuButton = this.shadowRoot.querySelector(".mobile-menu-button");
  //   menuButton.addEventListener("click", () => {
  //     const mobileMenu = this.shadowRoot.querySelector(".mobile-menu");
  //     mobileMenu.classList.toggle("hidden");

  //     // Toggle menu icon
  //     const menuIcon = this.shadowRoot.querySelector(".menu-icon");
  //     const closeIcon = this.shadowRoot.querySelector(".close-icon");
  //     menuIcon.classList.toggle("hidden");
  //     closeIcon.classList.toggle("hidden");
  //   });
  // }

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
          padding-left: 30px;
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
   
      </style>
      <header class="header">
        <nav class="nav-container">
          <div class="nav-content">
            <a href="http://ear-project.netlify.app" class="logo">${siteName}</a>
          </div>

        </nav>
      </header>

    `;
  }
}

// Register the custom element
customElements.define("site-header", SiteHeader);
