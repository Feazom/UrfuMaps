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
				wcw: 'СУ Ж',
				entryrtf: 'Вход',
				r: 'Р',
				m: 'М',
				e: 'Э',
				i: 'И',
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
