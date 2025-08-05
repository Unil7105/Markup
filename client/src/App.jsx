import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import Header from "./components/Header";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import FileBrowser from "./pages/FetchFile";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        {/* <Header /> */}
        <ProtectedRoute> 
        <FileBrowser />
        </ProtectedRoute>
        {/* <FileBrowser /> */}
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        {/* <Header /> */}

        <Login />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        {/* <Header /> */}

        <SignUp />
      </>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <>
        {/* <Header /> */}

        <ResetPassword />
      </>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <>
        {/* <Header /> */}
        <ForgotPassword />
      </>
    ),
  },
  {
    path: "/",
    element: (
      <>
        {/* <Header /> */}
        <ForgotPassword />
      </>
    ),
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
