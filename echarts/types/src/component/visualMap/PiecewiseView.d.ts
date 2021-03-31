import VisualMapView from './VisualMapView';
import PiecewiseModel from './PiecewiseModel';
declare class PiecewiseVisualMapView extends VisualMapView {
    static type: "visualMap.piecewise";
    type: "visualMap.piecewise";
    visualMapModel: PiecewiseModel;
    protected doRender(): void;
    private _enableHoverLink;
    private _getItemAlign;
    private _renderEndsText;
    private _getViewData;
    private _createItemSymbol;
    private _onItemClick;
}
export default PiecewiseVisualMapView;
