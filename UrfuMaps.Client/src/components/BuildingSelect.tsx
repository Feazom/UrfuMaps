import { Dispatch, FormEvent, memo, SetStateAction } from 'react';

type BuildingSelectProps = {
	setBuildingName: Dispatch<SetStateAction<string | undefined>>;
	buildingList: Record<string, number[]>;
};

const BuildingSelect = ({
	setBuildingName,
	buildingList,
}: BuildingSelectProps) => {
	function handleBuildingChange(event: FormEvent<HTMLSelectElement>) {
		setBuildingName(event.currentTarget.value);
	}

	return (
		<div className="building-select">
			<span>Здание: </span>
			<select
				onChange={handleBuildingChange}
				onLoad={handleBuildingChange}
			>
				{Object.keys(buildingList)?.map((buildingName) => {
					return <option key={buildingName}>{buildingName}</option>;
				})}
			</select>
		</div>
	);
};
export default memo(BuildingSelect);
