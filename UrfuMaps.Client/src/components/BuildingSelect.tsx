import { Select } from 'antd';
import { Dispatch, FormEvent, memo, SetStateAction } from 'react';

type BuildingSelectProps = {
	buildingName: string | undefined;
	setBuildingName: Dispatch<SetStateAction<string | undefined>>;
	buildings: string[];
};

const BuildingSelect = ({
	buildingName,
	setBuildingName,
	buildings,
}: BuildingSelectProps) => {
	function handleBuildingChange(building: string) {
		setBuildingName(building);
	}

	return (
		<>
			<span>Здание: </span>
			<Select
				onChange={handleBuildingChange}
				loading={buildings.length == 0}
				defaultValue={buildingName}
			>
				{buildings.map((building) => (
					<Select.Option key={building} value={building}>
						{building}
					</Select.Option>
				))}
			</Select>
		</>
	);
};
export default memo(BuildingSelect);
