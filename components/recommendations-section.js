/**
 * <recommendations-section> - Container for all recommendations
 *
 * Displays a list of recommendation cards
 * Screen-only visibility (hidden on print)
 */

class RecommendationsSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['recommendations'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  get recommendations() {
    try {
      return JSON.parse(this.getAttribute('recommendations') || '[]');
    } catch (e) {
      console.error('Error parsing recommendations:', e);
      return [];
    }
  }

  render() {
    const recommendations = this.recommendations;

    if (recommendations.length === 0) {
      this.shadowRoot.innerHTML = '';
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        section {
          margin-bottom: var(--spacing-lg);
        }

        h2 {
          font-size: var(--font-size-xl);
          margin: 0 0 var(--spacing-lg) 0;
          color: var(--color-text);
          letter-spacing: var(--letter-spacing-heading);
          text-align: left;
        }

        @media screen {
          h2 {
            font-family: var(--font-family-heading);
          }
        }

        .recommendations-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          align-items: stretch;
        }

        @media (min-width: 768px) {
          .recommendations-list {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-lg);
          }
        }

        recommendation-card {
          display: flex;
          flex-direction: column;
        }

        @media print {
          :host {
            display: none;
          }
        }
      </style>

      <section>
        <h2>Recommendations</h2>
        <div class="recommendations-list">
          ${this.renderRecommendations()}
        </div>
      </section>
    `;
  }

  renderRecommendations() {
    return this.recommendations
      .map(rec => `
        <recommendation-card
          data='${JSON.stringify(rec).replace(/'/g, '&apos;')}'
        ></recommendation-card>
      `)
      .join('');
  }
}

customElements.define('recommendations-section', RecommendationsSection);
