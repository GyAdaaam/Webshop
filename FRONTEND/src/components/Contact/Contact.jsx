// Ez a JSX modul a kapcsolat megjelenítő komponens.

// A szükséges komponensek importálása.
import './Contact.css';

// A Contact komponens létrehozása, amely a kapcsolat oldalt jeleníti meg.
export default function Contact() {
  return (
    <div className="contact-container">
      <h2 className="mt-5">Kapcsolat</h2>

        <div className="col-md-6">
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Név:</label>
              <input type="text" className="form-control" id="name" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email cím:</label>
              <input type="email" className="form-control" id="email" />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Üzenet:</label>
              <textarea className="form-control" id="message" rows="5"></textarea>
            </div>
            <button type="submit" className="contactus-button btn btn-primary">Küldés</button>
          </form>
        </div>
    </div>
  );
}
