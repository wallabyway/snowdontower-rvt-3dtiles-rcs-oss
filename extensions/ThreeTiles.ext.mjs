import {TileSet} from "./tileset.mjs";

// save this script as seperate file...
// ------------- ./ThreeTilesExtension.js

class ThreeTilesExtension extends Autodesk.Viewing.Extension {
	unload() {
		return true;
	}

	async load() {
		console.log('loaded 3DTiles extension')
		if (!this.viewer) return;
		this.tilesets = [];
		//await this.viewer.waitForLoadDone({ propDb: false, geometry: true});
		this.camera = this.viewer.getCamera();
		this.world = new THREE.Group();
		this.viewer.impl.createOverlayScene('pointclouds');
		this.viewer.impl.addOverlay('pointclouds', this.world);
		//viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, ()=>{this.update(this.tileset)})
		setInterval(()=>{
			this.tilesets.map( tileset => {
				this.update(tileset); 
			})
		}, 200);
		return true;	
	}

	update(tileset) {
		if (!(tileset && tileset.root)) return;
		let frustum = new THREE.Frustum();
		frustum.setFromProjectionMatrix( new THREE.Matrix4().multiplyMatrices(
					this.camera.perspectiveCamera.projectionMatrix, 
					this.camera.perspectiveCamera.matrixWorldInverse
		));
		tileset.root.checkLoad(frustum, this.camera.position);
	}

	addURN(urn, styleParams) {
		const base = `https://cdn.derivative.autodesk.com/derivativeservice/v2/derivatives/urn:adsk.viewing:fs.file:`;
		const cleanup = urn.replace('/', "_");
		const url = `${base}${cleanup}/output/tileset.json`
		this.add(url, styleParams);
	}

	async add(url, styleParams) {
		const tileset = new TileSet();
		await tileset.load(url, styleParams);
		//tileset.root.totalContent.scale.set([styleParams.scale, styleParams.scale, styleParams.scale]);
		this.world.add(tileset.root.totalContent);
		this.world.rotateZ(Math.PI/2);
		this.world.position.x = -55;
		this.world.position.y = -40;
		this.world.position.z = 40;
		this.world.scale.set(0.84,0.84,0.84);
		this.world.updateMatrixWorld();
		this.tilesets.push(tileset);
	}
}

Autodesk.Viewing.theExtensionManager.registerExtension('ThreeTilesExtension', ThreeTilesExtension);