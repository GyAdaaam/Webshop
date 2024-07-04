// Ez a JSX modul tartalmazza a felső navigációs sávot, amely a weboldal minden oldalán megjelenik.

// A szükséges komponensek importálása.
import React, { useState } from 'react'; // React modulok importálása.
import { Container, Form, Nav, Navbar} from 'react-bootstrap'; // Bootstrap komponensek importálása.
import { Link, useNavigate } from 'react-router-dom'; // React Router modulok importálása.
import './MyNavbar.css'; // CSS fájl importálása.

// A felső navigációs sáv komponense.
export default function MyNavbar(isLogged) {
  const [searchTerm, setSearchTerm] = useState(''); // A kereső mező tartalmának állapotának kezelése.
  const navigate = useNavigate(); // A React Router useNavigate hookjának használata.

  // A kereső mezőben megadott keresőszó alapján a keresési oldalra navigálás.
  const handleSearchClick = (event) => {
    event.preventDefault(); // Az alapértelmezett esemény megakadályozása.
    navigate(`/kereses?keyword=${searchTerm}`); // A keresési oldalra navigálás a keresőmező tartalmának átadásával.
  }

  // A felső navigációs sáv megjelenítése.
  return (
    <Navbar expand="lg" className="mynavbar-bg-body-tertiary ">
  <Container fluid>
  <Navbar.Brand href="/" className='mynavbar-navbarlink'><img src="images/MyNavbar/logo.png" className='float-right' width={40}/> JátékBazár</Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarScroll" className='custom-toggler navbar-toggler' style={{color: "white"}}><img src="images/MyNavbar/hamburger.png" width={20}/></Navbar.Toggle>
    <Navbar.Collapse id="navbarScroll">
      <Nav className="me-auto my-2 my-lg-0 mynavbar-navbarlink" navbarScroll>
        <Nav.Link as={Link} to="/aruhaz" className='mynavbar-navbarlink'>Játékok</Nav.Link>
        <Nav.Link as={Link} to="/kapcsolat" className='mynavbar-navbarlink'>Kapcsolat</Nav.Link>
        <Nav.Link as={Link} to="/rolunk" className='mynavbar-navbarlink'>Rólunk</Nav.Link>
      </Nav>

      <Nav className="me-auto my-2 my-lg-0" navbarScroll>
        <Form className="d-flex mynavbar-search-form">
          <Form.Control
            type="search"
            placeholder="Keresés"
            className="flex-grow-1 me-2 mynavbar-search-button"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchClick(e);
              }
            }}
          />
          <button className="btn mynavbar-search-btn ms-2" onClick={handleSearchClick}>Keresés</button>
        </Form>
      </Nav>

      <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
        <Nav.Link as={Link} to="/kosar" className='mynavbar-navbarlink'><img src="images/MyNavbar/cart.png" className='float-right' width={25}/></Nav.Link>
        <Nav.Link as={Link} to="/profil" className='mynavbar-navbarlink'><img src="images/MyNavbar/user.png" width={25}/></Nav.Link>
        <Nav.Link as={Link} to="/bejelentkezes" className='mynavbar-navbarlink'>Bejelentkezés</Nav.Link>
        <Nav.Link as={Link} to="/regisztracio" className='mynavbar-navbarlink'>Regisztráció</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

  );
}