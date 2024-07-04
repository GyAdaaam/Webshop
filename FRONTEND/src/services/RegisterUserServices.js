// Ez a JS modul felelős az új felhasználó regisztrációjáért.

// Az axios modul importálása.
import http from '../http-common';

// Felhasználó általi regisztráció az adott e-mail cím,felhasználónév és jelszó alapján.
const registerUser = (email, username, password) => {
    return http.post('/auth/register', { email,username,password });
}

// Az exportok összegyűjtése.
const RegistUserServices = {
    registerUser
}

// Az exportálás.
export default RegistUserServices;
