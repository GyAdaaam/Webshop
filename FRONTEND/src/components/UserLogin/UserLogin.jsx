// Ez a JSX komponens felelős a felhasználók bejelentkezéséért. A felhasználók megadhatják az email címüket és a jelszavukat. A bejelentkezés gombra kattintva a megadott adatokat ellenőrzi, és ha minden adat helyes, akkor bejelentkezteti a felhasználót. Ha a bejelentkezés sikeres volt, akkor a felhasználót átirányítja a profil oldalra.

// A szükséges komponensek importálása.
import React, { useState } from 'react'; // A React modulok importálása.
import './UserLogin.css'; // Az UserLogin komponenshez tartozó CSS fájl importálása.
import LoginUserServices from '../../services/LoginUserServices'; // A LoginUserServices modul importálása.

// Az UserLogin komponens.
export default function UserLogin({ setIslogged, setUserId }) { 
  const [email, setEmail] = useState(''); // Az email állapotának deklarálása.
  const [password, setPassword] = useState(''); // Az email és jelszó állapotának deklarálása.
  const [error, setError] = useState(''); // A hibaüzenet állapotának deklarálása.

  // A felhasználó bejelentkeztetését végző függvény.
  const handleLogin = () => {
    LoginUserServices.loginUser(email, password) // A loginUser metódus meghívása a LoginUserServices modulból.
      .then(response => {
        if (response.status === 200) {
          console.log(response);
          setIslogged(true); // A felhasználó bejelentkeztetése.
          setError('');
          localStorage.setItem('token', response.data.token); // A token elmentése a localStorage-be.
          window.location.href="/profil"; // Az oldal átirányítása a profil oldalra.
        } else {
          setError('Hibás bejelentkezés'); // Hibaüzenet megjelenítése.
        }
      })
      // Hiba esetén a hibaüzenet megjelenítése a konzolon.
      .catch(error => {
        setIslogged(false);
        setError('Hibás felhasználónév vagy jelszó.'); // Hibaüzenet megjelenítése.
        console.log(error);
      });
  }

  // Az UserLogin komponens megjelenítése.
  return (
    <div className="userlogin-container container-fluid">
      <div className="userlogin-row row g-0">
        <div className="col">
          <div className="text-center mb-4">
            <img src="/logo.png" alt="Logo" className="userlogin-logo"/> {/* Logo image */}
          </div>
          <div className="userlogin-form">
            <h1 className="userlogin-title fw-normal my-4 pb-3">Jelentkezz be a fiókodba!</h1>
            {error && <p className="userlogin-error-message">{error}</p>}
            <div className="mb-4 form-group" controlId="email">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control form-control-lg" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-4 form-group" controlId="password">
              <label htmlFor="password">Jelszó</label>
              <input type="password" className="form-control form-control-lg" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button onClick={handleLogin} className="userlogin-button mb-4 px-5 btn btn-dark">Bejelentkezés</button>
            <div className="mb-4" />
            <p className="userlogin-text mb-5 pb-lg-2">Nincs még fiókod? <a href="/regisztracio">Regisztrálj itt.</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
