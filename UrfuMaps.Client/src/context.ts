import { createContext } from 'react';
import i18next from 'i18next';

export const OrientationContext = createContext('landscape');

i18next.init({
	lng: 'ru',
	resources: {
		ru: {
			translation: {
				a: 'а',
				b: 'б',
				v: 'в',
				g: 'г',
				d: 'д',
				e: 'э',
				j: 'ж',
				z: 'з',
				i: 'и',
				k: 'к',
				l: 'л',
				m: 'м',
				n: 'н',
				o: 'о',
				p: 'п',
				r: 'р',
				s: 'с',
				t: 'т',
				u: 'у',
				f: 'ф',
				h: 'х',
				c: 'с',
				ch: 'ч',
				sh: 'ш',
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
