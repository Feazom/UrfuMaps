import { useState } from 'react';

export const useForceUpdate = (): Function => {
	const forceUpdate = useState(1)[1];
	return () => {
		forceUpdate((v) => v + 1);
	};
};
