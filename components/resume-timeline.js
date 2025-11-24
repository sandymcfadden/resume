/**
 * <resume-timeline> - Generic timeline container component
 *
 * Creates a vertical timeline layout
 * Used for both work experience and education
 * Handles scroll animations via Intersection Observer
 */

import { prefersReducedMotion } from '../utils/scroll-observer.js';

class ResumeTimeline extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.observer = null;
  }

  static get observedAttributes() {
    return ['type'];
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

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  get type() {
    return this.getAttribute('type') || 'work';
  }

  get title() {
    return this.type === 'work' ? 'Work Experience' : 'Education';
  }

  setupIntersectionObserver() {
    // Only setup if animations are enabled (not reduced motion)
    if (prefersReducedMotion()) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe slotted elements
    const slot = this.shadowRoot.querySelector('slot');
    if (slot) {
      const elements = slot.assignedElements();
      elements.forEach(el => {
        el.classList.add('timeline-entry');
        this.observer.observe(el);
      });
    }
  }

  render() {
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
          margin: 0 0 var(--spacing-md) 0;
          padding-bottom: var(--spacing-xs);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text);
        }

        .timeline {
          position: relative;
          padding-left: var(--spacing-lg);
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-timeline-line);
        }

        ::slotted(*) {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity var(--animation-duration) ease-out,
                      transform var(--animation-duration) ease-out;
        }

        ::slotted(.visible) {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          ::slotted(*) {
            opacity: 1;
            transform: none;
          }
        }

        @media print {
          ::slotted(*) {
            opacity: 1 !important;
            transform: none !important;
          }
        }

        @media (max-width: 620px) {
          .timeline {
            padding-left: var(--spacing-md);
          }
        }
      </style>

      <section>
        <h2>${this.title}</h2>
        <div class="timeline">
          <slot></slot>
        </div>
      </section>
    `;

    // Re-setup observer after render
    if (this.isConnected && !this.observer) {
      setTimeout(() => this.setupIntersectionObserver(), 0);
    }
  }
}

customElements.define('resume-timeline', ResumeTimeline);
