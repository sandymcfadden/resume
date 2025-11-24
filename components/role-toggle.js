/**
 * <role-toggle> - Minimalist role switcher navigation
 *
 * Simple text links for switching between software/support/full views
 * Announces changes for screen readers
 */

class RoleToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['current-role', 'software-label', 'support-label', 'all-label'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
      this.setupEventListeners();
    }
  }

  get currentRole() {
    return this.getAttribute('current-role') || 'all';
  }

  setupEventListeners() {
    const links = this.shadowRoot.querySelectorAll('a[data-role]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const role = link.getAttribute('data-role');
        this.selectRole(role);
      });
    });
  }

  selectRole(role) {
    if (role === this.currentRole) return;

    // Announce change to screen readers
    const announcement = this.shadowRoot.querySelector('.sr-announcement');
    const roleLabels = {
      software: 'Software Engineer',
      support: 'Technical Support Engineer',
      all: 'Full Resume'
    };
    announcement.textContent = `Switched to ${roleLabels[role]} view`;

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('role-change', {
      detail: { role },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        nav {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        a {
          text-decoration: none;
          color: var(--color-text-muted);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: var(--spacing-sm);
          position: relative;
          transition: color var(--transition-fast);
          cursor: pointer;
        }

        a:hover {
          color: var(--color-text);
        }

        a:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        a[aria-current="page"] {
          color: var(--color-text);
        }

        a[aria-current="page"]::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 1px;
          background-color: var(--color-accent);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            width: 0;
          }
          to {
            width: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          a[aria-current="page"]::after {
            animation: none;
          }
        }

        /* Screen reader only announcement area */
        .sr-announcement {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        @media print {
          :host {
            display: none;
          }
        }
      </style>

      <nav role="navigation" aria-label="Resume view selector">
        <a
          href="#"
          data-role="software"
          aria-current="${this.currentRole === 'software' ? 'page' : 'false'}"
        >
          Software Engineer
        </a>

        <a
          href="#"
          data-role="support"
          aria-current="${this.currentRole === 'support' ? 'page' : 'false'}"
        >
          Technical Support Engineer
        </a>

        <a
          href="#"
          data-role="all"
          aria-current="${this.currentRole === 'all' ? 'page' : 'false'}"
        >
          Full Resume
        </a>

        <!-- Screen reader announcement area -->
        <div class="sr-announcement" role="status" aria-live="polite" aria-atomic="true"></div>
      </nav>
    `;

    // Re-setup event listeners after render
    if (this.isConnected) {
      this.setupEventListeners();
    }
  }
}

customElements.define('role-toggle', RoleToggle);
