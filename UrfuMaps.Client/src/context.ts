import { createContext } from 'react';
import i18next from 'i18next';

export const OrientationContext = createContext('landscape');

i18next.init({
	lng: 'ru',
	debug: true,
	resources: {
		ru: {
			translation: {
				r: 'Р',
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
