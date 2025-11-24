/**
 * <company-group> - Company group container for multiple positions
 *
 * Groups consecutive work entries with the same company name
 * Displays company header with overall date range
 * Contains multiple position sub-entries
 */

import { formatDate, formatDateRange } from '../utils/date-formatter.js';

class CompanyGroup extends HTMLElement {
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
      console.error('Error parsing company group data:', e);
      return {};
    }
  }

  get currentRole() {
    return this.getAttribute('current-role') || 'all';
  }

  render() {
    const data = this.data;

    if (!data.company || !data.positions || data.positions.length === 0) {
      this.style.display = 'none';
      return;
    }

    this.style.display = 'block';

    // Calculate overall date range
    const startDate = data.overallStartDate || data.positions[data.positions.length - 1]?.startDate;
    const endDate = data.overallEndDate || data.positions[0]?.endDate;
    const dateRange = formatDateRange(startDate, endDate);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          padding-bottom: var(--spacing-lg);
          margin-left: calc(-1 * var(--spacing-lg));
          padding-left: var(--spacing-lg);
        }

        /* Timeline dot for company */
        .timeline-dot {
          position: absolute;
          left: -6px;
          top: 6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--color-timeline-dot);
          border: 2px solid var(--color-background);
          z-index: 1;
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

        .company-header {
          margin-bottom: var(--spacing-md);
        }

        .company-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--spacing-md);
        }

        .company-name {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          margin: 0;
          color: var(--color-text);
        }

        .company-url {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          margin: var(--spacing-xs) 0 0 0;
        }

        .company-dates {
          font-size: var(--font-size-base);
          color: var(--color-text);
          text-align: right;
          flex-shrink: 0;
        }

        .positions {
          margin-left: var(--spacing-lg);
          padding-left: var(--spacing-md);
          border-left: 2px solid var(--color-border-light);
        }

        .position {
          position: relative;
          margin-bottom: var(--spacing-lg);
        }

        .position:last-child {
          margin-bottom: 0;
        }

        /* Position-level timeline dot (mini timeline) */
        .position-dot {
          position: absolute;
          left: calc(-1 * var(--spacing-md) - 5px);
          top: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--color-timeline-dot);
          border: 2px solid var(--color-background);
          z-index: 1;
        }

        .position-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-sm);
        }

        .position-title-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .position-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          margin: 0;
          color: var(--color-text);
        }

        .position-link {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
        }

        .position-dates {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          text-align: right;
          flex-shrink: 0;
        }

        .position-description p {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--color-text);
          line-height: var(--line-height);
        }

        .position-description ul {
          margin: 0;
          padding-left: var(--spacing-md);
        }

        .position-description li {
          margin-bottom: var(--spacing-xs);
          line-height: var(--line-height);
        }

        .position-description li:last-child {
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

        @media (max-width: 620px) {
          :host {
            margin-left: calc(-1 * var(--spacing-md));
            padding-left: var(--spacing-md);
          }

          .positions {
            margin-left: 0;
            padding-left: var(--spacing-sm);
          }

          .company-main,
          .position-header {
            flex-direction: column;
            gap: var(--spacing-xs);
          }

          .company-dates,
          .position-dates {
            text-align: left;
          }
        }

        @media print {
          :host {
            margin-left: 0;
            padding-left: 0;
          }

          .timeline-dot {
            display: none;
          }

          .positions {
            margin-left: 0;
            padding-left: 0;
            border-left: none;
          }

          .position-dot {
            display: none;
          }

          a {
            color: var(--color-text);
            background: none;
          }
        }
      </style>

      <div class="timeline-dot" aria-hidden="true"></div>

      <div class="company-header">
        <div class="company-main">
          <div>
            <h3 class="company-name">${data.company}</h3>
            ${data.url ? `<p class="company-url"><a href="${data.url}">${data.url}</a></p>` : ''}
          </div>
          <p class="company-dates">${dateRange}</p>
        </div>
      </div>

      <div class="positions">
        ${data.positions.map(position => this.renderPosition(position)).join('')}
      </div>
    `;
  }

  renderPosition(position) {
    const dateRange = formatDateRange(position.startDate, position.endDate);

    return `
      <div class="position">
        <div class="position-dot" aria-hidden="true"></div>
        <div class="position-header">
          <div class="position-title-group">
            <h4 class="position-title">${position.position}</h4>
            ${position.productUrl ? `<a href="${position.productUrl}" class="position-link">${position.productUrl}</a>` : ''}
          </div>
          <p class="position-dates">${dateRange}</p>
        </div>
        ${position.summary || position.highlights ? `
          <div class="position-description">
            ${position.summary ? `<p>${position.summary}</p>` : ''}
            ${position.highlights && position.highlights.length > 0 ? `
              <ul>
                ${position.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('company-group', CompanyGroup);
