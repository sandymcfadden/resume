/**
 * <work-entry> - Work experience entry component
 *
 * Displays a single work experience
 * Handles role relevance (primary/secondary/hidden)
 * Includes timeline dot indicator
 */

import { formatDateRange } from '../utils/date-formatter.js';

class WorkEntry extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['data', 'current-role'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  get data() {
    try {
      const dataStr = this.getAttribute('data') || '{}';
      return JSON.parse(dataStr);
    } catch (e) {
      console.error('Error parsing work entry data:', e);
      return {};
    }
  }

  get currentRole() {
    return this.getAttribute('current-role') || 'all';
  }

  get relevance() {
    const data = this.data;
    if (!data.roleRelevance) return 'secondary';
    return data.roleRelevance[this.currentRole] || 'secondary';
  }

  shouldDisplay() {
    return this.relevance !== 'hidden';
  }

  render() {
    const data = this.data;
    const relevance = this.relevance;
    const visible = this.shouldDisplay();

    if (!visible) {
      this.style.display = 'none';
      return;
    }

    this.style.display = 'block';

    const dateRange = formatDateRange(data.startDate, data.endDate);
    const isPrimary = relevance === 'primary';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          padding-bottom: var(--spacing-lg);
          margin-left: calc(-1 * var(--spacing-lg));
          padding-left: var(--spacing-lg);
          transition: opacity var(--transition-medium);
        }

        :host([hidden]) {
          display: none;
        }

        /* Timeline dot */
        .timeline-dot {
          position: absolute;
          left: -7px;
          top: 7px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--color-timeline-dot);
          border: 2px solid var(--color-background);
          z-index: 1;
          transition: all var(--transition-fast);
          transform: scale(0);
        }

        :host(.visible) .timeline-dot {
          animation: scaleIn var(--animation-duration) ease-out forwards;
        }

        @keyframes scaleIn {
          to {
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .timeline-dot {
            transform: scale(1);
          }

          :host(.visible) .timeline-dot {
            animation: none;
          }
        }

        .entry {
          margin-bottom: var(--spacing-md);
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-sm);
          gap: var(--spacing-md);
        }

        .entry-main h3 {
          font-size: var(--font-size-lg);
          margin: 0;
          color: var(--color-text);
          font-weight: ${isPrimary ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)'};
        }

        .entry-info h3 {
          margin: 0;
          font-weight: var(--font-weight-normal);
          color: var(--color-text);
          font-size: var(--font-size-base);
        }

        .entry-main p,
        .entry-info p {
          font-style: italic;
          margin: var(--spacing-xs) 0 0 0;
          color: var(--color-text);
        }

        .entry-info {
          text-align: right;
          flex-shrink: 0;
        }

        .entry-description {
          color: var(--color-text);
          line-height: var(--line-height);
        }

        .entry-description p {
          margin: 0 0 var(--spacing-sm) 0;
        }

        .entry-description ul {
          margin: var(--spacing-sm) 0;
          padding-left: var(--spacing-md);
        }

        .entry-description li {
          margin-bottom: var(--spacing-xs);
        }

        .entry-description li:last-child {
          margin-bottom: 0;
        }

        a {
          color: var(--color-accent);
          text-decoration: none;
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

        @media (max-width: 620px) {
          :host {
            margin-left: calc(-1 * var(--spacing-md));
            padding-left: var(--spacing-md);
          }

          .timeline-dot {
            left: -6px;
          }

          .entry-header {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .entry-info {
            text-align: left;
          }

          .entry-info h3,
          .entry-info p {
            font-weight: var(--font-weight-normal);
            font-size: var(--font-size-base);
            margin: 0;
          }

          .entry-main p {
            margin: 0;
          }
        }

        @media print {
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

      <div class="timeline-dot" aria-hidden="true"></div>

      <div class="entry">
        <div class="entry-header">
          <div class="entry-main">
            <h3>${data.name || ''}</h3>
            <p>${data.position || ''}</p>
          </div>
          <div class="entry-info">
            ${data.location ? `<h3>${data.location}</h3>` : ''}
            <p>${dateRange}</p>
          </div>
        </div>

        ${data.summary || data.highlights ? `
          <div class="entry-description">
            ${data.summary ? `<p>${data.summary}</p>` : ''}
            ${data.highlights && data.highlights.length > 0 ? `
              <ul>
                ${data.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('work-entry', WorkEntry);
