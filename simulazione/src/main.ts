import * as THREE from 'three';
import { Building, BuildingType } from './models';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointLight } from 'three';

import * as THREEx from "threex-domevents"

import bg from "../static/images/ground.jpg"
let skyColor = 0x00CED1
enum Quality {
	HighPerformance = "high-performance",
	Default = "default",
	LowPower = "low-power",
}
interface GraphicsSettings {
	ground: boolean,
	lights: boolean,
	fog: boolean,
	antialiasing: boolean,
	quality: Quality
}

//* SETUP
let graphicsSettings: GraphicsSettings = {
	ground: true,
	lights: true,
	fog: true,
	antialiasing: true,
	quality: Quality.HighPerformance
}
let High: GraphicsSettings = {
	ground: true,
	lights: true,
	fog: true,
	antialiasing: true,
	quality: Quality.HighPerformance
}
let Medium: GraphicsSettings = {
	ground: true,
	lights: true,
	fog: false,
	antialiasing: false,
	quality: Quality.Default
}
let Low: GraphicsSettings = {
	ground: false,
	lights: false,
	fog: false,
	antialiasing: false,
	quality: Quality.LowPower
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//! PENDING CHANGES

//? Defines the size of the grid, will later be take the information dynamically from the json
let gridSize = {
	x: 10,
	y: 10
}
let grid: THREE.Mesh[][][] = [];
let selection: THREE.Mesh[][] = [];

//@ts-ignore
const renderer = new THREE.WebGLRenderer({canvas: artifactCanvas, antialias: graphicsSettings.antialiasing });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.powerPreference = graphicsSettings.quality;
document.body.appendChild( renderer.domElement );

const light = new PointLight(0xffffff, 400);
const lights = new PointLight(0xffff00, 5);
const lightss = new PointLight(0xffff00, 2);
let pointertsar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.0, 0.8), new THREE.MeshStandardMaterial({color:0xff0000}))
pointertsar.position.y = 0.5;
let bro = false;
lightss.position.y = 2;
lights.add(pointertsar, lightss);
light.position.y = 10;
lights.position.y = 1.5;
lights.decay = 1;
const texture = new THREE.TextureLoader().load( bg );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 25 + gridSize.x, 25 + gridSize.x );
let gruond = new THREE.Mesh(new THREE.CircleGeometry(200 + Math.max(gridSize.x, gridSize.y), 32), new THREE.MeshStandardMaterial({map:texture}))
gruond.rotation.x = -1.6;
gruond.position.y = 0;

scene.background = new THREE.Color(skyColor)
scene.add(new THREE.AmbientLight(), lights)

if (graphicsSettings.lights) scene.add(light); else light.intensity = 0;
if (graphicsSettings.ground) scene.add(gruond);
if (graphicsSettings.fog) scene.fog = new THREE.Fog( skyColor, 0, 80 );

const controls = new OrbitControls(camera, renderer.domElement)
controls.maxDistance = 20;
controls.minDistance = 13;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.3;
controls.enableZoom = false;

function buildEntity(building: Building) {
	const geometry = new THREE.BoxGeometry(building.size.x * 0.95, building.size.y * 0.95, building.size.z * 0.95);
	const material = new THREE.MeshStandardMaterial( { color: 0x999999 } );
	const cube = new THREE.Mesh( geometry, material );
	//@ts-ignore
	cube.position.z = building.position.z + 0.5;
	//@ts-ignore
	cube.position.x = building.position.x + 0.5;
	//@ts-ignore
	cube.position.y = building.position.y;
	scene.add( cube );
	return cube;
}

let tempGrid: THREE.Mesh[] = []
for (let index = 0; index < gridSize.x; index++) {
	let temp: THREE.Mesh[] = []
	for (let jndex = 0; jndex < gridSize.y; jndex++) {
		temp.push(buildEntity({
			type: BuildingType.GridTile,
			position: {x:index, y:1, z:jndex},
			size: {x:1, y:0.01, z:1}
		}))
	}
	
	tempGrid.push(temp);
	temp = [];
}
grid.push(tempGrid);
let hovered = grid[0][Math.floor(lights.position.x)][Math.floor(lights.position.z)].position;
function cursorPosition() {
	try {
		hovered = grid[0][Math.floor(lights.position.x)][Math.floor(lights.position.z)].position;
	} catch (e) {

	}

	grid[0].forEach(element => {
		element.forEach(cube => {
			cube.material.color = new THREE.Color(0xaaaaaa);
		});
	});
	
	selection = grid[0][Math.floor(hovered.x)][Math.floor(hovered.z)]
	selection.material.color = new THREE.Color(0xffff00);
	
}

let halfX = Math.floor(grid[0].length / 2)
let halfY = Math.floor(grid[0][halfX].length / 2)

gruond.position.x = grid[0][halfX][halfY].position.x;
gruond.position.z = grid[0][halfX][halfY].position.z;
controls.target.x = grid[0][halfX][halfY].position.x;
controls.target.z = grid[0][halfX][halfY].position.z;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
const keys = {
	forward: false,
	backwards: false,
	left: false,
	right: false,
}
let collected: THREE.Mesh[][] = [];
grid.forEach(e => e.forEach(a => collected.push(a)));

/*var domEvents = new THREEx.domEvents(camera, renderer.domElement)
collected.forEach(mesh => {
	domEvents.addEventListener(mesh, 'click', function(event){
		console.log('you clicked on mesh', mesh)
	}, false);
})*/



let deb = false;
function debugging() {
	let round = (num: number) => Math.floor(num * 100) / 100;
	return "\nCAMERA ROTATION\n\tX: " + round(camera.rotation.x) +
		"\n\tZ: " + round(camera.rotation.z) +
		"\n\tY: " + round(camera.rotation.y) +
		"\n\nCAMERA POSITION\n\tX: " + round(camera.position.x) +
		"\n\tZ: " + round(camera.position.z) +
		"\n\tY: " + round(camera.position.y) +
		"\n\nTARGET POSITION" +
		"\n\tX: " + round(controls.target.x) +
		"\n\tZ: " + round(controls.target.z) +
		"\n\tY: " + round(controls.target.y) +
		"\n\nDISTANCE FROM TARGET: " + round(controls.getDistance())
}
//! ANIMATION LOOP
function animate() {
	requestAnimationFrame( animate );
	if (deb) console.log(debugging());

	cursorPosition();

	controls.update();
	camera.position.y = 10;
	controls.target.y = 0;
	light.position.z = camera.position.z;
	light.position.x = camera.position.x;
	lights.position.z = controls.target.z;
	lights.position.x = controls.target.x;

		
	let p = pointertsar.position.y;

	if (p >= 0.5) {
		bro = true;
	}
	if (p <= 0) {
		bro = false;
	}

	if (bro) {
		pointertsar.position.y -= 0.01;		
	} else {
		pointertsar.position.y += 0.01;
	}
	renderer.render( scene, camera );
}

animate();


//! KEYBOARD COMMANDS
//* [SPACE]: Auto rotate
//* [?]: Enable debug information in the console
document.addEventListener("keyup", e => {
	if (e.key == " ") controls.autoRotate = !controls.autoRotate;
	if (e.key == "?") deb = !deb;
})