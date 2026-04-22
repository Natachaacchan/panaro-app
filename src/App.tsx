import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes.tsx";
import { AuthProvider } from "./app/context/auth";
import { WorkspaceProvider } from "./app/context/workspace";

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <RouterProvider router={router} />
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;
