import "./CallForPapers.css";
import CFP from "../imgs/CallForPapers.png";
import { Link } from "react-router-dom";

const CallForPapers = () => {
  return (
    <div className="CallForPapers">
      <div className="CallForPapers_img">
        <img src={CFP} alt="" />
        <a href={CFP} download="CallForPapers.png">
          <i className="fa-solid fa-cloud-arrow-down"></i>
          <span>Download Image</span>
        </a>
      </div>
    </div>
  );
};

export default CallForPapers;
