import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="flex flex-col p-4 border rounded-lg shadow-md bg-white">
      <div className="flex items-center mb-3">
        <div className="text-yellow-500 flex">
          {[...Array(5)].map((_, i) => (
            <span key={i}>{i < (review.rating || 0) ? "?" : "?"}</span>
          ))}
        </div>
        <span className="ml-2 text-gray-600">{review.rating || 0}/5</span>
      </div>
      <p className="text-gray-800 mb-3">{review.comment}</p>
      <div className="mt-auto text-sm text-gray-500">
        <span>Por {review.author}</span>
        <span className="mx-2">•</span>
        <span>{review.date}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
