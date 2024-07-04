import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import PostSection from "./pages/PostSection";
import Navbar from "./pages/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InitUser from "./components/InitUser";
import UpdatePassword from "./components/UpdatePassword";
//@ts-ignore
import OpenRoute from "./components/OpenRoute";
import ProfileSection from "./pages/ProfileSection";

function App() {
  return (
    <div className="min-h-screen bg-pattern">
      <RecoilRoot>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<PostSection />} />
            <Route path="/profile" element={<ProfileSection />} />
            <Route
              path="/update-password/:token"
              element={
                // <OpenRoute>
                <UpdatePassword />
                // </OpenRoute>
              }
            />
          </Routes>
          <InitUser />
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
