import React from 'react';

interface OriginalListingProps {
  title: string;
  description: string;
  bulletPoints: string[];
}

const OriginalListing: React.FC<OriginalListingProps> = ({ title, description, bulletPoints }) => {
  return (
    <div id='original'>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {bulletPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default OriginalListing;