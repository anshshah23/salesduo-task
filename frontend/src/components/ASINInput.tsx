import React, { useState } from 'react';

const ASINInput = ({ onSubmit }) => {
  const [asin, setAsin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (asin) {
      onSubmit(asin);
      setAsin('');
    }
  };

  const asinValidate = (asin) => {
    asin = asin.trim();
    asin = asin.toUpperCase();
    const asinPattern = /^[A-Z0-9]{10}$/;
    return asinPattern.test(asin);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Enter the ASIN code here</h1>
      <input
        type="text"
        value={asin}
        onChange={(e) => setAsin(e.target.value)}
        onBlur={() => {
          if (!asinValidate(asin)) {
            alert('Invalid ASIN code. Please enter a valid 10-character ASIN.');
          }
        }}
        placeholder="ASIN Code"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ASINInput;