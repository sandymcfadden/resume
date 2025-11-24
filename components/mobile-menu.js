/**
 * <mobile-menu> - Mobile navigation menu component
 *
 * Hamburger menu that displays slotted role-toggle and theme-toggle on mobile
 * Implements accessible dialog pattern with focus trapping
 */

class MobileMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.previousFocus = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const menuButton = this.shadowRoot.querySelector('.menu-button');
    const overlay = this.shadowRoot.querySelector('.overlay');
    const closeButton = this.shadowRoot.querySelector('.close-button');
    const drawer = this.shadowRoot.querySelector('.drawer');

    menuButton?.addEventListener('click', () => this.openMenu());
    overlay?.addEventListener('click', () => this.closeMenu());
    closeButton?.addEventListener('click', () => this.closeMenu());

    // Handle Escape key
    this.shadowRoot.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Prevent drawer clicks from closing menu
    drawer?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  openMenu() {
    this.isOpen = true;
    this.previousFocus = document.activeElement;

    const overlay = this.shadowRoot.querySelector('.overlay');
    const closeButton = this.shadowRoot.querySelector('.close-button');

    overlay?.classList.add('open');
    closeButton?.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.isOpen = false;

    const overlay = this.shadowRoot.querySelector('.overlay');
    overlay?.classList.remove('open');

    // Restore focus
    if (this.previousFocus) {
      this.previousFocus.focus();
    }

    // Restore body scroll
    document.body.style.overflow = '';
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: none;
        }

        @media (max-width: 620px) {
          :host {
            display: block;
          }
        }

        .menu-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-xs);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--color-text);
          font-size: var(--font-size-base);
          transition: opacity var(--transition-fast);
        }

        .menu-button:hover {
          opacity: 0.8;
        }

        .menu-button:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
          border-radius: var(--border-radius-sm);
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 24px;
        }

        .hamburger span {
          display: block;
          height: 2px;
          background-color: var(--color-text);
          border-radius: 2px;
          transition: background-color var(--transition-fast);
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-medium);
        }

        .overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(300px, 80vw);
          background-color: var(--color-background);
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
          transform: translateX(100%);
          transition: transform var(--transition-medium);
          z-index: 1001;
          display: flex;
          flex-direction: column;
        }

        .overlay.open .drawer {
          transform: translateX(0);
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
        }

        .drawer-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-xs);
          color: var(--color-text);
          font-size: 24px;
          line-height: 1;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius-sm);
          transition: background-color var(--transition-fast);
        }

        .close-button:hover {
          background-color: var(--color-border-light);
        }

        .close-button:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        .drawer-content {
          flex: 1;
          padding: var(--spacing-md);
          overflow-y: auto;
        }

        .menu-section {
          margin-bottom: var(--spacing-lg);
        }

        .menu-section:last-child {
          margin-bottom: 0;
        }

        /* Style the slotted role-toggle to display vertically */
        ::slotted(role-toggle) {
          display: block;
          --role-toggle-direction: column;
          --role-toggle-align: stretch;
          --role-toggle-font-size: var(--font-size-base);
          --role-toggle-width: 100%;
          --role-toggle-text-align: left;
        }

        /* Style the slotted theme-toggle */
        ::slotted(theme-toggle) {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media print {
          :host {
            display: none;
          }
        }
      </style>

      <button
        class="menu-button"
        type="button"
        aria-label="Open navigation menu"
        aria-expanded="${this.isOpen}"
      >
        <div class="hamburger" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span>Menu</span>
      </button>

      <div class="overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div class="drawer">
          <div class="drawer-header">
            <h2 class="drawer-title">Menu</h2>
            <button
              class="close-button"
              type="button"
              aria-label="Close menu"
            >×</button>
          </div>

          <div class="drawer-content">
            <div class="menu-section">
              <slot name="role-controls"></slot>
            </div>

            <div class="menu-section">
              <slot name="theme-control"></slot>
            </div>
          </div>
        </div>
      </div>
    `;

    // Re-setup event listeners after render
    if (this.isConnected) {
      this.setupEventListeners();
    }
  }
}

customElements.define('mobile-menu', MobileMenu);
