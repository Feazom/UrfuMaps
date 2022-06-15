import { createContext } from 'react';
import i18next from 'i18next';

export const OrientationContext = createContext('landscape');

i18next.init({
	lng: 'ru',
	resources: {
		ru: {
			translation: {
				a: 'А',
				b: 'Б',
				v: 'В',
				g: 'Г',
				d: 'Д',
				e: 'Э',
				j: 'Ж',
				z: 'З',
				i: 'И',
				k: 'К',
				l: 'Л',
				m: 'М',
				n: 'Н',
				o: 'О',
				p: 'П',
				r: 'Р',
				s: 'С',
				t: 'Т',
				u: 'У',
				f: 'Ф',
				h: 'Х',
				c: 'С',
				ch: 'Ч',
				sh: 'Ш',
				wcw: 'СУ Ж',
				entryrtf: 'Вход',
				rtf: 'ИРИТ-РТФ',
				hti: 'ХТИ',
				fti: 'ФТИ',
				mab: 'ГУК',
				insma: 'ИЕНиМ',
				inmt: 'ИНМиТ',
				sti: 'ИСиА',
				enin: 'УралЭнИн',
				urgi: 'УГИ',
			},
		},
	},
});

export const t = i18next.t;
