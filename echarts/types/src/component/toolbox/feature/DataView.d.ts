import GlobalModel from '../../../model/Global';
import { ToolboxFeature, ToolboxFeatureOption } from '../featureManager';
import { ColorString, ECUnitOption } from '../../../util/types';
import ExtensionAPI from '../../../ExtensionAPI';
export interface ToolboxDataViewFeatureOption extends ToolboxFeatureOption {
    readOnly?: boolean;
    optionToContent?: (option: ECUnitOption) => string | HTMLElement;
    contentToOption?: (viewMain: HTMLDivElement, oldOption: ECUnitOption) => ECUnitOption;
    icon?: string;
    title?: string;
    lang?: string[];
    backgroundColor?: ColorString;
    textColor?: ColorString;
    textareaColor?: ColorString;
    textareaBorderColor?: ColorString;
    buttonColor?: ColorString;
    buttonTextColor?: ColorString;
}
declare class DataView extends ToolboxFeature<ToolboxDataViewFeatureOption> {
    private _dom;
    onclick(ecModel: GlobalModel, api: ExtensionAPI): void;
    remove(ecModel: GlobalModel, api: ExtensionAPI): void;
    dispose(ecModel: GlobalModel, api: ExtensionAPI): void;
    static getDefaultOption(ecModel: GlobalModel): ToolboxDataViewFeatureOption;
}
export default DataView;
