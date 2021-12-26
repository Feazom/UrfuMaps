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
            <text>Cabinet: {position.cabinet}</text>
            <text>Description: {position.description}</text>
            <text>X: {position.x}</text>
            <text>Y: {position.y}</text>
          </div>
        );
      })}
    </div>
  );
};

export default PositionCards;
