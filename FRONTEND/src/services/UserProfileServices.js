// Ez a JS modul az aktuálisan belépve lévő felhasználó adatainak lekérésére szolgáló service.

// Az axios modul importálása.
import http from '../http-common';

// Az aktuálisan belépve lévő felhasználó adatainak lekérése.
const getUserProfile = () => {
    return http.get('/auth/userprofile');
}

// Az exportok összegyűjtése.
const UserProfileServices = {
    getUserProfile
}

// Az exportálás.
export default UserProfileServices;