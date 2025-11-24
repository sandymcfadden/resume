/**
 * Scroll observer utilities
 * Creates Intersection Observers for scroll-triggered animations
 */

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Create an Intersection Observer for scroll-triggered animations
 * Automatically respects reduced motion preference
 *
 * @param {HTMLElement} targetElement - Element to observe
 * @param {Function} onVisible - Callback when element becomes visible
 * @param {Object} options - Observer options
 * @param {number} options.threshold - Intersection threshold (default: 0.1)
 * @param {string} options.rootMargin - Root margin (default: '0px 0px -50px 0px')
 * @returns {IntersectionObserver|null} Observer instance or null if reduced motion
 */
export function createScrollObserver(targetElement, onVisible, options = {}) {
  // Don't create observer if user prefers reduced motion
  if (prefersReducedMotion()) {
    return null;
  }

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px'
  } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onVisible(entry.target);
          observer.disconnect();
        }
      });
    },
    {
      threshold,
      rootMargin
    }
  );

  observer.observe(targetElement);
  return observer;
}
