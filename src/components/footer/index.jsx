import React from "react"
import './Footer.css'
import putnam from '../../assets/PutnamPrime.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Bad Bishop. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
      {/* This hover zone is absolutely positioned so it doesn't affect the layout */}
      <div className="footer-hover-zone">
        <img className="footer-img" src={putnam} alt="Pop Up" />
      </div>
    </footer>
  )
}

export default Footer