import { Vector2d } from 'konva/lib/types';
import { t } from '../context';

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
	г: 'g',
	д: 'd',
	е: 'e',
	ж: 'j',
	з: 'z',
	и: 'i',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'h',
	ц: 'c',
	ч: 'ch',
	ш: 'sh',
	мт: 'mt',
	гук: 'mab',
	э: 'e',
	сп: 'sp',
	вход: 'entry',
	a: 'a',
	b: 'b',
	v: 'v',
	g: 'g',
	d: 'd',
	e: 'e',
	j: 'j',
	z: 'z',
	i: 'i',
	k: 'k',
	l: 'l',
	m: 'm',
	n: 'n',
	o: 'o',
	p: 'p',
	r: 'r',
	s: 's',
	t: 't',
	u: 'u',
	f: 'f',
	h: 'h',
	c: 'c',
	ch: 'ch',
	sh: 'sh',
	mt: 'mt',
	mab: 'mab',
	sp: 'sp',
	entry: 'entry',
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
		result = tr[result.slice(0, 5)];
	}
	if (building) {
		if (result.slice(0, 5) === 'entry') {
			result += building;
			if (building === 'mab') {
				result += 'm';
			}
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
