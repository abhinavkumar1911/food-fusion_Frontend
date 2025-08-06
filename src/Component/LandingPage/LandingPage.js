import React from 'react';
import './LandingPage.css'
import Menuitems from '../Menuitems/Menuitems';

function LandingPage() {
  return (
    <div className='header'>
        
        <div className='header-contents'>
            <h2>Order your favourite food here</h2>
            <p>"Food delivery apps have revolutionized the way people order meals, bringing restaurants and customers closer than ever before. These apps provide a convenient platform for browsing diverse menus, placing orders with just a few taps, and tracking deliveries in real-time</p>
            <button>View Menu</button>
        </div>

    </div>
  )
}
<Menuitems/>

export default LandingPage