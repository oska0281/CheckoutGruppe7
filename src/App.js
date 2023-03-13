import React from 'react';
import Checkout from './Checkout';
import profilePic from './images/profile.png'

function App() {
    return (
        
        <div>


            <header>
                <div className="header-text">
                    <h1 className="shopnavn">MyStore</h1>
                    <p className="Tilbage-til-butikken">Tilbage til butikken</p>
                </div>


                <div>
                    <p className="Levering">Gratis levering på alle ordrer over 499DKK og få 10% ved køb af over 300DKK-</p>
                  
                    <img className='Profile' src={profilePic} alt='profile'/>
                    <a className='Log-ind' href='login.html' target=''>Log ind</a>
                    
                </div>


            </header>


            <Checkout/>
        </div>
    );
}

export default App;