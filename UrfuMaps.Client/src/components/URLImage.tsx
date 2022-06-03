import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { forwardRef, memo, useEffect } from 'react';
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
	setUpdate?: Function;
}

const URLImage = forwardRef<Konva.Image, URLImageProps>(
	({ src, x, y, maxWidth, maxHeight, centered, onClick, setUpdate }, ref) => {
		const [image, status] = useImage(src);

		useEffect(() => {
			if (setUpdate && status === 'loaded') {
				setUpdate();
			}
		}, [status]);

		const handleClick = (evt: KonvaEventObject<MouseEvent>) => {
			if (onClick) {
				return onClick(evt);
			}
		};

		const localX = x ? x : 0;
		const localY = y ? y : 0;
		let width: number | undefined;
		let height: number | undefined;

		if (status === 'loaded') {
			width = maxWidth;
			height = maxHeight;
			if (maxHeight && maxWidth && image) {
				const ratio = image.width / image.height;
				if (maxWidth / maxHeight > ratio) {
					height = maxHeight;
					width = ratio * maxHeight;
				} else {
					width = maxWidth;
					height = maxWidth / ratio;
				}
			}
		}

		return (
			<>
				{status === 'loaded' && (
					<Image
						ref={ref}
						x={centered && width ? localX - width / 2 : localX}
						y={centered && height ? localY - height / 2 : localY}
						image={image}
						width={width}
						height={height}
						onClick={handleClick}
					/>
				)}
			</>
		);
	}
);

export default memo(URLImage);
