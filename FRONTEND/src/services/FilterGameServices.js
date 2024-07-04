// Ez a szolgáltatás arra szolgál, hogy a backend felé küldött részletes szűrési kéréseket kezelje, melyeket a játékok szűréséhez alkalmaznak.

// Az axios modul importálása.
import http from '../http-common';

// A játékok szűréséhez szükséges szolgáltatás.
const FilterGameServices = {
  // Játékok szűrése a megadott szűrési feltételek alapján
  filterGames: (filterConditions) => {
    return http.post('games/filter', filterConditions)
      .then(response => {
        return response.data;
      })
      // Hiba esetén a hiba kiíratása a konzolra és a hiba továbbdobja.
      .catch(error => {
        console.error('Hiba történt a játékok szűrésének során:', error);
        throw error;
      });
  }
};

// Az exportálás.
export default FilterGameServices;
