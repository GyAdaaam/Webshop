// Ez a JSX modul az áruházban elérhető játékokat megjelenítő komponens.

// A szükséges komponensek importálása.
import React, { useState, useEffect } from 'react'; // Az állapotok és hatások használatához szükséges komponensek.
import GamesServices from '../../services/GamesServices'; // Az áruházban elérhető játékokat kezelő szolgáltatások importálása.
import FilterGameServices from '../../services/FilterGameServices'; // A játékok szűrését kezelő szolgáltatások importálása.
import { Button, Card } from 'react-bootstrap'; // A gomb és kártya komponensek importálása.
import './GameList.css'; // Az áruházban elérhető játékokat megjelenítő komponenshez tartozó CSS fájl importálása.

// A GameList komponens létrehozása, amely az áruházban elérhető játékokat jeleníti meg.
export default function Gamelist({add_To_cart}) { 
    const [data, setData] = useState([]); // Az adatok állapota.
    const [genres, setGenres] = useState([]); // A műfajok állapota.
    const [categories, setCategories] = useState([]); // A kategóriák állapota.
    const [platforms, setPlatforms] = useState([]); // A platformok állapota.
    const [publishers, setPublishers] = useState([]); // A kiadók állapota.
    const [developers, setDevelopers] = useState([]);// A fejlesztők állapota.
    const [filters, setFilters] = useState({ // A szűrők állapota.
        genre_name: '',
        category_name: '',
        platform_name: '',
        min_price: '',
        max_price: '',
        game_name: '',
        developer_name: '',
        publisher_name: ''
    });

    // A játék hozzáadása a kosárhoz.
    const handleAddToCart = (game) => {
        add_To_cart(game); // Játék hozzáadása a kosárhoz
        alert(`${game.nev} sikeresen hozzá lett adva a kosárhoz!`); // Értesítés megjelenítése
    };

    // Az összes játék, műfaj, kategória, platform, kiadó és fejlesztő lekérdezése a szerverről.
    function fetchData() {
        GamesServices.getAllGames() // Az összes játék lekérdezése.
            .then(response => { setData(response.data) })
            .catch(error => console.log(error));

        GamesServices.getAllGenres() // Az összes műfaj lekérdezése.
            .then(response => { setGenres(response.data) })
            .catch(error => console.log(error));

        GamesServices.getAllCategories() // Az összes kategória lekérdezése.
            .then(response => { setCategories(response.data) })
            .catch(error => console.log(error));

        GamesServices.getAllPlatforms() // Az összes platform lekérdezése.
            .then(response => { setPlatforms(response.data) })
            .catch(error => console.log(error));

        GamesServices.getAllPublishers() // Az összes kiadó lekérdezése.
            .then(response => { setPublishers(response.data) })
            .catch(error => console.log(error));

        GamesServices.getAllDevelopers() // Az összes fejlesztő lekérdezése.
            .then(response => { setDevelopers(response.data) })
            .catch(error => console.log(error));
    }
    
    // Az adatok lekérdezése a szerverről.
    useEffect(() => {
        fetchData();
    }, []);

    // A játékok szűrése a szűrők alapján.
    const handleFilter = () => {
        FilterGameServices.filterGames(filters)
            .then(response => {
                setData(response);
                // Az URL frissítése a szűrők alapján.
                const queryParams = new URLSearchParams();
                Object.keys(filters).forEach(key => {
                    if (filters[key] !== '') {
                        queryParams.append(key, filters[key]);
                    }
                });
                const queryString = queryParams.toString();
                const url = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
                window.history.pushState({}, '', url);
            })
            // Hiba esetén a hiba kiíratása a konzolra.
            .catch(error => console.log(error));
    }

    // A szűrők változásának kezelése.
    const handleGenreChange = (event) => { // A műfaj szűrő változásának kezelése.
        setFilters({ ...filters, genre_name: event.target.value });
    }

    const handleCategoryChange = (event) => { // A kategória szűrő változásának kezelése.
        setFilters({ ...filters, category_name: event.target.value });
    }

    const handlePlatformChange = (event) => { // A platform szűrő változásának kezelése.
        setFilters({ ...filters, platform_name: event.target.value });
    }

    const handleMinPriceChange = (event) => { // A minimum ár szűrő változásának kezelése.
        setFilters({ ...filters, min_price: event.target.value });
    }

    const handleMaxPriceChange = (event) => { // A maximum ár szűrő változásának kezelése.
        setFilters({ ...filters, max_price: event.target.value });
    }

    const handleDeveloperChange = (event) => { // A fejlesztő szűrő változásának kezelése.
        setFilters({ ...filters, developer_name: event.target.value });
    }

    const handlePublisherChange = (event) => { // A kiadó szűrő változásának kezelése.
        setFilters({ ...filters, publisher_name: event.target.value });
    }

    // A játékok megjelenítése.
    return (
        <>
            <div className="container-fluid gamelist-container">
                <div className="row" style={{ marginBottom: 0 }}>
                    <div className="col-md-2 offset-md-1">
                        <section className="panel filter-section gamelist-filter-section">
                            <h4 style={{ color: 'white', textAlign: 'center', fontSize: '35px' }}>Szűrők</h4>
                            <div className="panel-body" style={{ marginBottom: '20px' }}>
                                <form role="form product-form">
                                    <div className="game-list-form-group">
                                        <label>Műfaj</label>
                                        <select className="form-control gamelist-customSelect" onChange={handleGenreChange}>
                                            <option value="">Válasszon egy Műfajt</option>
                                            {genres.map(genre => (
                                                <option key={genre.mufaj_id} value={genre.mufaj_nev}>{genre.mufaj_nev}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="game-list-form-group">
                                        <label>Kategória</label>
                                        <select className="form-control gamelist-customSelect" onChange={handleCategoryChange}>
                                            <option value="">Válasszon egy Kategóriát</option>
                                            {categories.map(category => (
                                                <option key={category.kategoria_id} value={category.kategoria_nev}>{category.kategoria_nev}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="game-list-form-group">
                                        <label>Platform</label>
                                        <select className="form-control gamelist-customSelect" onChange={handlePlatformChange}>
                                            <option value="">Válasszon egy Platformot</option>
                                            {platforms.map(platform => (
                                                <option key={platform.platform_id} value={platform.platform_nev}>{platform.platform_nev}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="game-list-form-group">
                                        <label>Fejlesztő</label>
                                        <select className="form-control gamelist-customSelect" onChange={handleDeveloperChange}>
                                            <option value="">Válasszon egy Fejlesztőt</option>
                                            {developers.map(developer => (
                                                <option key={developer.fejleszto_id} value={developer.fejleszto_nev}>{developer.fejleszto_nev}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="game-list-form-group">
                                        <label>Kiadó</label>
                                        <select className="form-control gamelist-customSelect" onChange={handlePublisherChange}>
                                            <option value="">Válasszon egy Kiadót</option>
                                            {publishers.map(publisher => (
                                                <option key={publisher.kiado_id} value={publisher.kiado_nev}>{publisher.kiado_nev}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <h4 style={{ color: 'white', textAlign: 'left', fontSize: '20px', marginTop: '20px', textAlign:'center', fontSize:'35px'}}>Ártartomány</h4>
                                    <div className="game-list-form-group">
                                        <label>Ár (Minimum)</label>
                                        <input type="number" className="form-control gamelist-form-control" placeholder="Minimum ár" onChange={handleMinPriceChange} />
                                    </div>
                                    <div className="game-list-form-group">
                                        <label>Ár (Maximum)</label>
                                        <input type="number" className="form-control gamelist-form-control" placeholder="Maximum ár" onChange={handleMaxPriceChange} />
                                    </div>
                                    <button className="btn btn-primary mt-3 btn-sm gamelist-buy-button" type="button" onClick={handleFilter}>Szűrés</button>
                                </form>
                            </div>
                        </section>
                    </div>
                    <div className="col-md-9">
                        <div className="container-fluid">
                            <div className="row justify-content-end">
                                {data.map(game => (
                                    <div key={game.jatek_id} className="col-md-3 mb-4">
                                        <Card className="game-list-card gamelist-card">
                                            <Card.Img variant="top" src={`http://localhost:8080/images/header/${game.kep_id}.jpg`} />
                                            <Card.Body>
                                                <Card.Title className="gamelist-card-title">{game.nev}</Card.Title>
                                                <Card.Text className="gamelist-card-text">{game.ar}€</Card.Text>
                                                <Button variant="primary" onClick={() => handleAddToCart(game)} className="gamelist-buy-button">Kosárba</Button>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
