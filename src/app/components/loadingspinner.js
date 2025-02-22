import React from 'react';
import ReactLoading from 'react-loading';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ReactLoading type="spin" color="#000" height={100} width={100} />
    </div>
  );
};

export default LoadingSpinner;
