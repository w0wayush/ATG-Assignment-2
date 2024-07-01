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

function App() {
  return (
    <div>
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
          <InitUser />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<PostSection />} />
            <Route
              path="/update-password/:token"
              element={
                // <OpenRoute>
                <UpdatePassword />
                // </OpenRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
