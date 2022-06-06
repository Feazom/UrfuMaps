import { Select } from 'antd';
import { Dispatch, memo, SetStateAction } from 'react';

type BuildingSelectProps = {
	buildingName: string | undefined;
	setBuildingName: Dispatch<SetStateAction<string | undefined>>;
	buildings: string[];
};

const style = { marginRight: '14px' };

const BuildingSelect = ({
	buildingName,
	setBuildingName,
	buildings,
}: BuildingSelectProps) => {
	function handleBuildingChange(building: string) {
		setBuildingName(building);
	}

	return (
		<div className="building-select" style={style}>
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
		</div>
	);
};
export default memo(BuildingSelect);
