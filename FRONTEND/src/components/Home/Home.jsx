// Szükséges komponensek importálása.
import "./Home.css"; // A Home komponens saját stíluslapja.
import { Link } from 'react-router-dom'; // Az oldalak közötti váltáshoz szükséges komponens.
 // Példa kép importálása (ezt a képet cseréld ki a saját képeddel).

// A kezdőoldalt megjelenítő komponens.
export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center home-background">
      <div className="container-fluid home-container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="text-center text-light home-text">
              <h1 className="display-4 fw-bolder mb-3">JátékBazár</h1>
              <p className="lead fw-normal display-6 mb-3">- Üdvözlünk a weboldalon -</p>
              <Link to='/aruhaz'>
                <button type="button" className="btn btn-danger ribbon fw-bolder w-100 home-button">
                  {"<-- Indulhat a felfedezés -->"}
                </button>
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <img src='images/MyNavbar/home.png' alt="Játék kép" className="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
}
