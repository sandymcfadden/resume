/**
 * <resume-skills> - Skills container component
 *
 * Displays skills filtered and ordered by current role
 * Groups skills into sections (Technical/Professional)
 */

import { createScrollObserver } from '../utils/scroll-observer.js';

class ResumeSkills extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['skills', 'current-role'];
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
        const section = this.shadowRoot.querySelector('section');
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

  get skills() {
    try {
      return JSON.parse(this.getAttribute('skills') || '[]');
    } catch (e) {
      console.error('Error parsing skills:', e);
      return [];
    }
  }

  get currentRole() {
    return this.getAttribute('current-role') || 'all';
  }

  filterAndSortSkills() {
    const skills = this.skills;
    const role = this.currentRole;

    // Filter and sort by relevance
    return skills
      .map(skill => {
        const relevance = skill.roleRelevance?.[role] || 'secondary';
        return { ...skill, relevance };
      })
      .filter(skill => skill.relevance !== 'hidden')
      .sort((a, b) => {
        // Sort: primary first, then secondary
        const order = { primary: 0, secondary: 1 };
        return (order[a.relevance] || 2) - (order[b.relevance] || 2);
      });
  }

  categorizeSkills(skills) {
    // Separate into technical and professional skills
    const technical = [];
    const professional = [];

    skills.forEach(skill => {
      // Professional skills have "Professional Skills" in the name
      if (skill.name.includes('Professional Skills')) {
        professional.push(skill);
      } else {
        // Everything else is technical (APIs, Languages, Tools, etc.)
        technical.push(skill);
      }
    });

    return { technical, professional };
  }

  renderSkillsList(skills) {
    // Render technical skills as bullet list with "Name: keywords" format
    return `
      <ul>
        ${skills.map(skill => {
          const keywords = skill.keywords ? skill.keywords.join(', ') : '';
          return `<li><strong>${skill.name}:</strong> ${keywords}</li>`;
        }).join('')}
      </ul>
    `;
  }

  renderProfessionalSkills(skills) {
    // For professional skills, display keywords as individual bullet points
    const allKeywords = skills.flatMap(skill => skill.keywords || []);

    if (allKeywords.length === 0) {
      return '';
    }

    return `
      <ul>
        ${allKeywords.map(keyword => `<li>${keyword}</li>`).join('')}
      </ul>
    `;
  }

  render() {
    const filteredSkills = this.filterAndSortSkills();
    const { technical, professional } = this.categorizeSkills(filteredSkills);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        section {
          margin-bottom: var(--spacing-lg);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity var(--animation-duration) ease-out,
                      transform var(--animation-duration) ease-out;
        }

        section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          section {
            opacity: 1;
            transform: none;
          }
        }

        h2 {
          font-size: var(--font-size-xl);
          margin: 0 0 var(--spacing-md) 0;
          color: var(--color-text);
          letter-spacing: var(--letter-spacing-heading);
        }

        @media screen {
          h2 {
            font-family: var(--font-family-heading);
          }
        }

        @media print {
          section {
            opacity: 1 !important;
            transform: none !important;
          }

          h2 {
            padding-bottom: var(--spacing-xs);
            border-bottom: 1px solid var(--color-border);
          }
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
        }

        .skills-section {
          flex: 1;
          min-width: 300px;
        }

        .skills-section h3 {
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
          margin-bottom: var(--spacing-xs);
          line-height: var(--line-height);
          color: var(--color-text);
        }

        li:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 620px) {
          .skills-container {
            gap: 0;
          }

          .skills-section {
            min-width: 100%;
          }

          .skills-section + .skills-section {
            margin-top: var(--spacing-lg);
          }
        }
      </style>

      <section>
        <h2>Skills</h2>
        <div class="skills-container">
          ${technical.length > 0 ? `
            <div class="skills-section">
              <h3>Technical Skills</h3>
              ${this.renderSkillsList(technical)}
            </div>
          ` : ''}

          ${professional.length > 0 ? `
            <div class="skills-section">
              <h3>Professional Skills</h3>
              ${this.renderProfessionalSkills(professional)}
            </div>
          ` : ''}
        </div>
      </section>
    `;

    // Re-setup observer after render
    if (this.isConnected && !this.observer) {
      setTimeout(() => this.setupIntersectionObserver(), 0);
    }
  }
}

customElements.define('resume-skills', ResumeSkills);
