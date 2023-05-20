const AV = Autodesk.Viewing;
const div = document.getElementById("Viewer");

function startViewer(urn) {
	AV.Initializer({ 
		env: "AutodeskProduction2", 
		api: "streamingV2", 
		accessToken: _access_token }, 
        () => {
			const options = { extensions: ["ThreeTilesExtension"] };
			const viewer = new AV.Private.GuiViewer3D(div, options);
			viewer.start();
			viewer.setTheme("light-theme");
			AV.Document.load(`urn:${urn}`, async (doc) => {
				var viewables = doc.getRoot().getDefaultGeometry();
				viewer.loadDocumentNode(doc, viewables).then( async (model) => {
                        await viewer.waitForLoadDone({ propDb: false, geometry: true});
                        const ext = viewer.getExtension('ThreeTilesExtension');
                        const options = {
                            showDebugBoxes: (window.location.hash.length > 2),
                            pointSize:6,
                            geomScale:0.3
                        }
                        ext.addURN("dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cmVjYXAtcG9pbnRjbG91ZC9Ccm93bnN2aWxsZS0xNi5yY3M", options);
                })
			});
		}
	);
}

// open empty RVT file
startViewer("dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6cmVjYXAtcG9pbnRjbG91ZC9Tbm93ZG9uJTIwVG93ZXJzJTIwU2FtcGxlJTIwRmFjYWRlcy5ydnQ");