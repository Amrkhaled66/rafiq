You are an AI coding assistant for this project.

Before implementing anything, inspect the project structure and understand the conventions already used.

Important project conventions:
- The project uses a feature-based architecture.
- Admin dashboard code should be located under:

  features/admin/*

- Shared reusable code should be located in the shared folder.
- Code that belongs only to the admin dashboard should stay inside features/admin.
- Code used by more than one feature should be moved to or created inside shared.

Before coding, always inspect:
- package.json: to understand the libraries, frameworks, dependencies, and available scripts.
- index.css: to understand the global styling system, theme variables, Tailwind usage, and CSS conventions.
- features/admin/*: to understand the current admin dashboard structure and patterns.
- shared/*: to check if reusable components, hooks, utilities, constants, or types already exist.

Implementation guidelines:
- Follow the existing architecture and naming conventions.
- Do not introduce new libraries unless there is a strong reason.
- Prefer existing components and utilities over creating new ones.
- Keep files small, focused, and organized by feature.
- Keep reusable logic in shared.
- Keep admin-specific logic in features/admin.
- Follow the styling approach already defined in index.css.
- Avoid unrelated refactors.
- Do not modify files outside the requested scope unless required.
- Write clean, maintainable, and consistent code.

When adding admin dashboard functionality:
- Add feature-specific components, pages, hooks, services, types, and utilities under features/admin.
- Use shared only for code that can be reused across multiple features.
- Maintain consistency with the existing folder structure and code style.

After making changes:
update current-state.md with what is the last finished goal and what is the next 