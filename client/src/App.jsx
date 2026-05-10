import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Profile from "./pages/User";
import Partner from "./pages/Partner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SingleMovie from "./pages/Home/SingleMovie";
import BookShow from "./pages/Home/BookShow";
import SuccessPage from "./pages/Home/SuccessPage";
import ErrorPage from "./pages/Home/ErrorPage";
import Forget from "./pages/User/ForgetPassword";
import Reset from "./pages/User/ResetPassword";

const ROLE_ADMIN_AREA = ["admin"];
const ROLE_PARTNER_AREA = ["partner"];
const ROLE_USER_AREA = ["user"];

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget" element={<Forget />} />
          <Route path="/reset/:email" element={<Reset />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={ROLE_ADMIN_AREA}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={ROLE_USER_AREA}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner"
            element={
              <ProtectedRoute allowedRoles={ROLE_PARTNER_AREA}>
                <Partner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <SingleMovie />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-show/:id"
            element={
              <ProtectedRoute>
                <BookShow />
              </ProtectedRoute>
            }
          />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
