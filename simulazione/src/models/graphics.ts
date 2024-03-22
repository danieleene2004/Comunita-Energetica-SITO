export enum Quality {
	HighPerformance = "high-performance",
	Default = "default",
	LowPower = "low-power",
}
export interface GraphicsSettings {
	ground: boolean,
	lights: boolean,
	fog: boolean,
	antialiasing: boolean,
	quality: Quality
}
let PRESETS: GraphicsSettings[] = [

{ // HIGH
	ground: true,
	lights: true,
	fog: true,
	antialiasing: true,
	quality: Quality.HighPerformance
},
{ // MEDIUM
	ground: true,
	lights: true,
	fog: false,
	antialiasing: false,
	quality: Quality.Default
},
{ // LOW
	ground: false,
	lights: false,
	fog: false,
	antialiasing: false,
	quality: Quality.LowPower
}]
//? Cant set objects to enum values in javascript (i miss u rust </3)
export enum GraphicsPresets {
	High = 0,
	Medium = 1,
	Low = 2,
}

export function graphics(GraphicsPresets) {
    return PRESETS[GraphicsPresets];
}