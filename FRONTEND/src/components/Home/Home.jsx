// Szükséges komponensek importálása.
import "./Home.css"; // A Home komponens saját stíluslapja.
import { Link } from 'react-router-dom'; // Az oldalak közötti váltáshoz szükséges komponens.

// A kezdőoldalt megjelenítő komponens.
export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center home-background">
      <div className="container-fluid home-container">
        <div className="row align-items-center">
          <div className="col-lg-6 d-flex justify-content-center">
            <div className="text-center text-light home-text" style={{ marginTop: '-10px' }}>
              <h1 className="display-4 fw-bolder mb-3">Videójátékbolt</h1>
              <p className="lead fw-normal display-6 mb-3">- Üdvözlünk a weboldalon -</p>
              <Link to='/aruhaz'>
                <button type="button" className="btn btn-danger ribbon fw-bolder w-100 home-button">
                  {"<-- Indulhat a felfedezés -->"}
                </button>
              </Link>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-center">
            <img src='images/Home/home.png' alt="Játék kép" className="img-fluid home-background" style={{ height: '750px', width: 'auto' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
