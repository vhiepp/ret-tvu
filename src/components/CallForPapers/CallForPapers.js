import "./CallForPapers.css";
import { Link } from "react-router-dom";

const CallForPapers = () => {
  const imageUrl = "/CallForPapers.png";

  return (
    <div className="CallForPapers">
      <div className="CallForPapers_img">
        <img
          src={imageUrl}
          alt=""
          onError={(e) => (e.target.style.display = "none")}
        />
        <a href={imageUrl} download="CallForPapers.png">
          <i className="fa-solid fa-cloud-arrow-down"></i>
          <span>Download Image</span>
        </a>
      </div>
    </div>
  );
};

export default CallForPapers;
