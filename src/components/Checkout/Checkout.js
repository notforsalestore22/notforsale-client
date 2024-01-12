import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from '../context/AuthContext';
import CheckoutContext from '../context/CheckoutContext';

import { CheckoutBox } from '../ShoppingCart/ShoppingCart';

import './Checkout.css';

const Checkout = () => {
  const { registerUser, loginUser } = useContext(AuthContext);
  const { checkout } = useContext(CheckoutContext);

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [zip_code, setZipCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [pwdErrorMessage, setPwdErrorMessage] = useState(false);

  const onCheckout = async () => {
    setPwdErrorMessage(false);

    //check
    if (!name || !surname || !address || !country || !city || !zip_code || !email || !password || !confirmPassword) return alert('Assicurati che tutti i campi siano stati riempiti');
    if (!/[\w.-]+@[a-z-]+\.[a-z]{2,3}/.test(email)) return alert('Indirizzo email non valido');
    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return setPwdErrorMessage(true);
    if (password !== confirmPassword) return alert('Le password non coincidono');

    // register user
    const registerData = await registerUser({ name, surname, address, country, city, zip_code, email, password });

    if (registerData?.error) {
      return alert(registerData.error);
    }

    // login user
    const loginData = loginUser({ email, password });

    if (loginData?.error) {
      return alert(loginData.error);
    }

    // checkout order
    checkout(registerData.customer_id);

    // navigate('/paymentMethod');
  }

  return (
    <div className="checkout">
      <h2>Registrazione</h2>
      <div className="checkout-container">
        <form className="checkout-form">
          <p className="checkout-logged-alert mt-2">Hai già un account? <Link to='/login' style={{ color: 'var(--color-3)', textDecoration: 'underline' }}>Accedi prima di proseguire</Link></p>
          <div className="checkout-row mt-2">
            <div className="checkout-collumn">
              <label htmlFor="name">Nome</label>
              <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="checkout-collumn">
              <label htmlFor="surname">Cognome</label>
              <input type="text" name="surname" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
            </div>
          </div>
          <div className="checkout-row mt-2">
            <div className="checkout-collumn">
              <label htmlFor="address">Indirizzo</label>
              <input type="text" name="address" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="checkout-collumn">
              <label htmlFor="country">Paese</label>
              <input type="text" name="country" id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
          </div>
          <div className="checkout-row mt-1">
            <div className="checkout-collumn">
              <label htmlFor="city">Città</label>
              <input type="text" name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="checkout-collumn">
              <label htmlFor="zip-code">CAP</label>
              <input type="text" name="zipCode" id="zip-code" value={zip_code} onChange={(e) => setZipCode(e.target.value)} />
            </div>
          </div>
          <div className="checkout-row mt-2">
            <div className="checkout-collumn">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="checkout-row mt-1">
            <div className="checkout-collumn">
              <label htmlFor="password" className="checkout-pwd">Password</label>
              <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="checkout-collumn">
              <label htmlFor="confirm-password">Conferma Password</label>
              <input type="password" name="confirmPassword" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          {pwdErrorMessage && <PwdErrorMessage />}
        </form>
        <CheckoutBox onCheckout={onCheckout} />
      </div>
    </div>
  )
}

export const PwdErrorMessage = () => {
  return (
    <div className="pwd-error-message">
      <p>La password deve contenere:</p>
      <ul>
        <li>Almeno 8 caratteri</li>
        <li>Un carattere minuscolo</li>
        <li>Un carattere maiuscolo</li>
        <li>Un carattere numerico</li>
      </ul>
    </div>
  )
}

export default Checkout;