export enum BuildingType {
	SolarPanel = 0,
	House = 1,
    GridTile = 2,
}
export interface Vector3D {
	x: number;
	y: number;
	z: number;
}
export interface Building {
	type: BuildingType;
	position: Vector3D;
	size: Vector3D;
}

export interface Map {
	buildings: Building
}