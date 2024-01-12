import { useState, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useCookie from '../customHooks/useCookie';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [accessToken, setAddressToken] = useCookie('accessToken', '');
  const [userLogged, setUserLogged ] = useState(false);

  let headers = new Headers();

  useEffect(() => {

    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');

  }, []);

  useEffect(() => {
    if (accessToken) setUserLogged(true);
    else setUserLogged(false);
  }, [accessToken]);

  const registerUser = async ({ name, surname, address, country, city, zip_code, email, password }) => {
    const res = await fetch(`https://notforsaleweb-a185cdef4039.herokuapp.com/api/auth/register`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, surname, address, country, city, zip_code, email, password })
    });
    const data = await res.json();
    if (res.status === 200) {
      return data;
    } else {
      alert('Qualcosa è andato storto');
    }
  }

  const loginUser = async ({ email, password }) => {

    const res = await fetch(`https://notforsaleweb-a185cdef4039.herokuapp.com/api/auth/login`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.status === 200) {
      if (!data?.error) {
        setAddressToken(data.accessToken);
      }
      return data;
    } else {
      alert('Qualcosa è andato storto');
    }
  }

  const logout = () => {
    setAddressToken('');
    setUserLogged(false);
  }

  const resetPasswordEmail = async (email) => {
    const res = await fetch('https://notforsaleweb-a185cdef4039.herokuapp.com/api/auth/resetPasswordEmail', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.status === 200) {
      if (data?.error) {
        alert(data.error);
      } else {
        alert('Email inviata con successo');
      }
    } else {
      alert('Qualcosa è andato storto');
    }
  }

  const resetPassword = async ({ updatedPassword, token }) => {
    const res = await fetch('https://notforsaleweb-a185cdef4039.herokuapp.com/api/auth/resetPassword', {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'authorization': `Bearer ${ token }`
      },
      body: JSON.stringify({ updatedPassword })
    });
    const data = await res.json();
    if (res.status === 200) {
      if (data?.error) {
        alert(data.error);
      } else {
        alert('Password reimposta con successo');
        navigate('/login');
      }
    } else {
      alert('Qualcosa è andato storto');
    }
  }

  const contextData = { accessToken, userLogged, registerUser, loginUser, setUserLogged, logout, resetPasswordEmail, resetPassword }

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  )
}