import React from 'react';
import ASINInput from '../components/ASINInput';
import OriginalListing from '../components/OriginalListing';
import OptimizedListing from '../components/OptimizedListing';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Amazon Product Listing Optimizer</h1>
      <ASINInput />
      <OriginalListing />
      <OptimizedListing />
    </div>
  );
};

export default Home;