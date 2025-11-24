# Resume

An interactive web-based resume with role-specific filtering and theme support.

## Purpose

This resume site allows me to maintain a single source of data while presenting focused views for different types of positions. Whether applying for Software Engineer or Technical Support Engineer roles, the same resume.json file can be filtered to highlight the most relevant experience for each position. This approach ensures consistency across versions while tailoring the presentation to the specific job context.

## Features

- **Role-Based Filtering**: Switch between Software Engineer, Technical Support Engineer, or Full Resume views
- **Theme Toggle**: Light and dark mode support with system preference detection
- **Company Grouping**: Multiple positions at the same company are visually grouped with a mini-timeline
- **Responsive Design**: Optimized for screen and print
- **Accessibility**: Keyboard navigation, screen reader support, and reduced motion preferences

## Architecture

### Data Structure
- **resume.json**: Extended JSON Resume schema with custom fields:
  - `roleRelevance`: Controls visibility per role (primary/secondary/hidden)
  - `roleProfiles`: Role-specific summaries and labels
  - `productUrl`: Optional product links for grouped positions

### Components
Built with vanilla Web Components (Custom Elements):

- **resume-app.js**: Main application orchestrating data loading and role state
- **role-toggle.js**: Role switching controls with URL persistence
- **theme-toggle.js**: Light/dark theme toggle with localStorage
- **company-group.js**: Groups consecutive positions at the same company
- **work-entry.js**: Individual work experience entries
- **education-entry.js**: Education history entries
- **resume-skills.js**: Skills section with role-based filtering
- **resume-timeline.js**: Timeline container with scroll animations
- **additional-experience.js**: Condensed list of secondary experiences

### Utilities
- **utils/date-formatter.js**: Timezone-safe date formatting functions
- **utils/scroll-observer.js**: Intersection Observer helpers for animations

### Styling
- **css/variables.css**: CSS custom properties for theming
- **css/base.css**: Base styles and typography
- **css/animations.css**: Scroll-triggered animations
- **css/print.css**: Print-optimized styles

