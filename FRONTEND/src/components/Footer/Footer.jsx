// Ez a JSX modul a láblécet megjelenítő komponens.

// A szükséges komponensek importálása.
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// A Footer komponens, amely a láblécet jeleníti meg.
export default function Footer() {
  // Az aktuális év lekérése.
  const currentYear = new Date().getFullYear();

  // A lábléc megjelenítése.
  return (
    <footer className="footerbody footer mt-auto py-3">
      <div className="container">
        <div className="row align-items-center">
          <div className='col-md-3'>
            {/* A lábléc tartalma. */}
            <img src='./images/Footer/footerlogo.png' alt="Footer Logo" className='footerlogo' title='A footer logója'/>
            <p>Copyright © {currentYear} Játékbazár. Minden jog fenntartva. Általános Szerződési Feltételek, Adatvédelmi szabályzat, Cookie-beállítások.</p>
            <hr className='medium'></hr>
            <div className='row'>
                <div className='col'>
                    <img src='./images/Footer/discord.png'></img>
                </div>
                <div className='col'>
                    <img src='./images/Footer/facebook.png'></img>
                </div>
                <div className='col'>
                    <img src='./images/Footer/instagram.png'></img>
                </div>
                <div className='col'>
                    <img src='./images/Footer/steam.png'></img>
                </div>
            </div>
          </div>
          <div className="col-md-3">
            {/* A lábléc tartalma. */}
            <h5>Hasznos linkek</h5>
            <ul className="list-unstyled text-small">
              <li><Link className="custom-link" to="/rolunk">Rólunk</Link></li>
              <li><Link className="custom-link" to="/kapcsolat">Kapcsolat</Link></li>
              <li><Link className="custom-link">Hamarosan</Link></li>
              <li><Link className="custom-link">Hamarosan</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            {/* A lábléc kapcsolat. */}
            <h5>Kapcsolat</h5>
            <ul className="list-unstyled text-small">
                <li>Játékbazár Kft.</li>
                <li>Széchényi Utca 12.</li>
                <li>Kisváros, Magyarország</li>
                <li><a className="custom-link" href="mailto:info@jatekbazar.hu">info@jatekbazar.hu</a></li>
                <li><a className="custom-link" href="tel:+366844587">+366844587</a></li>
            </ul>
          </div>
          {/* A lábléc képe. */}
          <div className="col-md-3">
            <img src='./images/Footer/footerimage.png' alt="Footer kép" title='A footer képe' className='footerimage'/>
          </div>
        </div>
        <hr className='medium'></hr>
        <div className="row">
          {/* A lábléc aljának tartalma. */}
          <div className="col-12">
            <p className='footercopyright'>&copy; {currentYear} Játékbazár Kft. Minden jog fenntartva.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}