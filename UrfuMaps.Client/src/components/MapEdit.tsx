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
import { Point, PointSelected } from '../types';
import './UploadMap.css';
import URLImage from './URLImage';

type MapEditProps = {
	setPositions: Dispatch<SetStateAction<CreatePositionDTO[]>>;
	positions: CreatePositionDTO[];
	link: string;
	selected: PointSelected;
	setSelected: Dispatch<SetStateAction<PointSelected>>;
};

type Edge = {
	source?: Point;
	dest?: Point;
};

const MapEdit = ({
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
	const [edges, setEdges] = useState<Edge[]>([]);
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
		if (edge?.source?.id === edge?.dest?.id && edge?.source?.id) {
			const id = edge?.source.id;
			if (selected.type === 'position' || selected.type == null) {
				if (selected.id === id) {
					setSelected({ type: null });
				} else {
					setSelected({ type: 'position', id });
				}
			}
		} else {
			if (edge?.source?.id && edge?.dest?.id) {
				setEdges((e) => {
					if (
						e.reduce((prev, cur) => {
							const isDesired = Boolean(
								cur.dest?.id === edge.dest?.id &&
									cur.source?.id === edge.source?.id
							);
							return prev || isDesired;
						}, false)
					) {
						return e;
					} else {
						return [...e, edge];
					}
				});
			}
		}
	}, [edge]);

	useEffect(() => {
		setPositions((p) =>
			p.map((position) => {
				const relative = edges.find(
					(e) =>
						e.dest?.id === position.localId ||
						e.source?.id === position.localId
				);

				if (relative) {
					if (position.localId === relative.source?.id) {
						const newPosition = position;
						newPosition.relatedWith.push(relative.dest!.id);
						return newPosition;
					}
					if (position.localId === relative.dest?.id) {
						const newPosition = position;
						newPosition.relatedWith.push(relative.source!.id);
						return newPosition;
					}
				}
				return {
					localId: position.localId,
					name: position.name,
					description: position.description,
					type: position.type,
					x: position.x,
					y: position.y,
					relatedWith: [],
				};
			})
		);
	}, [edges]);

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
			setLastId(lastId + 1);
		}
	}

	function handleDragMove(event: KonvaEventObject<DragEvent>) {
		setEdges((e) =>
			e.map((edge) => {
				let src = edge.source;
				let dst = edge.dest;
				if (src && dst) {
					if (src.id === parseInt(event.target.attrs.id)) {
						src.x = parseFloat(event.target.attrs.x);
						src.y = parseFloat(event.target.attrs.y);
					}

					if (dst.id === parseInt(event.target.attrs.id)) {
						dst.x = parseFloat(event.target.attrs.x);
						dst.y = parseFloat(event.target.attrs.y);
					}
					return { source: src, dest: dst };
				}
				return edge;
			})
		);
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
						relatedWith: position.relatedWith,
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
				return { source: e.source, dest: { id, x, y } };
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
			dest: e?.dest,
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
								x={0}
								y={0}
								maxWidth={width}
								maxHeight={height}
								onClick={handleMapClick}
							/>
							{edges.map((edge) => {
								if (edge.dest && edge.source) {
									return (
										<Line
											key={
												edge.source.id.toString() +
												edge.dest.id.toString()
											}
											lineJoin="round"
											lineCap="round"
											stroke="red"
											strokeWidth={4}
											points={[
												edge.source.x,
												edge.source.y,
												edge.dest.x,
												edge.dest.y,
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
