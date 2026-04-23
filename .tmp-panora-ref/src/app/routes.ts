import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LandingCalendar } from "./pages/LandingCalendar";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { Projects } from "./pages/Projects";
import { Calendar } from "./pages/Calendar";
import { Notes } from "./pages/Notes";
import { VisualEditor } from "./pages/VisualEditor";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingCalendar,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "tasks", Component: Tasks },
      { path: "projects", Component: Projects },
      { path: "calendar", Component: Calendar },
      { path: "notes", Component: Notes },
      { path: "visual-editor", Component: VisualEditor },
    ],
  },
]);