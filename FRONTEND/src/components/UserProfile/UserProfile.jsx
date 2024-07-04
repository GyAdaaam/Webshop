// A profilt megjelenítő komponens.

// A szükséges importok.
import React, { useState, useEffect } from 'react';
import http from '../../http-common';
import { Link } from "react-router-dom";
import './UserProfile.css';

// A UserProfile komponens.
export default function UserProfile({ isLogged, setIslogged, setUserId }) {
  const [ResponseData, setResponseData] = useState({});
  const [msg, setMsg] = useState('');

  // Az useEffect hook.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await http.get('/auth/userprofile', { headers: { 'x-access-token': token } });
        setIslogged(true);
        setResponseData(response.data);
        setUserId(response.data[0].felhasznalo_id);
        setMsg('Azonosítás OK');
      } catch (error) {
        setIslogged(false);
        setResponseData(error);
        if (error.response) {
          setMsg('Hiba: ' + error.response.status + ' ' + error.response.data.message);
        } else {
          setMsg(error.message);
        }
      }
    };

    fetchData();
  }, [isLogged]);

  // A kijelentkezés függvénye.
  const handleLogout = () => {
    setIslogged(false);
    localStorage.removeItem('token');
    window.location.href = '/bejelentkezes';
  };

  // A visszatérési érték.
  return (
    <div className="userprofile-container-fluid">
      <h1 className="display-4 text-center my-3">Felhasználói profil</h1>
      {!isLogged ? (
        <div className="text-center">
          <div className="my-4">
            <img src="/images/UserProfile/userprofile.png" alt="Profilkép" className="img-fluid rounded-circle" style={{ width: "250px", height: "250px" }} />
          </div>
          {ResponseData && ResponseData.length > 0 ? (
            <>
              <h2 className="my-4">A felhasználó adatai</h2>
              {ResponseData.map(user => (
                <div key={user.felhasznalo_id} className="card my-3 userprofiledata">
                  <div className="card-body">
                    <p className="card-text">Id: {user.felhasznalo_id}</p>
                    <p className="card-text">Név: {user.felhasznalo_nev}</p>
                    <p className="card-text">Email: {user.email}</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="my-4">Nincs elérhető felhasználói adat.</p>
          )}
          <button className="btn btn-primary my-3 userprofile-button" onClick={handleLogout}>{isLogged ? 'Kijelentkezés' : 'Bejelentkezés'}</button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="my-4">Nincs bejelentkezve</h2>
          <Link to="/bejelentkezes">
            <button className="btn btn-primary my-3">Tovább a bejelentkezéshez</button>
          </Link>
        </div>
      )}
    </div>
  );
}
