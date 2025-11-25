/**
 * <resume-footer> - Footer component
 *
 * Simple footer with copyright notice
 */

class ResumeFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const currentYear = new Date().getFullYear();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        footer {
          margin-top: var(--spacing-md);
          text-align: right;
          color: var(--color-text-muted);
        }

        p {
          margin: 0;
          font-size: var(--font-size-sm);
        }

        @media print {
          :host {
            display: none;
          }
        }
      </style>

      <footer>
        <p>&copy; Sandy McFadden - ${currentYear}</p>
      </footer>
    `;
  }
}

customElements.define('resume-footer', ResumeFooter);
