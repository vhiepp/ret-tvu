import "./Footer.css";
import philosophy from "../imgs/triet-ly.png";
import logo from "../imgs/logoTVU.png";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Image } from "antd";

const Footer = () => {
  return (
    <div className="Footer">
      <div className="Footer_container">
        <div className="Footer_info">
          <div>
            <Avatar src={logo} size={54} />
          </div>
          <div>
            <h2>Tra Vinh University</h2>
            <philosophy>Email: ret_conf@tvu.edu.vn</philosophy>
          </div>
        </div>
        <img src={philosophy} className="Footer_philosophy" />
      </div>
      <div
        className="Footer_info"
        style={{ textAlign: "center", paddingTop: "20px" }}
      >
        <p>Copyright © RET 2025</p>
      </div>
    </div>
  );
};

export default Footer;
