import URLImage from './URLImage';

type PointCanvasProps = {
	x: number;
	y: number;
};

const PointCanvas = ({ x, y }: PointCanvasProps) => {
	return (
		<URLImage
			centered
			src="point.svg"
			x={x}
			y={y}
			maxHeight={30}
			maxWidth={30}
		/>
	);
};

export default PointCanvas;
