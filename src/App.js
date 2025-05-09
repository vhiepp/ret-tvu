import "./Responsive.css";
import "./App.css";
import { useEffect, useState } from "react";
import { Layout, Spin } from "antd";
import { Route, Routes, useLocation } from "react-router-dom";
import Committee from "./components/Committee/Committee";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import About from "./components/About/About";
import Program from "./components/Program/Program";
import TravelInformation from "./components/Travel/TravelInformation";
import TravelNote from "./components/Travel/TravelNote";
import Slider from "./components/Slider/Slider";
import Submission from "./components/Submission/submission";
import ContactUs from "./components/Travel/ContactUs";
import Search from "./components/Search/Search";
import CallForPapers from "./components/CallForPapers/CallForPapers";
import Registration from "./components/Registration/Registration";

const { Content } = Layout;

const App = () => {
  const location = useLocation();
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setShowScrollButton(scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="App">
      <Layout>
        {/* <div className='Banner'>
          <h2>The International Conference on Research in Engineering and Technology 2025 (RET2025)</h2>
        </div> */}
        <Header />
        <Content>
          <div className="Content">
            <Slider />
            <Routes>
              <Route path={`/`} element={<About />} />
              <Route path={`/committee`} element={<Committee />} />
              <Route path={`/program`} element={<Program />} />
              <Route path={`/about`} element={<About />} />
              <Route path={`/submission`} element={<Submission />} />
              <Route
                path={`/travel-information`}
                element={<TravelInformation />}
              />
              <Route path={`/travel-notes`} element={<TravelNote />} />
              <Route path={`/contact-us`} element={<ContactUs />} />
              <Route path={`/call-for-papers`} element={<CallForPapers />} />
              <Route path={`/search`} element={<Search />} />

              <Route path={`/registration`} element={<Registration />} />
            </Routes>
          </div>
        </Content>
        <Footer />
        {showScrollButton && (
          <div className="scroll-to-top-button" onClick={scrollToTop}>
            <i className="fa-solid fa-chevron-up"></i>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default App;
