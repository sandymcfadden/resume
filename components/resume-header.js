/**
 * <resume-header> - Header component displaying name and contact info
 */

class ResumeHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['name', 'email', 'phone', 'url', 'location'];
  }

  connectedCallback() {
    this.render();
    this.setupAnimation();
  }

  setupAnimation() {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const header = this.shadowRoot.querySelector('header');
    if (header) {
      header.classList.add('animate-in');
    }
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  render() {
    const name = this.getAttribute('name') || '';
    const email = this.getAttribute('email') || '';
    const phone = this.getAttribute('phone') || '';
    const url = this.getAttribute('url') || '';
    const location = this.getAttribute('location') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        header {
          padding: var(--spacing-md);
          text-align: center;
          opacity: 0;
          transform: translateY(-10px);
        }

        header.animate-in {
          animation: fadeInDown var(--animation-duration) ease-out forwards;
        }

        @keyframes fadeInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          header {
            opacity: 1;
            transform: none;
          }

          header.animate-in {
            animation: none;
          }
        }

        h1 {
          margin: 0 0 var(--spacing-sm) 0;
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid var(--color-border);
          font-size: var(--font-size-xxl);
          color: var(--color-text);
        }

        .contact-info {
          margin: 0;
          font-size: var(--font-size-base);
          color: var(--color-text);
        }

        a {
          color: var(--color-accent);
          text-decoration: none;
          transition: background-color var(--transition-medium), color var(--transition-medium);
          padding: 2px 4px;
          border-radius: var(--border-radius-sm);
        }

        a:hover {
          background-color: var(--color-accent);
          color: var(--color-accent-hover);
          opacity: 0.8;
        }

        a:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        .print-only {
          display: none;
        }

        @media print {
          header {
            margin-top: 0;
            padding-top: 0;
          }

          h1 {
            font-size: 1.8em;
          }

          a {
            color: var(--color-text);
            background: none;
          }

          .print-only {
            display: inline;
          }

          .screen-only {
            display: none;
          }
        }
      </style>

      <header>
        <h1>${name}</h1>
        <p class="contact-info">
          ${location} - ${phone} -
          <a href="mailto:${email}" class="screen-only">${email}</a>
          <span class="print-only">${email}</span> -
          <a href="${url}" class="screen-only">${url}</a>
          <span class="print-only">${url}</span>
        </p>
      </header>
    `;
  }
}

customElements.define('resume-header', ResumeHeader);
