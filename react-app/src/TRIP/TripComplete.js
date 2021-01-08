import React from 'react';
import EndModal from './EndModal';
import endImage from '../assets/endmodal.jpg';
import TripSummary from './TripSummary';

export default function TripComplete() {
  return (
    <div className='complete-wrapper' style={{ textAlign: 'center' }}>
      <h2>You're all Set! Happy Adventuring!</h2>
      <TripSummary view={true} />
      <img src={endImage} style={{ width: '100%' }} />
      <EndModal />
    </div>
  );
}
