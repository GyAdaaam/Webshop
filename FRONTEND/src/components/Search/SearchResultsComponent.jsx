// Ez a JSX modul a keresési eredményeket jeleníti meg a keresési oldalon. A keresési eredményeket a SearchGamesServices modul segítségével keresi meg a megadott keresőszó alapján. A keresési eredményeket egy kártya formájában jeleníti meg, amely tartalmazza a játék nevét, árát és egy képet a játékról. A kártya alján található egy gomb, amely a játékot a kosárba helyezi. Ha nincs találat a keresésre, akkor egy üzenet jelenik meg, hogy nincs találat a keresésre.

// A szükséges komponensek importálása.
import React, { useState, useEffect } from 'react'; // A React modulok importálása.
import { useLocation } from 'react-router-dom'; // A React Router modulok importálása.
import SearchGamesServices from '../../services/SearchGamesServices'; // A SearchGamesServices modul importálása.
import { Card, Row, Col, Button } from 'react-bootstrap'; // A Bootstrap komponensek importálása.
import './Search.css'; // A Search komponenshez tartozó CSS fájl importálása.

// A keresési eredmények komponense.
const SearchResultsComponent = () => {
    const { search } = useLocation(); // A keresési paraméterek lekérdezése a URL-ből.
    const [searchResults, setSearchResults] = useState([]); // A keresési eredmények állapotának kezelése.
    const [noResults, setNoResults] = useState(false); // A keresési eredmények hiányának állapotának kezelése.
    const searchTerm = new URLSearchParams(search).get('keyword'); // A keresési kifejezés lekérdezése a URL-ből.

    // A keresési eredmények lekérdezése a keresési kifejezés alapján.
    useEffect(() => {
        SearchGamesServices.search(searchTerm) // A SearchGamesServices modul search metódusának meghívása a keresési kifejezés átadásával.
            .then(response => {
                setSearchResults(response.data); // A keresési eredmények beállítása a válasz alapján.
                setNoResults(response.data.length === 0); // A keresési eredmények hiányának beállítása a válasz alapján.
            })
            // Hiba esetén a hiba kiírása a konzolra.
            .catch(error => console.error('Hiba történt a keresés során:', error));
    }, [searchTerm]);

    const link = "http://localhost:8080/images/header/";

    // A keresési eredmények megjelenítése.
    return (
        <div className='container-fluid search-gamelist-container'>
            <div className='keresinf'>
                <h2 className='search-searchresult'>Keresési eredmények:</h2>
                <p>Keresett kifejezés: {searchTerm}</p>
            </div>
            <Row>
                {noResults ? (
                    <p className="text-center">Nincs találat a keresésre.</p>
                ) : (
                    searchResults.map((result, index) => (
                        <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                            <Card className="search-gamelist-card">
                                <Card.Img variant="top" src={`${link}${result.kep_id}.jpg`} />
                                <Card.Body className="search-card-body">
                                    <Card.Title className="search-gamelist-card-title">{result.nev}</Card.Title>
                                    <div className="search-button-price-container">
                                        <div className='search-price-content'>
                                            <span className='search-price'>{result.ar}€</span>
                                        </div>
                                        <div className="search-button-buy-content">
                                            <Button variant="primary" className="search-gamelist-buy-button">Kosárba</Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
};

export default SearchResultsComponent;
