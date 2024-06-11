import { Link } from "react-router-dom";
import svgArrow from "../assets/arrow.svg";
import homeHeroImg from "../assets/home-hero-img.svg";

export default function Home() {
  return (
    <div className="home-hero-cont">
      <div className="home-hero-text">
        <h1>Hire the Best Talent with Our Recruitment Platform</h1>
        <p>
          Transform hiring process with our cutting-edge Recruitment Platform.
          Connect with top talent effortlessly.
        </p>
        <Link to="/about" className="home-hero-btn">
          GET STARTED
        </Link>
      </div>
      <div className="home-hero-img">
        <img src={homeHeroImg} alt="two people talking" />
      </div>
    </div>
  );
}
