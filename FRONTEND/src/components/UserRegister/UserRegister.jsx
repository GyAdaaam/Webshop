// Ez a JSX modul felelős a felhasználók regisztrációjáért. A felhasználók megadhatják az email címüket, felhasználónevüket, jelszavukat és a jelszó megerősítését. A regisztráció gombra kattintva a megadott adatokat ellenőrzi, és ha minden adat helyes, akkor regisztrálja a felhasználót. Ha a jelszavak nem egyeznek meg, akkor hibaüzenetet jelenít meg. Ha a regisztráció sikeres volt, akkor a felhasználót átirányítja a bejelentkezés oldalra.

// A szükséges komponensek importálása.
import React, { useState } from 'react'; // A React modulok importálása.
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap'; // A React Bootstrap modulok importálása.
import RegisterUserService from '../../services/RegisterUserServices'; // A RegisterUserService modul importálása.
import './UserRegister.css'; // Az UserRegister komponenshez tartozó CSS fájl importálása.

// Az UserRegister komponens.
export default function UserRegister() {
  const [email, setEmail] = useState(''); // Az email állapot.
  const [username, setUsername] = useState(''); // A felhasználónév állapot.
  const [password, setPassword] = useState(''); // A jelszó állapot.
  const [confirmPassword, setConfirmPassword] = useState(''); // A jelszó megerősítése állapot.
  const [error, setError] = useState(''); // A hibaüzenet állapot.

  // A regisztráció függvénye.
  const handleRegister = () => {
    // Ha a jelszavak nem egyeznek meg, akkor hibaüzenetet jelenít meg.
    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek meg');
      return;
    }

    // A felhasználó regisztrálása.
    RegisterUserService.registerUser(email, username, password)
      .then(response => {
        // Ha a regisztráció sikeres volt, akkor a felhasználót átirányítja a bejelentkezés oldalra.
        window.location.href = '/bejelentkezes';
      })
      // Ha a regisztráció sikertelen volt, akkor hibaüzenetet jelenít meg.
      .catch(error => {
        setError('Sikertelen regisztráció');
      });
  };

  // Az UserRegister komponens visszatérési értéke.
  return (
    <div className="userregister-container container-fluid">
      <div className="userregister-row row g-0">
        <div className="col">
          <div className="text-center mb-4">
            <img src="/logo.png" alt="Logo" className="userregister-logo"/>
          </div>
          <div className="userregister-form">
            <h1 className="userregister-title fw-normal my-4 pb-3">Hozd létre a fiókod!</h1>
            {error && <p className="userregister-error-message">{error}</p>}
            <Form>
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" className="form-control form-control-lg" onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-4" controlId="username">
                <Form.Label>Felhasználónév</Form.Label>
                <Form.Control type="text" className="form-control form-control-lg" onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Jelszó</Form.Label>
                <Form.Control type="password" className="form-control form-control-lg" onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label>Jelszó újra</Form.Label>
                <Form.Control type="password" className="form-control form-control-lg" onChange={(e) => setConfirmPassword(e.target.value)} />
              </Form.Group>
              <Button onClick={handleRegister} className="userregister-button mb-4 px-5 btn btn-dark">Regisztráció</Button>
            </Form>
            <div className="mb-4" />
            <p className="userregister-register-text mb-5 pb-lg-2">Van már fiókod? <a href="/regisztracio">Lépj be itt.</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
