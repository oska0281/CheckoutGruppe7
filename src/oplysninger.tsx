import React, { useState } from 'react';
import './oplysninger.css';
import itemsData from './products.json';




const oplysninger = (): JSX.Element => {
  const [deliveryAddress, setDeliveryAddress] = useState({
    country: 'Denmark',
    zipCode: '',
    city: '',
    addressLine1: '',
    addressLine2: '',
    name: '',
    phone: '',
    email: '',
    companyName: '',
    companyVATNumber: '',
    });




//zip tjekker
const validateZipCode = async (zipCode: string): Promise<boolean> => {
  if (!zipCode) {
    return false;
  }

  const response = await fetch(`https://api.dataforsyningen.dk/postnumre/${zipCode}`);
  const data = await response.json();

  return response.ok && data && data.nr === zipCode;
};

const [zipCodeError, setZipCodeError] = useState(false);

const handleNext = async () => {
  const isValidZipCode = await validateZipCode(deliveryAddress.zipCode);

  if (!isValidZipCode) {
    setZipCodeError(true);
    return;
  }

  setZipCodeError(false);
};

const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setDeliveryAddress((prevState) => ({ ...prevState, zipCode: e.target.value }));
};



  return (
  <div className="oplysninger-container">

    <button className="næste-knap"><a href="oplysninger.html">Næste</a></button>

    <form>
  <h2>Leveringsadresse</h2>
  <label>
    Navn
    <input type="text" name="name" required />
  </label>
  <label>
    Telefon
    <input type="tel" name="phone" required />
  </label>
  <label>
    E-mail
    <input type="email" name="email" required />
  </label>
  <label>
    Adresse 1
    <input type="text" name="address1" required />
  </label>
  <label>
    Adresse 2
    <input type="text" name="address2" />
  </label>
  <label>
    Postnummer
    <input type="text" name="zipcode" required onChange={handleZipCodeChange} />
    {zipCodeError && <span className="error">Ugyldigt postnummer</span>}

  </label>
  <label>
    By
    <input type="text" name="city" required />
  </label>
  <label>
    Land
    <input type="text" name="country" value="Denmark" disabled />
  </label>

  <h2>Faktureringsadresse</h2>
  <label>
    Navn
    <input type="text" name="billingName" required />
  </label>
  <label>
    Telefon
    <input type="tel" name="billingPhone" required />
  </label>
  <label>
    E-mail
    <input type="email" name="billingEmail" required />
  </label>
  <label>
    Adresse 1
    <input type="text" name="billingAddress1" required />
  </label>
  <label>
    Adresse 2
    <input type="text" name="billingAddress2" />
  </label>
  <label>
    Postnummer
     <input type="text" name="zipcode" required onChange={handleZipCodeChange} />
    {zipCodeError && <span className="error">Ugyldigt postnummer</span>}
  </label>
  <label>
    By
    <input type="text" name="billingCity" required />
  </label>
  <label>
    Land
    <input type="text" name="billingCountry" value="Denmark" disabled />
  </label>

</form>
     <button className="next-button" onClick={handleNext}>
         Næste
       </button>
  </div>
  );
};

export default oplysninger;


