class NavBar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Inter", system-ui, -apple-system, sans-serif;
        }

        @media print {
          :host { display: none; }
        }

        nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #ffffff;
          border-bottom: 1px solid #e0e0e0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: none;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.15s, border-color 0.15s;
        }

        .back-btn:hover {
          background-color: #f3f4f6;
          border-color: #c0c0c0;
        }

        .back-btn:active {
          background-color: #e5e7eb;
        }

        .back-arrow {
          width: 16px;
          height: 16px;
        }
      </style>

      <nav>
        <button class="back-btn" id="back-btn">
          <svg class="back-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
      </nav>
    `;

    this.shadowRoot.getElementById("back-btn").addEventListener("click", () => {
      if (history.length > 1) {
        history.back();
      } else {
        window.location.href = "/";
      }
    });
  }
}

customElements.define("nav-bar", NavBar);
