import { KonvaEventObject } from 'konva/lib/Node';
import {
	useRef,
	CSSProperties,
	SetStateAction,
	Dispatch,
	useState,
	useEffect,
	MutableRefObject,
} from 'react';
import { Circle, Layer, Line } from 'react-konva';
import CreatePositionDTO from '../DTOs/CreatePositionDTO';
import {
	Edge,
	EdgeDict,
	EdgeDTODict,
	keyFromString,
	pair,
	PointSelected,
} from '../types';
import styles from '../styles/mapEdit.module.css';
import URLImage from './URLImage';
import Konva from 'konva';
import { apiPosition, canvaPosition, clone } from '../services/utils';
import { useForceUpdate } from '../hooks';
import DraggableStage from './DraggableStage';

type MapEditProps = {
	setPositions: Dispatch<SetStateAction<CreatePositionDTO[]>>;
	positions: CreatePositionDTO[];
	link: string;
	selected: PointSelected;
	setSelected: Dispatch<SetStateAction<PointSelected>>;
	edges: MutableRefObject<EdgeDTODict>;
	lastType: MutableRefObject<string>;
};

const circleRadius = 2;
const lineWidth = 3;
const bound = {
	min: 0.5,
	max: 200,
};

const MapEdit = ({
	edges,
	selected,
	setSelected,
	setPositions,
	link,
	positions,
	lastType,
}: MapEditProps) => {
	const width = useRef(window.innerWidth - 40);
	const height = useRef(window.innerHeight - 190);
	const imageRef = useRef<Konva.Image>(null);
	const stageRef = useRef<Konva.Stage>(null);
	const lastId = useRef(1);
	const [pointEdges, setPointEdges] = useState<EdgeDict>(new EdgeDict({}));
	const [edgeSetted, setEdgeSetted] = useState(false);
	const timeout = useRef<number>();
	const [edge, setEdge] = useState<Edge>();
	const forceUpdate = useForceUpdate();

	const offset = {
		x: imageRef.current?.x() || 0,
		y: imageRef.current?.y() || 0,
	};

	useEffect(() => {
		if (edgeSetted) {
			setTimeout(() => {
				setEdge(undefined);
			}, 50);
		}
	}, [edgeSetted]);

	useEffect(() => {
		window.clearTimeout(timeout.current);
		timeout.current = window.setTimeout(() => {
			for (const key of pointEdges.keys()) {
				edges.current.add(key);
			}
			for (const keyString of edges.current
				.keysString()
				.filter((x) => !pointEdges.keysString().includes(x))) {
				const key = keyFromString(keyString);
				edges.current.remove(key);
			}
		}, 100);
	}, [pointEdges, edges]);

	useEffect(() => {
		if (edge?.source?.id === edge?.destination?.id && edge?.source?.id) {
			const id = edge?.source.id;
			setSelected((sel) => {
				if (sel.type === 'position' || sel.type == null) {
					if (sel.id === id) {
						return { type: null };
					} else {
						return { type: 'position', id };
					}
				}
				return sel;
			});
		} else {
			if (edge?.source?.id && edge?.destination?.id) {
				setPointEdges((e) => {
					const newEdges = clone(e);
					newEdges.add(edge);
					return newEdges;
				});
			}
		}
	}, [edge]);

	function handleRightClickCircle(event: KonvaEventObject<PointerEvent>) {
		event.evt.preventDefault();
		if (selected.type === 'position' || selected.type === null) {
			const id = parseFloat(event.currentTarget.attrs.id);
			setPositions((p) => p.filter((n) => n.localId !== id));
			setPointEdges((e) => {
				const newEdges = clone(e);
				for (const key of e.keys()) {
					if (id === key.destinationId || id === key.sourceId) {
						newEdges.remove(key);
					}
				}
				return newEdges;
			});
		}
	}

	function handleRightClickLine(event: KonvaEventObject<PointerEvent>) {
		event.evt.preventDefault();
		const key = keyFromString(event.target.attrs.id);
		setPointEdges((e) => {
			const newEdges = clone(e);
			newEdges.remove(key);
			return newEdges;
		});
	}

	function handleMapClick(event: KonvaEventObject<globalThis.MouseEvent>) {
		if (selected.type === 'position' || selected.type == null) {
			const point = event.currentTarget.getRelativePointerPosition();

			const newPoint = apiPosition(
				point,
				imageRef.current?.getHeight(),
				imageRef.current?.getWidth(),
				offset
			);

			const newPosition = {
				localId: lastId.current,
				x: newPoint.x,
				y: newPoint.y,
				name: '',
				description: '',
				relatedWith: [],
				type: lastType.current.toString(),
			};

			setPositions((p) => [...p, newPosition]);
			setSelected({ type: 'position', id: newPosition.localId });
			lastId.current = lastId.current + 1;
		}
	}

	function handleDragMove(event: KonvaEventObject<DragEvent>) {
		setPointEdges((e) => {
			const newEdge = clone(e);
			const targetId = parseInt(event.target.attrs.id);
			const x = parseFloat(event.target.attrs.x);
			const y = parseFloat(event.target.attrs.y);

			for (const key of newEdge.keys()) {
				if (targetId === key.sourceId) {
					const temp = newEdge.get(key.sourceId, key.destinationId)!;
					newEdge.remove(key);
					temp.source!.x = x;
					temp.source!.y = y;
					newEdge.add(temp);
				}
				if (targetId === key.destinationId) {
					const temp = newEdge.get(key.sourceId, key.destinationId)!;
					newEdge.remove(key);
					temp.destination!.x = x;
					temp.destination!.y = y;
					newEdge.add(temp);
				}
			}
			return newEdge;
		});
	}

	function handleDragEnd(event: KonvaEventObject<DragEvent>) {
		setPositions((p) =>
			p.map((position) => {
				if (position.localId === parseInt(event.target.attrs.id)) {
					const point = {
						x: parseFloat(event.target.attrs.x),
						y: parseFloat(event.target.attrs.y),
					};
					const convertedPoint = apiPosition(
						point,
						imageRef.current?.getHeight(),
						imageRef.current?.getWidth(),
						offset
					);

					return {
						localId: position.localId,
						name: position.name,
						description: position.description,
						type: position.type,
						x: convertedPoint.x,
						y: convertedPoint.y,
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

	function handleCenter() {
		stageRef.current?.scale({ x: 1, y: 1 });
		stageRef.current?.position({ x: 0, y: 0 });
	}

	return (
		<div
			style={
				{ display: 'flex', flexDirection: 'column' } as CSSProperties
			}
		>
			<button
				style={{ width: '120px' }}
				children="сброс позиции"
				onClick={handleCenter}
			/>
			<DraggableStage
				ref={stageRef}
				width={width.current}
				height={height.current}
				className={styles.editmap}
				scaleBound={bound}
			>
				<Layer>
					{link.length !== 0 && (
						<>
							<URLImage
								ref={imageRef}
								src={link}
								maxWidth={width.current}
								maxHeight={height.current}
								onClick={handleMapClick}
								setUpdate={forceUpdate}
							/>
							{pointEdges.keys().map((key) => {
								const keyString = pair(
									key.sourceId,
									key.destinationId
								);
								const edge = pointEdges.get(
									key.sourceId,
									key.destinationId
								)!;
								return (
									<Line
										id={keyString}
										key={keyString}
										lineJoin="round"
										lineCap="round"
										onContextMenu={handleRightClickLine}
										stroke="red"
										strokeWidth={lineWidth}
										points={[
											edge.source!.x,
											edge.source!.y,
											edge.destination!.x,
											edge.destination!.y,
										]}
									/>
								);
							})}
							{positions.map((position) => {
								const convertedPoint = canvaPosition(
									{
										x: position.x,
										y: position.y,
									},
									imageRef.current?.getHeight(),
									imageRef.current?.getWidth(),
									offset
								);
								return (
									<Circle
										id={position.localId.toString()}
										key={position.localId}
										x={convertedPoint.x}
										y={convertedPoint.y}
										fill="red"
										radius={circleRadius}
										onContextMenu={handleRightClickCircle}
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
					)}
				</Layer>
			</DraggableStage>
		</div>
	);
};

export default MapEdit;
