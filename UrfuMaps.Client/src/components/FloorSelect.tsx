import Select from 'antd/lib/select';
import { Dispatch, memo, SetStateAction } from 'react';

type FloorSelectProps = {
	floorNumber: number;
	setFloorNumber: Dispatch<SetStateAction<number | undefined>>;
	floors: number[];
};

const compare = (a: number, b: number) => {
	return a - b;
};

const FloorSelect = ({
	floorNumber,
	setFloorNumber,
	floors,
}: FloorSelectProps) => {
	function handleFloorChange(floor: number) {
		setFloorNumber(floor);
	}
	return (
		<div className="floor-select">
			<span>Этаж: </span>
			<Select
				onChange={handleFloorChange}
				loading={floors.length == 0}
				value={floorNumber}
			>
				{floors.sort(compare).map((floor) => (
					<Select.Option key={floor} value={floor}>
						{floor}
					</Select.Option>
				))}
			</Select>
		</div>
	);
};
export default memo(FloorSelect);
