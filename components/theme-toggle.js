/**
 * <theme-toggle> - theme switcher component
 *
 * Toggles between light and dark themes
 * Emits 'theme-change' event when clicked
 */

class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['theme'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    this.render();
  }

  get theme() {
    return this.getAttribute('theme') || 'dark';
  }

  setupEventListeners() {
    const toggle = this.shadowRoot.querySelector('.toggle');
    toggle.addEventListener('click', () => this.toggleTheme());
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';

    // Dispatch custom event that bubbles up to resume-app
    this.dispatchEvent(new CustomEvent('theme-change', {
      detail: { theme: newTheme },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const isDark = this.theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .toggle {
          position: relative;
          width: 44px;
          height: 24px;
          background-color: ${isDark ? 'var(--color-accent)' : 'var(--color-border-light)'};
          border-radius: 12px;
          cursor: pointer;
          transition: background-color var(--transition-fast);
          border: none;
          padding: 0;
        }

        .toggle:hover {
          opacity: 0.8;
        }

        .toggle:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        .slider {
          position: absolute;
          top: 2px;
          left: ${isDark ? '22px' : '2px'};
          width: 20px;
          height: 20px;
          background-color: var(--color-background);
          border-radius: 50%;
          transition: left var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        svg {
          width: 12px;
          height: 12px;
          fill: ${isDark ? 'var(--color-accent)' : 'var(--color-text-muted)'};
        }

        @media print {
          :host {
            display: none;
          }
        }
      </style>

      <button
        class="toggle"
        type="button"
        role="switch"
        aria-checked="${isDark}"
        aria-label="${label}"
        title="${label}"
      >
        <div class="slider">
          ${isDark ? `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ` : `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/>
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"/>
            </svg>
          `}
        </div>
      </button>
    `;

    // Re-setup event listeners after render
    if (this.isConnected) {
      this.setupEventListeners();
    }
  }
}

customElements.define('theme-toggle', ThemeToggle);
