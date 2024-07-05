import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MyNavbar.css';

export default function MyNavbar() {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Navbar expand="lg" className="w-75 m-3 rounded-4 ms-auto me-auto headercard">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="mynavbar-navbarlink">
          <img src="images/MyNavbar/logo.png" className="float-right" width={40} alt="Logo" /> Videójátékbolt
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNavAltMarkup" className="custom-toggler navbar-toggler ml-auto">
          <img src="images/MyNavbar/hamburger.png" width={20} alt="Menu" />
        </Navbar.Toggle>
        <Navbar.Collapse id="navbarNavAltMarkup">
          <Nav className="me-auto my-2 my-lg-0 mynavbar-navbarlink" navbarScroll>
            <Nav.Link as={Link} to="/aruhaz" className="mynavbar-navbarlink">
              Játékok
            </Nav.Link>
            <Nav.Link as={Link} to="/kapcsolat" className="mynavbar-navbarlink">
              Kapcsolat
            </Nav.Link>
            <Nav.Link as={Link} to="/rolunk" className="mynavbar-navbarlink">
              Rólunk
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Button
              id="mobileLoginButton"
              type="button"
              className="btn-light rounded-3 ms-3 mt-1 mb-1 border-1 border-secondary d-lg-none"
              onClick={toggleDropdown}
            >
              Bejelentkezés
            </Button>
            <Button
              id="mobileRegisterButton"
              type="button"
              className="btn-light rounded-3 ms-3 mt-1 mb-1 border-1 border-secondary d-lg-none"
              onClick={toggleDropdown}
            >
              Regisztráció
            </Button>
            <Dropdown
              show={!isMobileView && dropdownOpen}
              onToggle={toggleDropdown}
              drop="down"
              className="my-dropdown"
            >
              <Dropdown.Toggle variant="link" id="dropdown-basic" className="text-white ml-auto d-none d-lg-block">
                <img src="./images/MyNavbar/user3.png" alt="User Icon" width={35} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-right animated fadeIn faster" style={{ backgroundColor: '#252525', marginLeft: '-10px' }}>
                <Dropdown.Item href="#" className="dropdown-item-custom text-white">
                  Bejelentkezés
                </Dropdown.Item>
                <Dropdown.Item href="#" className="dropdown-item-custom text-white">
                  Regisztráció
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
