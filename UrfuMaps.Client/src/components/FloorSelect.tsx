import { Dispatch, FormEvent, memo, SetStateAction } from 'react';

type FloorSelectProps = {
	floorNumber: number;
	setFloorNumber: Dispatch<SetStateAction<number | undefined>>;
	buildingList: Record<string, number[]>;
	buildingName: string;
};

const FloorSelect = ({
	floorNumber,
	setFloorNumber,
	buildingName,
	buildingList,
}: FloorSelectProps) => {
	function handleFloorChange(event: FormEvent<HTMLSelectElement>) {
		setFloorNumber(parseInt(event.currentTarget.value));
	}

	return (
		<div className="floor-select">
			<span>Этаж: </span>
			<select
				value={floorNumber}
				onChange={handleFloorChange}
				onLoad={handleFloorChange}
			>
				{buildingList[buildingName]?.map((floorNumber) => {
					return <option key={floorNumber}>{floorNumber}</option>;
				})}
			</select>
		</div>
	);
};
export default memo(FloorSelect);
