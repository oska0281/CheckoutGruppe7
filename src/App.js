import React from 'react';
import Checkout from './Checkout';

function App() {
  return (
    <div>


        <header>
            <div className="header-text">
                <h1 className="shopnavn">MyStore</h1>
                <p className="Tilbage-til-butikken">Tilbage til butikken</p>
            </div>


            <div>
                <p className="Levering">Gratis levering på alle ordrer over 499Kr og 10% på alle ordrer over 300Kr</p>
                <p className="Log-ind">Log ind</p>
            </div>





        </header>


        <Checkout />
    </div>
  );
}

export default App;