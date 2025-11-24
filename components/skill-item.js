/**
 * <skill-item> - Individual skill display component
 *
 * Displays a single skill with its keywords
 * Can be shown/hidden based on role relevance
 */

class SkillItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['name', 'level', 'keywords', 'visible'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  render() {
    const name = this.getAttribute('name') || '';
    const keywords = this.getAttribute('keywords') || '';
    const visible = this.getAttribute('visible') !== 'false';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: ${visible ? 'block' : 'none'};
          margin-bottom: var(--spacing-md);
          opacity: ${visible ? '1' : '0'};
          transition: opacity var(--transition-medium);
        }

        :host([visible="false"]) {
          display: none;
        }

        .skill-item {
          line-height: var(--line-height);
        }

        strong {
          color: var(--color-text);
          font-weight: var(--font-weight-semibold);
        }

        span {
          color: var(--color-text);
        }
      </style>

      <div class="skill-item">
        <strong>${name}:</strong>
        <span>${keywords}</span>
      </div>
    `;
  }
}

customElements.define('skill-item', SkillItem);
