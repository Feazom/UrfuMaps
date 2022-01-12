import { useState, useEffect, CSSProperties} from 'react';
import InfoDTO from '../DTOs/InfoDTO';
import FloorDTO from '../DTOs/FloorDTO';
import env from 'react-dotenv';
import './Map.css';

type MapProps = {
  floorNumber: number | null;
  buildingName: string | null;
  searchedCabinet: string;
};
const Map = ({
  floorNumber,
  buildingName,
  searchedCabinet,
}: MapProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [floor, setFloor] = useState<FloorDTO>();

  useEffect(() => {
    if(!isNaN(parseInt(searchedCabinet[(searchedCabinet.search("-")+1)]))){
      if(searchedCabinet.search("-") !== -1){
        if(searchedCabinet[(searchedCabinet.search("-")+1)] != null){
          floorNumber = Number(searchedCabinet[(searchedCabinet.search("-")+1)]);
        }
      }  
    }
  },[searchedCabinet])

  useEffect(() => {
    (async () => {
      if (floorNumber != null && buildingName != null) {
        const schemeResponse = await fetch(
          `${env.API_DOMAIN}/map?floor=${floorNumber}&building=${buildingName}`,
          {
            method: 'GET',
          }
        );

        setFloor(await schemeResponse.json());

        if (schemeResponse.ok) {
          setIsLoading(false);
        }
      }
    })();
  }, [buildingName, floorNumber, searchedCabinet]);

  return (
    <div className="map-scheme">
      {isLoading ? (
        <img src="loading-icon.svg" className="loading-icon" alt="" />
      ) : (
        <div className="container">
          <img className="map-image" src={floor?.imageLink} alt="floor map" />
          {floor?.positions.map((postition) => {
            const positionCoords: CSSProperties = {
              top: `${postition.y}%`,
              left: `${postition.x}%`,
            };
            return postition.cabinet === searchedCabinet ? (
              <img
                className="map-marker"
                key={postition.cabinet}
                src="marker-icon.svg"
                alt="mark"
                style={positionCoords}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default Map;
