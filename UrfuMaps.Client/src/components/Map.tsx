import { useState, useEffect, CSSProperties } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import FloorDTO from '../DTOs/FloorDTO';
import { getMap } from '../services/RequestService';
import './Map.css';

type MapProps = {
  floorNumber: number;
  setFloorNumber: Function;
  buildingName: string | null;
  searchedCabinet: string;
};
const Map = ({
  floorNumber,
  setFloorNumber,
  buildingName,
  searchedCabinet,
}: MapProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [floor, setFloor] = useState<FloorDTO>();
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    if (!isNaN(parseInt(searchedCabinet[searchedCabinet.search('-') + 1]))) {
      if (searchedCabinet.search('-') !== -1) {
        if (searchedCabinet[searchedCabinet.search('-') + 1] != null) {
          setFloorNumber(
            Number(searchedCabinet[searchedCabinet.search('-') + 1])
          );
        }
      }
    }
  }, [searchedCabinet, setFloorNumber, update]);

  useEffect(() => {
    (async () => {
      if (floorNumber != null && buildingName != null) {
        const schemeResponse = await getMap(floorNumber, buildingName);

        if (schemeResponse.ok) {
          setFloor(await schemeResponse.json());
          setIsLoading(false);
        }
      }
    })();
  }, [buildingName, floorNumber, searchedCabinet]);

  return (
    <>
      {isLoading ? (
        <img src="loading-icon.svg" className="loading-icon" alt="" />
      ) : (
        <TransformWrapper limitToBounds>
          {({ zoomToElement }) => (
            <>
              <div>
                <button
                  className="search-button"
                  onClick={() => {
                    setUpdate(!update);
                    zoomToElement(searchedCabinet, 2);
                  }}
                >
                  <img src="search-icon.svg" alt="🔎" />
                </button>
              </div>
              <TransformComponent>
                <div className="container">
                  <img
                    className="map-image"
                    src={floor?.imageLink}
                    alt="floor map"
                  />
                  {floor?.positions.map((position) => {
                    const positionCoords: CSSProperties = {
                      top: `${position.y}%`,
                      left: `${position.x}%`,
                    };
                    return position.cabinet === searchedCabinet ? (
                      <img
                        className="map-marker"
                        key={position.cabinet}
                        id={position.cabinet}
                        src="marker-icon.svg"
                        alt="#"
                        style={positionCoords}
                      />
                    ) : null;
                  })}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}
    </>
  );
};

export default Map;
