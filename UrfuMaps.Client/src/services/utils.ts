import { Vector2d } from 'konva/lib/types';

const special = /[\s`~!@#$%^&*()\-_=+[\]{};:'"\\|/,.<>?]/g;

const propertyHandler = {
	get: function (target: Record<string, string>, name: string) {
		return target.hasOwnProperty(name) ? target[name] : '';
	},
};

const translation: Record<string, string> = {
	а: 'a',
	б: 'b',
	в: 'v',
	ф: 'f',
	т: 't',
	х: 'h',
	мт: 'mt',
	и: 'i',
	гук: 'mab',
	м: 'm',
	э: 'e',
	сп: 'sp',
	с: 's',
	р: 'r',
	вход: 'entry',
	a: 'a',
	b: 'b',
	v: 'v',
	f: 'f',
	t: 't',
	h: 'h',
	mt: 'mt',
	i: 'i',
	mab: 'mab',
	m: 'm',
	e: 'e',
	sp: 'sp',
	s: 's',
	r: 'r',
	entry: 'entry',
};

const tr = new Proxy(translation, propertyHandler);

export function convertCabinet(cabinet: string, building?: string): string {
	let result = cabinet.toLowerCase();
	if (!result) {
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
		result =
			tr[result.slice(0, numberIndex)] +
			result.substring(numberIndex, result.length - postfixSize) +
			tr[result.substring(result.length - postfixSize)];
	} else {
		result = tr[result];
	}
	if (building) {
		if (result.slice(0, 5) === 'entry') {
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

export function canvaPosition(
	position: Vector2d,
	height: number,
	widtgh: number,
	offset: Vector2d
) {
	return {
		x: (position.x / 100) * widtgh + offset.x,
		y: (position.y / 100) * height + offset.y,
	};
}
