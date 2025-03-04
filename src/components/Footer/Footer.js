import "./Footer.css";
import philosophy from "../imgs/triet-ly.png";
import logo from "../imgs/logoTVU.png";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Image } from "antd";

const Footer = () => {
  return (
    <div className="Footer">
      <div className="Footer_container">
        <div
          className="Footer_info"
          style={{ textAlign: "center", paddingTop: "20px" }}
        >
          <p style={{ fontSize: 16 }}>Email: ret_conf@tvu.edu.vn</p>
          <p>Copyright © RET 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
