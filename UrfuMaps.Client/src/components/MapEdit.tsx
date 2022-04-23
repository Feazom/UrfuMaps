import { KonvaEventObject } from 'konva/lib/Node';
import {
	useRef,
	CSSProperties,
	SetStateAction,
	Dispatch,
	useState,
	useEffect,
} from 'react';
import { Circle, Layer, Line, Stage } from 'react-konva';
import CreatePositionDTO from '../DTOs/CreatePositionDTO';
import { EdgeDTO } from '../DTOs/EdgeDTO';
import EdgeDTOSet from '../EdgeDTOSet';
import EdgeSet from '../EdgeSet';
import { Edge, Point, PointSelected } from '../types';
import './UploadMap.css';
import URLImage from './URLImage';

type MapEditProps = {
	setPositions: Dispatch<SetStateAction<CreatePositionDTO[]>>;
	positions: CreatePositionDTO[];
	link: string;
	selected: PointSelected;
	setSelected: Dispatch<SetStateAction<PointSelected>>;
	setEdges: Dispatch<SetStateAction<EdgeDTOSet>>;
};

const MapEdit = ({
	setEdges,
	selected,
	setSelected,
	setPositions,
	link,
	positions,
}: MapEditProps) => {
	const width = window.innerWidth - 50;
	const height = window.innerHeight - 170;
	const layerRef = useRef<any>(null);
	const circleRadius = 5;
	const [lastId, setLastId] = useState(1);
	const [pointEdges, setPointEdges] = useState<EdgeSet>(new EdgeSet([]));
	const [edgeSetted, setEdgeSetted] = useState(false);
	const [edge, setEdge] = useState<Edge>();

	useEffect(() => {
		if (edgeSetted) {
			setTimeout(() => {
				setEdge(undefined);
			}, 50);
		}
	}, [edgeSetted]);

	useEffect(() => {
		const newEdges = new EdgeDTOSet([]);
		for (const edge of pointEdges) {
			if (edge.source?.id && edge.destination?.id)
				newEdges.add({
					sourceId: edge.source.id,
					destinationId: edge.destination.id,
				});
		}
		setEdges((e) => {
			if (newEdges.edges.length === e.edges.length) {
				return e;
			} else {
				return newEdges;
			}
		});
	}, [pointEdges]);

	useEffect(() => {
		if (edge?.source?.id === edge?.destination?.id && edge?.source?.id) {
			const id = edge?.source.id;
			if (selected.type === 'position' || selected.type == null) {
				if (selected.id === id) {
					setSelected({ type: null });
				} else {
					setSelected({ type: 'position', id });
				}
			}
		} else {
			if (edge?.source?.id && edge?.destination?.id) {
				setPointEdges((e) => {
					const newEdges = new EdgeSet(e.edges);
					newEdges.add(edge);
					return newEdges;
				});
			}
		}
	}, [edge]);

	function handleRightClick(event: KonvaEventObject<PointerEvent>) {
		event.evt.preventDefault();
		if (selected.type === 'position' || selected.type === null) {
			const id = parseFloat(event.currentTarget.attrs.id);
			setPositions((p) => p.filter((n) => n.localId !== id));
		}
	}

	function handleMapClick(event: KonvaEventObject<globalThis.MouseEvent>) {
		if (selected.type === 'position' || selected.type == null) {
			const backgroundHeight: number =
				layerRef?.current?.children?.[0]?.attrs?.height;
			const backgroundWidth: number =
				layerRef?.current?.children?.[0]?.attrs?.width;

			const point = event.currentTarget.getRelativePointerPosition();

			point.x = parseFloat(
				((point.x / backgroundWidth) * 100).toFixed(4)
			);
			point.y = parseFloat(
				((point.y / backgroundHeight) * 100).toFixed(4)
			);

			const newPosition = {
				localId: lastId,
				x: point.x,
				y: point.y,
				name: '',
				description: '',
				relatedWith: [],
				type: '',
			};

			setPositions((p) => [...p, newPosition]);
			setSelected({ type: 'position', id: newPosition.localId });
			setLastId((l) => l + 1);
		}
	}

	function handleDragMove(event: KonvaEventObject<DragEvent>) {
		setPointEdges((e) => {
			const newPointEdges = new EdgeSet(e.edges);
			for (const edge of e) {
				let src = edge.source;
				let dst = edge.destination;
				if (src && dst) {
					if (src.id === parseInt(event.target.attrs.id)) {
						src.x = parseFloat(event.target.attrs.x);
						src.y = parseFloat(event.target.attrs.y);
					}

					if (dst.id === parseInt(event.target.attrs.id)) {
						dst.x = parseFloat(event.target.attrs.x);
						dst.y = parseFloat(event.target.attrs.y);
					}
					newPointEdges.add({ source: src, destination: dst });
				}
				newPointEdges.add(edge);
			}
			return newPointEdges;
		});
	}

	function handleDragEnd(event: KonvaEventObject<DragEvent>) {
		const backgroundHeight: number =
			layerRef?.current?.children?.[0]?.attrs?.height;
		const backgroundWidth: number =
			layerRef?.current?.children?.[0]?.attrs?.width;

		setPositions((p) =>
			p.map((position) => {
				if (position.localId === parseInt(event.target.attrs.id)) {
					const point = {
						x: parseFloat(event.target.attrs.x),
						y: parseFloat(event.target.attrs.y),
					};

					return {
						localId: position.localId,
						name: position.name,
						description: position.description,
						type: position.type,
						x: parseFloat(
							((point.x / backgroundWidth) * 100).toFixed(4)
						),
						y: parseFloat(
							((point.y / backgroundHeight) * 100).toFixed(4)
						),
					};
				}
				return position;
			})
		);
	}

	function handleMouseUp(event: KonvaEventObject<MouseEvent>) {
		const id = parseInt(event.target.attrs.id);
		const x: number = event.target.attrs.x;
		const y: number = event.target.attrs.y;
		setEdge((e) => {
			if (e) {
				return { source: e.source, destination: { id, x, y } };
			}
			return e;
		});
		setEdgeSetted(true);
	}

	function handleMouseDown(event: KonvaEventObject<MouseEvent>) {
		setEdgeSetted(false);
		const id = parseInt(event.target.attrs.id);
		const x: number = event.target.attrs.x;
		const y: number = event.target.attrs.y;
		setEdge((e) => ({
			source: { id, x, y },
			destination: e?.destination,
		}));
	}

	return (
		<div
			style={
				{ display: 'flex', flexDirection: 'column' } as CSSProperties
			}
		>
			<Stage width={width} height={height} className="edited-map-image">
				<Layer ref={layerRef}>
					{link.length !== 0 ? (
						<>
							<URLImage
								src={link}
								maxWidth={width}
								maxHeight={height}
								onClick={handleMapClick}
							/>
							{Array.from(pointEdges).map((edge) => {
								if (edge.destination && edge.source) {
									return (
										<Line
											key={
												edge.source.id.toString() +
												edge.destination.id.toString()
											}
											lineJoin="round"
											lineCap="round"
											stroke="red"
											strokeWidth={4}
											points={[
												edge.source.x,
												edge.source.y,
												edge.destination.x,
												edge.destination.y,
											]}
										/>
									);
								}
								return null;
							})}
							{positions.map((position) => {
								const backgroundHeight: number =
									layerRef?.current?.children?.[0]?.attrs
										?.height;
								const backgroundWidth: number =
									layerRef?.current?.children?.[0]?.attrs
										?.width;

								return (
									<Circle
										id={position.localId.toString()}
										key={position.localId}
										x={(position.x / 100) * backgroundWidth}
										y={
											(position.y / 100) *
											backgroundHeight
										}
										fill="red"
										radius={circleRadius}
										// onClick={handleCircleClick}
										onContextMenu={handleRightClick}
										strokeWidth={circleRadius / 2}
										onDragEnd={handleDragEnd}
										onDragMove={handleDragMove}
										onMouseUp={handleMouseUp}
										onMouseDown={handleMouseDown}
										draggable
										stroke={
											position.localId === selected.id
												? 'black'
												: 'red'
										}
									/>
								);
							})}
						</>
					) : null}
				</Layer>
			</Stage>
		</div>
	);
};

export default MapEdit;
