// Ez a JS modul felelős azért, hogy a játékok kereséséhez szükséges kéréseket lekezelje.
import http from '../http-common';

// Az adott keresési kifejezéssel (searchTerm) megegyező játékok lekérése.
const search = (searchTerm) => {
    return http.get(`/games/search/${searchTerm}`);
};

// Az exportok összegyűjtése.
const SearchGamesServices = {
    search,
}

// Az exportálás.
export default SearchGamesServices;