/**
 * <additional-experience> - Condensed list of additional work experience
 *
 * Displays less relevant work entries in a compact list format
 */

import { formatDateRange } from '../utils/date-formatter.js';
import { createScrollObserver } from '../utils/scroll-observer.js';

class AdditionalExperience extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['entries'];
  }

  connectedCallback() {
    this.render();
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupIntersectionObserver() {
    this.observer = createScrollObserver(
      this,
      () => {
        const section = this.shadowRoot.querySelector('.additional-experience');
        if (section) {
          section.classList.add('visible');
        }
      }
    );
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  get entries() {
    try {
      return JSON.parse(this.getAttribute('entries') || '[]');
    } catch (e) {
      console.error('Error parsing additional experience entries:', e);
      return [];
    }
  }

  render() {
    const entries = this.entries;

    if (entries.length === 0) {
      this.style.display = 'none';
      return;
    }

    this.style.display = 'block';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: var(--spacing-md);
        }

        .additional-experience {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity var(--animation-duration) ease-out,
                      transform var(--animation-duration) ease-out;
        }

        .additional-experience.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .additional-experience {
            opacity: 1;
            transform: none;
          }
        }

        h2 {
          font-size: var(--font-size-lg);
          margin: 0 0 var(--spacing-md) 0;
          color: var(--color-text);
        }

        ul {
          margin: 0;
          padding-left: var(--spacing-md);
          list-style-type: disc;
        }

        li {
          margin-bottom: var(--spacing-sm);
          line-height: var(--line-height);
          color: var(--color-text);
        }

        li:last-child {
          margin-bottom: 0;
        }

        strong {
          font-weight: var(--font-weight-semibold);
        }

        @media print {
          .additional-experience {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      </style>

      <div class="additional-experience">
        <h2>Additional Experience</h2>
        <ul>
          ${entries.map(entry => `
            <li>
              <strong>${entry.name}</strong> - ${entry.position}${entry.location ? `, ${entry.location}` : ''} (${formatDateRange(entry.startDate, entry.endDate)})${entry.summary ? ` - ${entry.summary}` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    // Re-setup observer after render
    if (this.isConnected && !this.observer) {
      setTimeout(() => this.setupIntersectionObserver(), 0);
    }
  }
}

customElements.define('additional-experience', AdditionalExperience);
