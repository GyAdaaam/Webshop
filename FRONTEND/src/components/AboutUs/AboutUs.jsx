// Ez a JSX modul a kapcsolat megjelenítő komponens.

// A szükséges modulok importálása.
import './AboutUs.css';

// A rólunk oldal komponense.
export default function AboutUs() {
  return (
    <div className="aboutus-container">
      <h2 className="mt-5">Rólunk</h2>
      <p className="lead">Üdvözlünk a Játékbazár Kft nevében!</p>
      <p>
        Cégünk elkötelezett az ügyfelek számára nyújtott kiváló szolgáltatásban és termékekben. Célunk, hogy megfeleljünk ügyfeleink elvárásainak és bizalmát teljes mértékben kiszolgáljuk.
      </p>
      <p>
        Mi több, nemcsak a minőség, hanem a kreativitás és az innováció is fontos számunkra. Az ügyfél előnyeinek maximalizálása érdekében folyamatosan fejlesztjük és bővítjük a játék készleteinket.
      </p>
      <p>
        Bízunk benne, hogy megtalálja az igényeihez és elvárásainak megfelelő játékot/játékokat.
      </p>
      <img src="/logo.png" alt="" className='aboutus-logo' />
    </div>
  );
}
