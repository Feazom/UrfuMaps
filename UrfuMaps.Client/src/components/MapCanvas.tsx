import Konva from 'konva';
import {
	Dispatch,
	memo,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Line, Layer } from 'react-konva';
import {
	getMap,
	getPosition,
	getRoute,
	wrapRequest,
} from '../services/RequestService';
import URLImage from './URLImage';
import RouteSegmentDTO from '../types/RouteSegmentDTO';
import { canvaPosition } from '../services/utils';
import { OrientationContext } from '../context';
import MarkCanvas from './MarkCanvas';
import { Floor } from '../types';
import PointCanvas from './PointCanvas';
import DraggableStage from './DraggableStage';
import styles from '../styles/map.module.css';
import { useForceUpdate } from '../hooks';
import { useQuery } from 'react-query';
import PositionDTO from '../types/PositionDTO';

type MapProps = {
	floorNumber: number;
	route: RouteSegmentDTO[];
	setRoute: Dispatch<SetStateAction<RouteSegmentDTO[]>>;
	buildingName: string;
	destination: string;
	source: string;
	floorSelect: JSX.Element;
	buildingSelect: JSX.Element;
};

const MapCanvas = ({
	floorSelect,
	buildingSelect,
	floorNumber,
	buildingName,
	destination,
	source,
	route,
	setRoute,
}: MapProps) => {
	const [segment, setSegment] = useState<RouteSegmentDTO>();
	const [width, setWidth] = useState(window.innerWidth * 0.8);
	const [height, setHeight] = useState(window.innerHeight * 0.95);
	const forceUpdate = useForceUpdate();

	const orientation = useContext(OrientationContext);
	const imageRef = useRef<Konva.Image>(null);

	const { data: floor } = useQuery(
		['floor', floorNumber, buildingName],
		async () => {
			try {
				const data = await wrapRequest(
					getMap(floorNumber, buildingName)
				);
				if (data) {
					const positionsDict: Record<number, PositionDTO> = {};
					for (const pos of data.positions) {
						positionsDict[pos.id] = pos;
					}
					return {
						id: data.id,
						buildingName: data.buildingName,
						floorNumber: data.floorNumber,
						imageLink: data.imageLink,
						positions: positionsDict,
					} as Floor;
				}
			} catch (error) {
				throw error;
			}
		}
	);
	const { data: sourceData } = useQuery(
		['position', source],
		() => {
			return wrapRequest(getPosition(source));
		},
		{ retry: false, enabled: Boolean(source) && source.length > 0 }
	);
	const { data: destinationData } = useQuery(
		['position', destination],
		() => {
			return wrapRequest(getPosition(destination));
		},
		{
			retry: false,
			enabled: Boolean(destination) && destination.length > 0,
		}
	);
	const { data: routeData } = useQuery(
		['route', sourceData?.id, destinationData?.id],
		() => {
			return wrapRequest(getRoute(sourceData!.id, destinationData!.id));
		},
		{ enabled: !!sourceData?.id && !!destinationData?.id }
	);

	const dstMarker = useCallback(() => {
		if (destinationData && imageRef.current) {
			if (floor?.positions[destinationData.id]) {
				const position = floor?.positions[destinationData.id];
				const convertedPosition = canvaPosition(
					{
						x: position.x,
						y: position.y,
					},
					imageRef.current
				);
				return (
					<MarkCanvas
						x={convertedPosition.x}
						y={convertedPosition.y}
						color="red"
					/>
				);
			}
		}
		return null;
	}, [floor, destinationData, imageRef.current]);

	const srcMarker = useCallback(() => {
		if (sourceData && imageRef.current) {
			if (floor?.positions[sourceData.id]) {
				const position = floor?.positions[sourceData.id];
				const convertedPosition = canvaPosition(
					{
						x: position.x,
						y: position.y,
					},
					imageRef.current
				);
				return (
					<PointCanvas
						x={convertedPosition.x}
						y={convertedPosition.y}
					/>
				);
			}
		}
		return null;
	}, [floor, sourceData, imageRef.current]);

	useEffect(() => {
		setRoute((r) => {
			return routeData || r;
		});
	}, [routeData]);

	useEffect(() => {
		if (orientation === 'landscape') {
			setWidth(window.innerWidth * 0.8);
			setHeight(window.innerHeight * 0.94);
		} else {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight * 0.75);
		}
		forceUpdate();
	}, [orientation]);

	useEffect(() => {
		setSegment(
			route.find(
				(r) =>
					r.building === floor?.buildingName &&
					r.floor === floor.floorNumber
			)
		);
	}, [route, floor]);

	return (
		<div className={styles.map}>
			<div className={styles.mselect}>
				{buildingSelect}
				{floorSelect}
			</div>
			<DraggableStage width={width} height={height}>
				<Layer>
					{floor?.imageLink && (
						<URLImage
							ref={imageRef}
							maxWidth={width}
							maxHeight={height}
							src={floor?.imageLink}
							setUpdate={forceUpdate}
						/>
					)}
					{segment && imageRef.current && (
						<Line
							lineJoin="round"
							lineCap="round"
							stroke="green"
							strokeWidth={4}
							points={
								segment.ids
									.flatMap((id) => {
										const position = floor?.positions[id];

										if (position) {
											const convertedPosition =
												canvaPosition(
													{
														x: position.x,
														y: position.y,
													},
													imageRef.current!
												);

											return [
												convertedPosition.x,
												convertedPosition.y,
											];
										}
										return null;
									})
									.filter((n) => n) as number[]
							}
						/>
					)}

					{dstMarker()}
					{srcMarker()}
				</Layer>
			</DraggableStage>
		</div>
	);
};
export default memo(MapCanvas);
