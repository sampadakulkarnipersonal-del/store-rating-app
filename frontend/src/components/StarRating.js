import React, { useState } from 'react';

const StarRating = ({ value = 0, onChange, readOnly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);

  const sizeClass = size === 'sm' ? '0.85rem' : size === 'lg' ? '1.5rem' : '1.1rem';

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || value) ? 'filled' : 'empty'}`}
          style={{
            fontSize: sizeClass,
            cursor: readOnly ? 'default' : 'pointer',
          }}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
        >
          ★
        </span>
      ))}
      {value > 0 && (
        <span className="rating-text">{Number(value).toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
