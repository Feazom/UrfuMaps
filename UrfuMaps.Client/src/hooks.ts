import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';

export const useForceUpdate = (): Function => {
	const forceUpdate = useState(1)[1];
	return () => {
		forceUpdate((v) => v + 1);
	};
};

export const useApi = <T>(request: Promise<AxiosResponse<T, any>>) => {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<T>();

	useEffect(() => {
		request
			.then((response) => {
				setLoading(false);
				if (response.status === 200) {
					setData(response.data);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}, [request]);

	return { loading, data };
};
