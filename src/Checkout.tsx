import React, {useState} from 'react';
import './checkout.css';
import itemsData from './products.json';

type Item = {
  id: string;
  name: string;
  price: number;
  currency: string;
  rebateQuantity?: number;
  rebatePercent?: number;
  upsellProductId?: string | null;
};

type CartItem = Item & {
  quantity: number;
  rebateQuantity?: number;
  rebatePercent?: number;
  rebateAmount?: number;
};

/*skal bruges til adressetjek
type Address = {
  country: string;
  zipCode: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  name: string;
  phone: string;
  email: string;
  companyName: string;
  companyVATNumber: string;
};
*/
const Checkout = (): JSX.Element => {
  const [cart, setCart] = useState<CartItem[]>([]);
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

//tilføjer vare til cart
  const addToCart = (itemId: string) => {
    const item = itemsData.find((i) => i.id === itemId);
    const index = cart.findIndex((i) => i.id === itemId);

    if (index === -1) {
      setCart([...cart, {...item!, quantity: 1}]);
    } else {
      const newCart = [...cart];
      const currentItem = newCart[index];
      currentItem.quantity += 1;
      if (
          currentItem.rebateQuantity &&
          currentItem.quantity < currentItem.rebateQuantity
      ) {
        currentItem.rebateAmount = 0;
      }
      setCart(newCart);
    }
  };
//til at fjerne fra kurv
  //fjerne 1 vare
  const removeOne = (itemId: string) => {
    const index = cart.findIndex((i) => i.id === itemId);

    if (cart[index].quantity === 1) {
      setCart(cart.filter((i) => i.id !== itemId));
    } else {
      const newCart = [...cart];
      newCart[index].quantity -= 1;
      setCart(newCart);
    }
  };
  //fjerne vare
  const removeItem = (itemId: string) => {
    const newCart = cart.filter((i) => i.id !== itemId);
    setCart(newCart);
  };
  //fjerner alle varene
  const removeAllItems = () => {
    setCart([]);
  };


//udregner subtotalen
  const subtotal = (item: CartItem) => {
    if (item.rebateQuantity && item.quantity >= item.rebateQuantity) {
      const discount = item.price * item.quantity * (item.rebatePercent! / 100);
      item.rebateAmount = discount;
      return item.price * item.quantity - discount;
    } else {
      item.rebateAmount = 0;
      return item.price * item.quantity;
    }
  };

//udregner total
  const total = cart.reduce((acc, item) => acc + subtotal(item), 0);
//udregner hvor meget man sparer ved mængdetilbud
  const totalSavingsQuantity = cart.reduce((acc, item) => acc + (item.rebateAmount ?? 0), 0);


  //udregner den discountede pris på 10% rabat hvis totalen er over 300
  const discountedPrice = total >= 300 ? total * 0.9 : total;

  //udregner det man sparer ved at købe over 300
  const discountedSavings = (item: CartItem) => {
    return total - discountedPrice
  };

  const totalDiscountedSavings = cart.reduce((acc, item) => acc + discountedSavings(item), 0);

//udregner moms
  const tax = (item: CartItem) => {
    const taxRate = 0.25; // 25% moms
    return subtotal(item) * taxRate;
  };
  //den samlede moms af total
  const totalTax = cart.reduce((acc, item) => acc + tax(item), 0);

  /*todo tilføj så den viser pris uden moms
  const subtotalWithoutTax = (item: CartItem) => {
    return subtotal(item) - tax(item);
  };
*/


//zip tjekker todo gør så der også bliver sat zip kode ind automatisk
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
    setDeliveryAddress((prevState) => ({...prevState, zipCode: e.target.value}));
  };

//TODO til render gør måske så indtast af navn mm. foregår på ny side
  //TODO istedet for email checker med tegn så brug email checker api fx "mailboxlayer"
  return (
      <div className="checkout-container">
        <h1>Din kurv</h1>
        <table className="cart-table">
          <thead>
          <tr>
            <th>Navn</th>
            <th>Pris</th>
            <th>Mængde</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
          </thead>
          <tbody>{itemsData.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.name}

                </td>
                <td>{item.price} {item.currency}</td>
                <td className="quantity-cell">
                  <div className="quantity-buttons">
                    <button onClick={() => addToCart(item.id)}>+</button>
                    <span>{cart.find((i) => i.id === item.id)?.quantity ?? 0}</span>
                    <button onClick={() => removeOne(item.id)}>-</button>
                  </div>
                  {(item.rebateQuantity && item.rebatePercent) && (
                       <div className="rebate-message">

                                    {cart.find((i) => i.id === item.id)?.quantity === 0 && cart.length > 0 ? (
                                        <>
                                        </>
                                    ) : (
                                        (item.rebateQuantity && item.rebatePercent) && (!cart.find((i) => i.id === item.id) || cart.find((i) => i.id === item.id)?.quantity! < item.rebateQuantity) ? (
                                            `Tilføj ${item.rebateQuantity - (cart.find((i) => i.id === item.id)?.quantity || 0)} mere for ${item.rebatePercent}% rabat`
                                        ) : (
                                            ` `
                                        )
                                    )}
                                </div>
                            )}
                            <button className="remove-button" onClick={() => removeItem(item.id)}>Fjern</button>
                        </td>
                <td>
                  {cart.find((i) => i.id === item.id) &&
                      (subtotal(cart.find((i) => i.id === item.id)!) ?? item)}{" "}
                  {item.currency}
                </td>
              </tr>
          ))}
          <tr>
            <td colSpan={3}>Subtotal inkl. moms</td>
            <td><strong>{discountedPrice.toFixed(2)} DKK</strong></td>
          </tr>
          {totalSavingsQuantity > 0 && (
              <tr>
                <td colSpan={3}>Penge sparet ved mængde-tilbud</td>
                <td>{totalSavingsQuantity} DKK</td>
              </tr>

          )}
          <tr>
            <td colSpan={3}>Moms udgør</td>
            <td>{totalTax.toFixed(2)} DKK</td>
          </tr>
          {discountedPrice < total && (
              <tr>
                <td colSpan={3}>Da du har købt for over 300DKK sparer du</td>
                <td>{totalDiscountedSavings.toFixed(2)} DKK</td>
              </tr>
          )}
          </tbody>
        </table>
        <div className="actions">
          {cart.length > 0 && (
              <button className="clear-button" onClick={removeAllItems}>
                Fjern alle varer
              </button>
          )}
        </div>
        <form>
          <h2>Leveringsadresse</h2>
          <label>
            Navn
            <input type="text" name="name" required/>
          </label>
          <label>
            Telefon
            <input type="tel" name="phone" required/>
          </label>
          <label>
            E-mail
            <input type="email" name="email" required/>
          </label>
          <label>
            Adresse 1
            <input type="text" name="address1" required/>
          </label>
          <label>
            Adresse 2
            <input type="text" name="address2"/>
          </label>
          <label>
            Postnummer
            <input type="text" name="zipcode" required onChange={handleZipCodeChange}/>
            {zipCodeError && <span className="error">Ugyldigt postnummer</span>}

          </label>
          <label>
            By
            <input type="text" name="city" required/>
          </label>
          <label>
            Land
            <input type="text" name="country" value="Denmark" disabled/>
          </label>

          <h2>Faktureringsadresse</h2>
          <label>
            Navn
            <input type="text" name="billingName" required/>
          </label>
          <label>
            Telefon
            <input type="tel" name="billingPhone" required/>
          </label>
          <label>
            E-mail
            <input type="email" name="billingEmail" required/>
          </label>
          <label>
            Adresse 1
            <input type="text" name="billingAddress1" required/>
          </label>
          <label>
            Adresse 2
            <input type="text" name="billingAddress2"/>
          </label>
          <label>
            Postnummer
            <input type="text" name="zipcode" required onChange={handleZipCodeChange}/>
            {zipCodeError && <span className="error">Ugyldigt postnummer</span>}
          </label>
          <label>
            By
            <input type="text" name="billingCity" required/>
          </label>
          <label>
            Land
            <input type="text" name="billingCountry" value="Denmark" disabled/>
          </label>

        </form>
        <button className="next-button" onClick={handleNext}>
          Næste
        </button>
      </div>
  );
};

export default Checkout;
