import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { LegacyRef } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

interface URLImageProps {
	src: string;
	maxWidth?: number;
	maxHeight?: number;
	centered?: boolean;
	onClick?: (evt: KonvaEventObject<globalThis.MouseEvent>) => void;
	x?: number;
	y?: number;
}

const URLImage = ({
	src,
	x,
	y,
	maxWidth,
	maxHeight,
	centered,
	onClick,
}: URLImageProps) => {
	const image = useImage(src)[0];

	const localX = x ? x : 0;
	const localY = y ? y : 0;
	let ratio = 0;
	let width = maxWidth;
	let height = maxHeight;
	if (maxHeight && maxWidth && image) {
		ratio = image.width / image.height;
		if (maxWidth / maxHeight > ratio) {
			height = maxHeight;
			width = ratio * maxHeight;
		} else {
			width = maxWidth;
			height = maxWidth / ratio;
		}
	}

	function handleClick(event: KonvaEventObject<MouseEvent>) {}

	return (
		<Image
			x={centered && width ? localX - width / 2 : localX}
			y={localY}
			image={image}
			width={width}
			height={height}
			onClick={(evt) => {
				if (onClick) {
					return onClick(evt);
				} else {
					return handleClick(evt);
				}
			}}
		/>
	);
};

export default URLImage;
