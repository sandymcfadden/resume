/**
 * <resume-header> - Header component displaying name and contact info
 */

class ResumeHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['name', 'email', 'phone', 'url', 'location', 'image'];
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
    const image = this.getAttribute('image') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        header {
          padding: var(--spacing-md);
          padding-bottom: var(--spacing-lg);
          padding-top: calc(60px + var(--spacing-md));
          text-align: center;
          opacity: 0;
          transform: translateY(-10px);
          border: 1px solid var(--color-border-light);
          border-radius: 1.5em;
          margin-bottom: var(--spacing-lg);
          margin-top: 60px;
          background-color: var(--color-background-secondary);
          position: relative;
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

        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          border: 1px solid var(--color-border-light);
        }

        h1 {
          margin: 0 0 var(--spacing-sm) 0;
          font-size: var(--font-size-xxxl);
          color: var(--color-text);
          letter-spacing: var(--letter-spacing-heading);
        }

        @media screen {
          h1 {
            font-family: var(--font-family-heading);
            border-bottom: none;
          }
        }

        @media (max-width: 620px) {
          h1 {
            font-size: var(--font-size-xxl);
          }
        }

        .contact-info {
          margin: 0;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-light);
          color: var(--color-text);
        }

        a {
          color: var(--color-accent);
          text-decoration: none;
          font-weight: var(--font-weight-semibold);
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

        .profile-image.screen-only {
          display: block;
        }

        @media print {
          header {
            margin-top: 0;
            padding-top: var(--spacing-md);
            border: 0;
            position: static;
          }

          .profile-image.screen-only {
            display: none;
          }

          h1 {
            font-size: 1.8em;
            padding-bottom: var(--spacing-sm);
            border-bottom: 1px solid var(--color-border);
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
        ${image ? `<img src="${image}" alt="${name}" class="profile-image screen-only" />` : ''}
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
