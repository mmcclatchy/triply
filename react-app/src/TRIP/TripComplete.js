import React from 'react';
import EndModal from './EndModal';
import endImage from '../assets/endmodal.jpg';
import TripSummary from './TripSummary';
import confetti from '../assets/confetti.svg';

export default function TripComplete() {
  return (
    <div
      className='complete-wrapper'
      style={{ textAlign: 'center', margin: '15%' }}>
      <img src={confetti} style={{ width: '50px' }} />
      <h2>You're all Set! Happy Adventuring!</h2>
      <TripSummary view={true} />
      <img src={endImage} style={{ width: '100%' }} />
      <h2>How should we send your Itinerary?</h2>
      <EndModal />
    </div>
  );
}
