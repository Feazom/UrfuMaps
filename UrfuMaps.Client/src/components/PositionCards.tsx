import PositionDTO from '../DTOs/PositionDTO';
import '../components/PositionCards.css';

type PositionCardsProps = {
  positions: PositionDTO[];
};

const PositionCards = ({ positions }: PositionCardsProps) => {
  return (
    <div className="card-list">
      {positions.map((position, index) => {
        return (
          <div key={index} className="card">
            <label>Cabinet: {position.cabinet}</label>
            <label>Description: {position.description}</label>
            <label>X: {position.x}</label>
            <label>Y: {position.y}</label>
          </div>
        );
      })}
    </div>
  );
};

export default PositionCards;
