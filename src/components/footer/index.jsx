import React from "react"
import './Footer.css'
import putnam from '../../assets/PutnamPrime.png'
import Tpin from '../../assets/putnamVoiceLines/Tpin.mp3'
import Putnam from '../../assets/putnamVoiceLines/Putnam.mp3'

const sounds = [Tpin, Putnam];

const Footer = () => {
  const playRandomSound = () => {
    // pick a random imported URL
    const src = sounds[Math.floor(Math.random() * sounds.length)];
    const audio = new Audio(src);
    audio
      .play()
      .catch((err) => console.error("Audio playback failed:", err));
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Bad Bishop. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>

      {/* now we’ll use onClick, not hover, since you said “when clicked” */}
      <div
        className="footer-hover-zone"
        onClick={playRandomSound}
        style={{ cursor: "pointer" }}
      >
        <img className="footer-img" src={putnam} alt="Pop Up" />
      </div>
    </footer>
  );
};

export default Footer;