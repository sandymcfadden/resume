/**
 * <education-entry> - Education entry component
 *
 * Displays a single education entry
 * Similar styling to work-entry with timeline dot
 */

import { formatYear } from '../utils/date-formatter.js';

class EducationEntry extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['data'];
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
      console.error('Error parsing education entry data:', e);
      return {};
    }
  }

  render() {
    const data = this.data;
    const graduationYear = data.endDate ? `Graduated ${formatYear(data.endDate)}` : '';
    const degree = data.studyType && data.area ? `${data.studyType} of ${data.area}` : (data.studyType || data.area || '');

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

        @media (max-width: 620px) {
          :host {
            margin-left: calc(-1 * var(--spacing-md));
            padding-left: var(--spacing-md);
          }

          .timeline-dot {
            left: -7px;
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
      </style>

      <div class="timeline-dot" aria-hidden="true"></div>

      <div class="entry">
        <div class="entry-header">
          <div class="entry-main">
            <h3>${data.institution || ''}</h3>
            <p>${degree}</p>
          </div>
          <div class="entry-info">
            <h3>${data.location || ''}</h3>
            <p>${graduationYear}</p>
          </div>
        </div>

        ${data.highlights && data.highlights.length > 0 ? `
          <div class="entry-description">
            <ul>
              ${data.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('education-entry', EducationEntry);
