
import React, { useState, useEffect } from 'react';
import './App.css';

const UNSPLASH_ACCESS_KEY = 'ZtVzVDNcTG1LPOP_PewnVJ4zKffVRtueNZasdcUb0sE';
const UNSPLASH_API_URL = `https://api.unsplash.com/photos/random?count=9&client_id=${UNSPLASH_ACCESS_KEY}`;
const CUSTOMERS_API_URL = 'https://jsonplaceholder.typicode.com/users?_limit=100';

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerImages, setCustomerImages] = useState([]);
  const [photoGridIndex, setPhotoGridIndex] = useState(0);

  useEffect(() => {
    fetch(CUSTOMERS_API_URL)
      .then(response => response.json())
      .then(data => {
        setCustomers(data);
      })
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(UNSPLASH_API_URL);
        const data = await response.json();
        setCustomerImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    
    fetchImages();
    const interval = setInterval(fetchImages, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCustomerSelect = customer => {
    setSelectedCustomer(customer);
  };

  const renderPhotoGrid = () => {
    if (!selectedCustomer) return null;
    const startIndex = photoGridIndex * 9;
    const endIndex = startIndex + 9;
    const photoGrid = customerImages.map(image => (
      <div key={image.id} className="photo-item">
        <img src={image.urls.regular} alt={`Photo ${image.id}`} />
        <div className="photo-info">
         
        </div>
      </div>
    )).slice(startIndex, endIndex);
    return <div className="photo-grid">{photoGrid}</div>;
  };

  return (
    <div className="app">
      <div className="customer-list">
        {customers.map(customer => (
          <div
            key={customer.id}
            className={`customer-card ${selectedCustomer && selectedCustomer.id === customer.id ? 'selected' : ''}`}
            onClick={() => handleCustomerSelect(customer)}
          >
            <h3>{customer.name}</h3>
            <p>{customer.company.name}</p>
          </div>
        ))}
      </div>
      <div className="customer-details">
        {selectedCustomer && (
          <>
            <h2>{selectedCustomer.name}</h2>
            <p>{selectedCustomer.title}</p>
            <p>{selectedCustomer.address.street}, {selectedCustomer.address.city}</p>
            {renderPhotoGrid()}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
