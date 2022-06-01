import Konva from 'konva';
import { memo } from 'react';
import { Text } from 'react-konva';

type TextCanvasProps = {
	text: string;
	x: number;
	y: number;
};

const TextCanvas = ({ text, x, y }: TextCanvasProps) => {
	const fontSize = 12;
	const fontFamily = 'Calibry';
	const textShape = new Konva.Text({
		text,
		fontSize,
		fontFamily,
	});
	const offsetX = textShape.width() / 2;
	const offsetY = textShape.height() / 2;

	return (
		<Text
			x={x || undefined}
			y={y || undefined}
			text={text}
			fontSize={fontSize}
			fontFamily={fontFamily}
			offsetX={offsetX}
			offsetY={offsetY}
		/>
	);
};

export default memo(TextCanvas);
