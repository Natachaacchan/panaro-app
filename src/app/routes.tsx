import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { Calendar } from "./pages/Calendar";
import { Projects } from "./pages/Projects";
import { Notes } from "./pages/Notes";
import { VisualEditor } from "./pages/VisualEditor";
import { Layout } from "./components/Layout";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/tasks", element: <Navigate to="/calendar" replace /> },
      { path: "/calendar", element: <Calendar /> },
      { path: "/projects", element: <Projects /> },
      { path: "/notes", element: <Notes /> },
      { path: "/visual-editor", element: <VisualEditor /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <RouteErrorBoundary />,
  },
]);
