/**
 * <recommendation-card> - Individual recommendation display component
 *
 * Displays a recommendation with profile image, quote, and name
 * Images animate on scroll, following the pattern of other components
 */

import { createScrollObserver } from '../utils/scroll-observer.js';

class RecommendationCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['data'];
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
        const image = this.shadowRoot.querySelector('.profile-image');
        if (image) {
          image.classList.add('visible');
        }
      }
    );
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  get recommendationData() {
    try {
      return JSON.parse(this.getAttribute('data') || '{}');
    } catch (e) {
      console.error('Error parsing recommendation data:', e);
      return {};
    }
  }

  render() {
    const { name = '', image = '', reference = '' } = this.recommendationData;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .card {
          border: 1px solid var(--color-border-light);
          border-radius: 1.5em;
          background-color: var(--color-background-secondary);
          padding: var(--spacing-lg);
          padding-top: calc(50px + var(--spacing-md));
          margin-bottom: var(--spacing-lg);
          margin-top: 50px;
          transition: background-color var(--transition-medium), border-color var(--transition-medium);
          position: relative;
        }
        
        @media (max-width: 768px) {
          .card {
            margin-bottom: calc(2 * var(--spacing-lg));
          }
        }

        .profile-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%) scale(0.8);
          opacity: 0;
          transition: opacity var(--animation-duration) ease-out,
                      transform var(--animation-duration) ease-out;
          border: 1px solid var(--color-border-light);
        }

        .profile-image.visible {
          opacity: 1;
          transform: translateX(-50%) scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-image {
            opacity: 1;
            transform: none;
          }
        }

        .quote {
          color: var(--color-text);
          line-height: var(--line-height);
          margin: 0 0 var(--spacing-md) 0;
          text-align: left;
          white-space: pre-line;
        }

        .name {
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          text-align: center;
          margin: 0;
        }

        @media print {
          :host {
            display: none;
          }
        }
      </style>

      <div class="card">
        <img
          src="${image}"
          alt="${name}"
          class="profile-image"
          loading="lazy"
        />
        <p class="quote">${reference}</p>
        <p class="name">${name}</p>
      </div>
    `;

    // Re-setup observer after render
    if (this.isConnected && !this.observer) {
      setTimeout(() => this.setupIntersectionObserver(), 0);
    }
  }
}

customElements.define('recommendation-card', RecommendationCard);
