import { Context } from 'konva/lib/Context';
import { ShapeConfig, Shape } from 'konva/lib/Shape';
import { useCallback } from 'react';
import { Shape as ShapeComponent } from 'react-konva';

type MarkCanvasProps = {
	x: number;
	y: number;
	color: string;
};

const MarkCanvas = ({ color, x, y }: MarkCanvasProps) => {
	const shape = useCallback((context: Context, shape: Shape<ShapeConfig>) => {
		const height = 13;
		const halfWidth = 7;

		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(halfWidth, -height);
		context.arcTo(
			halfWidth,
			-(halfWidth + height),
			0,
			-(halfWidth + height),
			halfWidth
		);
		context.arcTo(
			-halfWidth,
			-(halfWidth + height),
			-halfWidth,
			-height,
			halfWidth
		);
		context.lineTo(0, 0);
		context.arc(0, -height, halfWidth / 3, 0, 2 * Math.PI, false);
		context.closePath();
		context.fillShape(shape);
	}, []);

	return (
		<ShapeComponent
			fill={color}
			strokeWidth={1}
			sceneFunc={shape}
			x={x}
			y={y}
		/>
	);
};

export default MarkCanvas;
