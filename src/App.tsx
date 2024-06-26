import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import PostSection from "./pages/PostSection";
import Navbar from "./pages/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-bootstrap";
import InitUser from "./components/InitUser";

function App() {
  return (
    <div>
      <RecoilRoot>
        <ToastContainer />
        <BrowserRouter>
          <Navbar />
          <InitUser />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<PostSection />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
