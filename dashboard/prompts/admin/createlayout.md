Create the main app layout based on the attached sidebar design.

Requirements:

1. Create a new file:
   src/layouts/MainLayout.tsx

2. The MainLayout should contain only:
   - Sidebar
   - children content area using <Outlet /> from react-router-dom

3. The sidebar data must be inside the same MainLayout.tsx file as an array.
   Each sidebar item should have:
   - icon
   - title
   - link

4. Use the logo from:
   src/assets/logo1.svg

5. The sidebar should match the attached design:
   - RTL layout
   - White sidebar background
   - Logo at the top
   - App name/subtitle under or near the logo if needed
   - Vertical navigation list
   - Active route has soft light-red/pink background
   - Active route text/icon uses the primary red color
   - Inactive items use muted gray
   - Rounded active item
   - Icons on the right side, text beside them
   - Clean spacing similar to the screenshot

6. Study the color palette from:
   src/index.css

   Use the existing CSS variables/classes/colors from index.css instead of inventing random colors.

7. Update the routes file:
   src/app/routes.ts

   Wrap the app pages with MainLayout.

   Example structure:
   - MainLayout as the parent route
   - Dashboard/Home page as index or "/"
   - Other pages as children routes

8. Use react-router-dom NavLink for sidebar links so the active item is detected automatically.

9. Use @iconify/react for icons.

10. Sidebar pages should include these items:

   - الرئيسية
     icon: material-symbols:grid-view-rounded
     link: /

   - التحليلات
     icon: material-symbols:analytics-outline
     link: /analytics

   - الطلاب
     icon: mdi:school-outline
     link: /students

   - المدربين
     icon: fluent:people-team-24-regular
     link: /trainers

   - الاشتراكات
     icon: material-symbols:subscriptions-outline
     link: /subscriptions

   - المهام الفائتة
     icon: material-symbols:event-busy-outline
     link: /missed-tasks

   - الجلسات النشطة
     icon: material-symbols:timer-outline
     link: /active-sessions

11. Main content area should take the remaining width beside the sidebar.
    The sidebar should have a fixed width similar to the screenshot.

12. Make the code clean, typed, reusable, and suitable for a React + TypeScript + Tailwind project.

Expected output:
- src/layouts/MainLayout.tsx
- Updated src/app/routes.ts