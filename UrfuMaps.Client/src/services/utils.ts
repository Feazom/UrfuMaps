import Konva from 'konva';
import { Vector2d } from 'konva/lib/types';
import { t, translation } from '../context';

const special = /[\s`~!@#$%^&*()\-_=+[\]{};:'"\\|/,.<>?]/g;

const propertyHandler = {
	get: function (target: Record<string, string>, name: string) {
		return target.hasOwnProperty(name) ? target[name] : '';
	},
};

const tr = new Proxy(translation, propertyHandler);

export function toFrontName(name: string) {
	let result = name.toString();
	if (!result && result === '') {
		return result;
	}
	result = result.replace(special, '');
	let numberIndex: number | undefined = undefined;
	let postfixSize = 0;
	for (let i = 0; i < result.length; i++) {
		if (!isNaN(parseInt(result[i]))) {
			numberIndex = i;
			break;
		}
	}
	for (let i = result.length - 1; i >= 0; i--) {
		if (!isNaN(parseInt(result[i]))) {
			break;
		}
		postfixSize++;
	}
	if (numberIndex) {
		return (result =
			t(result.slice(0, numberIndex)) +
			' ' +
			result.substring(numberIndex, result.length - postfixSize) +
			t(result.substring(result.length - postfixSize)));
	}
	return t(result);
}

export function toApiName(cabinet: string, building?: string): string {
	let result = cabinet.toLowerCase();
	if (!result) {
		return result;
	}
	result = result.replace(special, '');
	let numberIndex: number | undefined = undefined;

	for (let i = 0; i < result.length; i++) {
		if (!isNaN(parseInt(result[i]))) {
			numberIndex = i;
			break;
		}
	}

	if (numberIndex) {
		let postfixSize = 0;
		for (let i = result.length - 1; i >= 0; i--) {
			if (!isNaN(parseInt(result[i]))) {
				break;
			}
			postfixSize++;
		}

		result =
			tr[result.slice(0, numberIndex)] +
			result.substring(numberIndex, result.length - postfixSize) +
			tr[result.substring(result.length - postfixSize)];
	} else {
		result = tr[result];
	}
	if (building) {
		if (result.includes('entry')) {
			result += building;
		}
	}
	return result;
}

export function getDistance(a: Vector2d, b: Vector2d): number {
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function getCenter(a: Vector2d, b: Vector2d): Vector2d {
	return {
		x: (a.x + b.x) / 2,
		y: (a.y + b.y) / 2,
	};
}

export function clone<T>(origin: T): T {
	return Object.assign(Object.create(Object.getPrototypeOf(origin)), origin);
}

export function apiPosition(
	position: Vector2d,
	height: number,
	width: number,
	offset: Vector2d
) {
	return {
		x: ((position.x - offset.x) / width) * 100,
		y: ((position.y - offset.y) / height) * 100,
	};
}

export function canvaPosition(position: Vector2d, background: Konva.Image) {
	return {
		x: (position.x / 100) * background.getWidth() + (background.x() || 0),
		y: (position.y / 100) * background.getHeight() + (background.y() || 0),
	};
}
