/**
 * <recommendations-section> - Container for all recommendations
 *
 * Displays a list of recommendation cards in a masonry layout
 * Screen-only visibility (hidden on print)
 */

class RecommendationsSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.resizeObserver = null;
  }

  static get observedAttributes() {
    return ['recommendations'];
  }

  connectedCallback() {
    this.render();
    this.setupMasonry();
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
      this.setupMasonry();
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
          position: relative;
        }

        recommendation-card {
          width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          recommendation-card {
            position: absolute;
            width: calc(50% - var(--spacing-lg) / 2);
          }
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

  setupMasonry() {
    // Wait for next frame to ensure cards are rendered
    requestAnimationFrame(() => {
      this.layoutMasonry();

      // Watch for card height changes and window resizes
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }

      this.resizeObserver = new ResizeObserver(() => {
        this.layoutMasonry();
      });

      const cards = this.shadowRoot.querySelectorAll('recommendation-card');
      cards.forEach(card => this.resizeObserver.observe(card));

      // Also listen to window resize
      window.addEventListener('resize', () => this.layoutMasonry());
    });
  }

  layoutMasonry() {
    const container = this.shadowRoot.querySelector('.recommendations-list');
    const cards = Array.from(this.shadowRoot.querySelectorAll('recommendation-card'));

    if (!container || cards.length === 0) return;

    // Check if we're on mobile (single column)
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (isMobile) {
      // On mobile, reset to static positioning
      cards.forEach(card => {
        card.style.position = 'static';
        card.style.left = '';
        card.style.top = '';
      });
      container.style.height = 'auto';
      return;
    }

    // Desktop masonry layout with 2 columns
    const gap = 40; // var(--spacing-lg) is 40px
    const columnHeights = [0, 0]; // Track height of each column

    cards.forEach(card => {
      // Get the actual rendered height of the card
      const cardHeight = card.offsetHeight;

      // Find the shorter column
      const shortestColumn = columnHeights[0] <= columnHeights[1] ? 0 : 1;

      // Position the card
      card.style.position = 'absolute';
      card.style.left = shortestColumn === 0 ? '0' : `calc(50% + ${gap / 2}px)`;
      card.style.top = `${columnHeights[shortestColumn]}px`;

      // Update column height
      columnHeights[shortestColumn] += cardHeight + (columnHeights[shortestColumn] === 0 ? 0 : gap);
    });

    // Set container height to the tallest column
    const maxHeight = Math.max(...columnHeights);
    container.style.height = `${maxHeight}px`;
  }
}

customElements.define('recommendations-section', RecommendationsSection);
