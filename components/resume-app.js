/**
 * <resume-app> - Root application component
 *
 * Responsibilities:
 * - Load and parse resume.json
 * - Manage global state (currentRole, theme, resumeData)
 * - Handle localStorage persistence
 * - Provide data to child components
 * - Handle theme and role change events
 */

const STORAGE_KEYS = {
  theme: 'resume-theme',
  role: 'resume-role'
};

class ResumeApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // State
    this.resumeData = null;
    this.currentRole = 'all';
    this.currentTheme = 'dark';
  }

  async connectedCallback() {
    // Load saved preferences
    this.loadPreferences();

    // Update URL if loaded from query string
    this.updateURL();

    // Apply theme to document root
    this.applyTheme();

    // Load resume data
    await this.loadResumeData();

    // Render component
    this.render();

    // Setup event listeners
    this.setupEventListeners();
  }

  loadPreferences() {
    // Load theme (default to 'dark')
    this.currentTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'dark';

    // Check URL query string first, then localStorage, then default
    const urlParams = new URLSearchParams(window.location.search);
    const urlRole = urlParams.get('role');
    const validRoles = ['software', 'support', 'all'];

    if (urlRole && validRoles.includes(urlRole)) {
      this.currentRole = urlRole;
    } else {
      this.currentRole = localStorage.getItem(STORAGE_KEYS.role) || 'all';
    }
  }

  updateURL() {
    // Update URL without reloading the page
    const url = new URL(window.location);
    url.searchParams.set('role', this.currentRole);
    window.history.pushState({}, '', url);
  }

  applyTheme() {
    // Apply theme to document root so CSS variables work globally
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  async loadResumeData() {
    try {
      const response = await fetch('./resume.json');
      if (!response.ok) {
        throw new Error(`Failed to load resume data: ${response.statusText}`);
      }
      this.resumeData = await response.json();
    } catch (error) {
      console.error('Error loading resume data:', error);
      this.resumeData = null;
    }
  }

  setupEventListeners() {
    // Listen for theme change events
    this.addEventListener('theme-change', (e) => {
      this.handleThemeChange(e.detail.theme);
    });

    // Listen for role change events
    this.addEventListener('role-change', (e) => {
      this.handleRoleChange(e.detail.role);
    });
  }

  handleThemeChange(newTheme) {
    if (newTheme === this.currentTheme) return;

    this.currentTheme = newTheme;
    localStorage.setItem(STORAGE_KEYS.theme, newTheme);
    this.applyTheme();

    // Re-render to update theme-toggle state
    this.render();
  }

  handleRoleChange(newRole) {
    if (newRole === this.currentRole) return;

    this.currentRole = newRole;
    localStorage.setItem(STORAGE_KEYS.role, newRole);
    this.updateURL();

    // Re-render to update all components
    this.render();
  }

  getCurrentRoleProfile() {
    if (!this.resumeData || !this.resumeData.roleProfiles) {
      return null;
    }
    return this.resumeData.roleProfiles[this.currentRole];
  }

  render() {
    if (!this.resumeData) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            min-height: 100vh;
          }
          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: var(--font-family);
            color: var(--color-text);
          }
        </style>
        <div class="loading" role="status" aria-live="polite">Loading resume...</div>
      `;
      return;
    }

    const roleProfile = this.getCurrentRoleProfile();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100vh;
        }

        .top-bar {
          background-color: var(--color-background);
          border-bottom: 1px solid var(--color-border-light);
          padding: var(--spacing-sm) var(--spacing-md);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: background-color var(--transition-medium), border-color var(--transition-medium);
        }

        .top-bar-content {
          max-width: var(--max-width);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: var(--spacing-md);
        }

        .nav-links {
          grid-column: 2;
          justify-self: center;
        }

        .theme-control {
          grid-column: 3;
          justify-self: end;
        }

        .container {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 var(--spacing-md);
        }

        /* Full-width section wrappers */
        .section-wrapper {
          width: 100%;
          padding: var(--spacing-xl) 0;
        }

        .section-wrapper.primary {
          background-color: var(--color-background);
        }

        .section-wrapper.secondary {
          background-color: var(--color-background-secondary);
        }

        .section-content {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        main {
          padding: 0;
        }

        @media (max-width: 620px) {
          .top-bar-content {
            display: flex;
            justify-content: center;
          }

          .nav-links,
          .theme-control {
            display: none;
          }

          mobile-menu {
            display: block;
          }
        }

        @media print {
          .top-bar {
            display: none;
          }

          .section-wrapper {
            background: none !important;
            padding: 0 !important;
          }

          .section-content {
            padding: 0 !important;
          }
        }
      </style>
      <div class="top-bar" role="banner" aria-label="Site navigation">
        <div class="top-bar-content">
          <mobile-menu>
            <role-toggle
              slot="role-controls"
              current-role="${this.currentRole}"
              software-label="${this.resumeData.roleProfiles.software.label}"
              support-label="${this.resumeData.roleProfiles.support.label}"
              all-label="${this.resumeData.roleProfiles.all.label}"
            ></role-toggle>
            <theme-toggle
              slot="theme-control"
              theme="${this.currentTheme}"
            ></theme-toggle>
          </mobile-menu>
          <div class="nav-links">
            <role-toggle
              current-role="${this.currentRole}"
              software-label="${this.resumeData.roleProfiles.software.label}"
              support-label="${this.resumeData.roleProfiles.support.label}"
              all-label="${this.resumeData.roleProfiles.all.label}"
            ></role-toggle>
          </div>
          <div class="theme-control">
            <theme-toggle theme="${this.currentTheme}"></theme-toggle>
          </div>
        </div>
      </div>

      <main>
        <!-- Header + Profile Section (Primary) -->
        <div class="section-wrapper primary">
          <div class="section-content">
            <resume-header
              name="${this.resumeData.basics.name}"
              email="${this.resumeData.basics.email}"
              phone="${this.resumeData.basics.phone}"
              url="${this.resumeData.basics.url}"
              location="${this.resumeData.basics.location.city}, ${this.resumeData.basics.location.region}"
              image="${this.resumeData.basics.image || ''}"
            ></resume-header>
            <resume-profile
              summary="${roleProfile ? roleProfile.summary : this.resumeData.basics.summary}"
            ></resume-profile>
          </div>
        </div>

        <!-- Skills Section (Secondary) -->
        <div class="section-wrapper secondary">
          <div class="section-content">
            <resume-skills
              skills='${JSON.stringify(this.resumeData.skills)}'
              current-role="${this.currentRole}"
            ></resume-skills>
          </div>
        </div>

        <!-- Work Experience Section (Primary) -->
        <div class="section-wrapper primary">
          <div class="section-content">
            <resume-timeline type="work">
              ${this.renderMainWorkEntries()}
            </resume-timeline>
            ${this.renderAdditionalExperience()}
          </div>
        </div>

        <!-- Education Section (Secondary) -->
        <div class="section-wrapper secondary">
          <div class="section-content">
            <resume-timeline type="education">
              ${this.renderEducationEntries()}
            </resume-timeline>
          </div>
        </div>

        <!-- Recommendations Section (Primary) -->
        ${this.renderRecommendationsSection()}

        <div class="section-wrapper secondary">
          <div class="section-content">
            <resume-footer></resume-footer>
          </div>
        </div>
      </main>
    `;
  }

  getWorkRelevance(job) {
    if (!job.roleRelevance) return 'secondary';
    return job.roleRelevance[this.currentRole] || 'secondary';
  }

  groupConsecutiveCompanies(entries) {
    const groups = [];
    let i = 0;

    while (i < entries.length) {
      const current = entries[i];
      const sameCompany = [current];

      // Check if positions should be grouped:
      // - Same company name
      // - Position starts with "Software Engineer" or is "Support Operations Developer"
      const shouldGroup = (position) => {
        return position.startsWith('Software Engineer') ||
               position === 'Support Operations Developer';
      };

      // Look ahead for consecutive entries with same company that should be grouped
      while (i + 1 < entries.length &&
             entries[i + 1].name === current.name &&
             shouldGroup(current.position) &&
             shouldGroup(entries[i + 1].position)) {
        i++;
        sameCompany.push(entries[i]);
      }

      if (sameCompany.length > 1) {
        // Create a company group
        const firstEntry = sameCompany[0];
        const lastEntry = sameCompany[sameCompany.length - 1];

        groups.push({
          isGroup: true,
          company: current.name,
          url: current.url,
          positions: sameCompany,
          overallStartDate: lastEntry.startDate,
          overallEndDate: firstEntry.endDate
        });
      } else {
        // Single entry, not grouped
        groups.push({
          isGroup: false,
          entry: current
        });
      }

      i++;
    }

    return groups;
  }

  renderMainWorkEntries() {
    // Only show work entries that are not hidden
    const visibleJobs = this.resumeData.work
      .filter(job => this.getWorkRelevance(job) !== 'hidden');

    // Group consecutive companies
    const groups = this.groupConsecutiveCompanies(visibleJobs);

    return groups.map(group => {
      if (group.isGroup) {
        // Render company group
        return `
          <company-group
            data='${JSON.stringify(group).replace(/'/g, '&apos;')}'
            current-role="${this.currentRole}"
          ></company-group>
        `;
      } else {
        // Render individual work entry
        return `
          <work-entry
            data='${JSON.stringify(group.entry).replace(/'/g, '&apos;')}'
            current-role="${this.currentRole}"
          ></work-entry>
        `;
      }
    }).join('');
  }

  renderAdditionalExperience() {
    // Get work entries that are hidden for current role
    const additionalEntries = this.resumeData.work
      .filter(job => this.getWorkRelevance(job) === 'hidden');

    if (additionalEntries.length === 0) {
      return '';
    }

    return `
      <additional-experience
        entries='${JSON.stringify(additionalEntries).replace(/'/g, '&apos;')}'
      ></additional-experience>
    `;
  }

  renderEducationEntries() {
    return this.resumeData.education
      .map(edu => `
        <education-entry
          data='${JSON.stringify(edu).replace(/'/g, '&apos;')}'
        ></education-entry>
      `)
      .join('');
  }

  renderRecommendationsSection() {
    if (!this.resumeData.references || this.resumeData.references.length === 0) {
      return '';
    }

    return `
      <div class="section-wrapper primary">
        <div class="section-content">
          <recommendations-section
            recommendations='${JSON.stringify(this.resumeData.references).replace(/'/g, '&apos;')}'
          ></recommendations-section>
        </div>
      </div>
    `;
  }
}

customElements.define('resume-app', ResumeApp);
