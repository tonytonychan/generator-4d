import './LoadingIndicator.css';
import React from 'react';

const LoadingIndicator: React.FC<{ colorScheme: 'dark' | 'light' }> = props => {
  return (
    <div className={'lds-roller ' + props.colorScheme}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingIndicator;
