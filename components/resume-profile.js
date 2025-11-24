/**
 * <resume-profile> - Profile summary component
 *
 * Displays role-specific summary
 * Animates when summary changes (if motion not reduced)
 */

class ResumeProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['summary'];
  }

  connectedCallback() {
    this.render();
    this.setupAnimation();
  }

  setupAnimation() {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const section = this.shadowRoot.querySelector('section');
    if (section) {
      section.classList.add('animate-in');
    }
  }

  attributeChangedCallback(_name, oldValue, newValue) {
    if (this.isConnected && oldValue !== null && oldValue !== newValue) {
      // Animate the change
      this.animateChange();
    } else if (this.isConnected) {
      this.render();
    }
  }

  animateChange() {
    const content = this.shadowRoot.querySelector('.profile-content');
    if (!content) {
      this.render();
      return;
    }

    // Fade out, update, fade in
    content.style.opacity = '0';

    setTimeout(() => {
      this.render();
      const newContent = this.shadowRoot.querySelector('.profile-content');
      if (newContent) {
        // Force reflow
        newContent.offsetHeight;
        newContent.style.opacity = '1';
      }
    }, 150); // Half of transition duration
  }

  render() {
    const summary = this.getAttribute('summary') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        section {
          margin-bottom: var(--spacing-lg);
          opacity: 0;
          transform: translateY(10px);
        }

        section.animate-in {
          animation: fadeInUp var(--animation-duration) ease-out forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          section {
            opacity: 1;
            transform: none;
          }

          section.animate-in {
            animation: none;
          }
        }

        h2 {
          font-size: var(--font-size-xl);
          margin: 0 0 var(--spacing-md) 0;
          padding-bottom: var(--spacing-xs);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text);
        }

        .profile-content {
          line-height: var(--line-height);
          color: var(--color-text);
          opacity: 1;
          transition: opacity var(--transition-medium);
        }

        p {
          margin: 0;
        }
      </style>

      <section>
        <h2>Profile</h2>
        <div class="profile-content" role="region" aria-live="polite">
          <p>${summary}</p>
        </div>
      </section>
    `;
  }
}

customElements.define('resume-profile', ResumeProfile);
