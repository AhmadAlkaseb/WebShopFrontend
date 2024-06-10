import {useState} from 'react';
import {PRODUCTION_API_BASE_URL} from "../utils/globalVariables.js";
import styled from "styled-components";


const Container = styled.div`
    margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


export default function SetItemForSale () {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    fullName: '',
    address: '',
    zipCode: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [itemCreated, setItemCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'zipCode' || name === 'phoneNumber') {
      if (!/^\d*$/.test(value)) {
        setErrors({
          ...errors,
          [name]: 'Must be a number'
        });
      } else {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    }
  };

  const handleSubmit = (e) => {

      //console.log(e); // her får vi printet alle properties som vores SyntheticEvent indeholder

      e.preventDefault(); //vil denne funktion genindlæse siden, hvilket
                        // forhindrer JavaScript i at håndtere dataene og sende dem til serveren korrekt

      // Check for errors before submission
    if (Object.keys(errors).length > 0) {
      console.error('Form has errors:', errors);
      return;
    }

    // Henter emailen fra localStorage
    const userEmail = sessionStorage.getItem('email');

    // Tilføjer emailen til formData, så jeg kan sende den med i body for at oprette et produkt
    const updatedFormData = { ...formData, user: {email: userEmail}};

    fetch(`${PRODUCTION_API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedFormData)
    })
        .then(response => response.json())
        .then(data => {
          console.log('printing response:', data);
          // Der skal lige tilføjes en tekst som fotæller at produktet er tilføjet.

          setFormData({
                title: '',
                description: '',
                price: '',
                fullName: '',
                address: '',
                zipCode: '',
              phoneNumber: ''
              }
          )
            setItemCreated(true);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  return (
      <Container>
      <form onSubmit={handleSubmit}>
          <div>
              <label>
                  Title:
                  <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                  />
              </label>
          </div>
          <div>
              <label>
                  Description:<br/>
                  <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                  />
              </label>
          </div>
          <div>
              <label>
                  Price:
                  <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                  />
              </label>
          </div>
          <div>
              <label>
                  Full Name:
                  <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                  />
              </label>
          </div>
          <div>
              <label>
                  Address:
                  <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                  />
              </label>
          </div>
          <div>
              <label>
                  Zip Code:
                  <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                  />
                  {errors.zipCode && <span>{errors.zipCode}</span>}
              </label>
          </div>
          <div>
              <label>
                  Phone Number:
                  <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                  />
                  {errors.phoneNumber && <span>{errors.phoneNumber}</span>}
              </label>
          </div>
          <button type="submit">Create Item</button>
      </form>
          {itemCreated && <h1>Item successfully created</h1>}
      </Container>
  );
}