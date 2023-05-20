/// import * as Autodesk from "@types/forge-viewer";

export class AlignPointsExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.tool = new CalibrateBasisTool(viewer);
    }

    async load() {
        await this.viewer.loadExtension('Autodesk.Snapping');
        this.viewer.toolController.registerTool(this.tool);
        return true;
    }

    unload() {
        return true;
    }

    onToolbarCreated() {
        this._button = this.createToolbarButton('summary-button', 'https://img.icons8.com/small/32/brief.png', 'Show Model Summary');
        this._button.onClick = async () => {
            this.viewer.toolController.activateTool("calibratebasis-tool");
            console.log('activating tool')
        };
    }

    createToolbarButton(buttonId, buttonIconUrl, buttonTooltip) {
        let group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
        if (!group) {
            group = new Autodesk.Viewing.UI.ControlGroup('dashboard-toolbar-group');
            this.viewer.toolbar.addControl(group);
        }
        const button = new Autodesk.Viewing.UI.Button(buttonId);
        button.setToolTip(buttonTooltip);
        group.addControl(button);
        const icon = button.container.querySelector('.adsk-button-icon');
        if (icon) {
            icon.style.backgroundImage = `url(${buttonIconUrl})`; 
            icon.style.backgroundSize = `24px`; 
            icon.style.backgroundRepeat = `no-repeat`; 
            icon.style.backgroundPosition = `center`; 
        }
        return button;
    }

    removeToolbarButton(button) {
        const group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
        group.removeControl(button);
    }
}


class CalibrateBasisTool extends Autodesk.Viewing.ToolInterface {
    constructor(viewer, options) {
      super();
      this.viewer = viewer;
      this.names = ['calibratebasis-tool'];
      this.snapper = null;
      this.points = [];
      // Hack: delete functions defined on the *instance* of a ToolInterface (we want the tool controller to call our class methods instead)
      delete this.register;
      delete this.getPriority;
      delete this.handleMouseMove;
      delete this.handleSingleClick;
    }
  
    register() {
      this.snapper = new Autodesk.Viewing.Extensions.Snapping.Snapper(this.viewer, { renderSnappedGeometry: true, renderSnappedTopology: false });
      this.viewer.toolController.registerTool(this.snapper);
      this.viewer.toolController.activateTool(this.snapper.getName());
      console.log('CalibrateBasisTool registered.');
    }
    
    getPriority() {
      return 13; // Feel free to use any number higher than 0 (which is the priority of all the default viewer tools)
    }
  
    handleSingleClick(event, button) {  
        const result = this.snapper.getSnapResult();
        const { SnapType } = Autodesk.Viewing.MeasureCommon;
        this.points.push(result.intersectPoint.clone());
        console.log(this.points)

    }

    handleMouseMove(event) {
        //this.snapper.activate();  
        //this.snapper.indicator.clearOverlays();
        if (this.snapper.isSnapped()) {
          //this.viewer.clearSelection();
          const result = this.snapper.getSnapResult();
          //const { SnapType } = Autodesk.Viewing.MeasureCommon;
        }
        this.snapper.indicator.render(); // Show indicator when snapped to a vertex
        return false;
      }
}



Autodesk.Viewing.theExtensionManager.registerExtension('AlignPointsExtension', AlignPointsExtension);
