import React from 'react';

interface OptimizedListingProps {
  optimizedData: {
    title: string;
    bulletPoints: string[];
    description: string;
    keywords: string[];
  } | null;
}

const OptimizedListing: React.FC<OptimizedListingProps> = ({ optimizedData }) => {
  if (!optimizedData) {
    return <div>No optimized data available.</div>;
  }

  return (
    <div id='optimized'>
      <h2>Optimized Product Listing</h2>
      <h3>{optimizedData.title}</h3>
      <h4>Bullet Points:</h4>
      <ul>
        {optimizedData.bulletPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <h4>Description:</h4>
      <p>{optimizedData.description}</p>
      <h4>Keywords:</h4>
      <p>{optimizedData.keywords.join(', ')}</p>
    </div>
  );
};

export default OptimizedListing;