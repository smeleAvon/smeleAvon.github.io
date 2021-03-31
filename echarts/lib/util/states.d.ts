import { Dictionary } from 'zrender/lib/core/types';
import Displayable from 'zrender/lib/graphic/Displayable';
import Element, { ElementEvent } from 'zrender/lib/Element';
import Model from '../model/Model';
import { SeriesDataType, DisplayState, ECElement, BlurScope, InnerFocus, Payload, HighlightPayload, DownplayPayload } from './types';
import SeriesModel from '../model/Series';
import Path from 'zrender/lib/graphic/Path';
import GlobalModel from '../model/Global';
import ExtensionAPI from '../ExtensionAPI';
export declare const HOVER_STATE_NORMAL: 0;
export declare const HOVER_STATE_BLUR: 1;
export declare const HOVER_STATE_EMPHASIS: 2;
export declare const SPECIAL_STATES: readonly ["emphasis", "blur", "select"];
export declare const DISPLAY_STATES: readonly ["normal", "emphasis", "blur", "select"];
export declare const Z2_EMPHASIS_LIFT = 10;
export declare const Z2_SELECT_LIFT = 9;
export declare const HIGHLIGHT_ACTION_TYPE = "highlight";
export declare const DOWNPLAY_ACTION_TYPE = "downplay";
export declare const SELECT_ACTION_TYPE = "select";
export declare const UNSELECT_ACTION_TYPE = "unselect";
export declare const TOGGLE_SELECT_ACTION_TYPE = "toggleSelect";
export declare function setStatesFlag(el: ECElement, stateName: DisplayState): void;
export declare function clearStates(el: Element): void;
export declare function setDefaultStateProxy(el: Displayable): void;
export declare function enterEmphasisWhenMouseOver(el: Element, e: ElementEvent): void;
export declare function leaveEmphasisWhenMouseOut(el: Element, e: ElementEvent): void;
export declare function enterEmphasis(el: Element, highlightDigit?: number): void;
export declare function leaveEmphasis(el: Element, highlightDigit?: number): void;
export declare function enterBlur(el: Element): void;
export declare function leaveBlur(el: Element): void;
export declare function enterSelect(el: Element): void;
export declare function leaveSelect(el: Element): void;
export declare function toggleSeriesBlurState(targetSeriesIndex: number, focus: InnerFocus, blurScope: BlurScope, api: ExtensionAPI, isBlur: boolean): void;
export declare function toggleSeriesBlurStateFromPayload(seriesModel: SeriesModel, payload: Payload, api: ExtensionAPI): void;
export declare function toggleSelectionFromPayload(seriesModel: SeriesModel, payload: Payload, api: ExtensionAPI): void;
export declare function updateSeriesElementSelection(seriesModel: SeriesModel): void;
export declare function getAllSelectedIndices(ecModel: GlobalModel): {
    seriesIndex: number;
    dataType?: SeriesDataType;
    dataIndex: number[];
}[];
export declare function enableHoverEmphasis(el: Element, focus?: InnerFocus, blurScope?: BlurScope): void;
export declare function enableHoverFocus(el: Element, focus: InnerFocus, blurScope: BlurScope): void;
export declare function setStatesStylesFromModel(el: Displayable, itemModel: Model<Partial<Record<'emphasis' | 'blur' | 'select', any>>>, styleType?: string, getter?: (model: Model) => Dictionary<any>): void;
export declare function setAsHighDownDispatcher(el: Element, asDispatcher: boolean): void;
export declare function isHighDownDispatcher(el: Element): boolean;
export declare function getHighlightDigit(highlightKey: number): number;
export declare function isSelectChangePayload(payload: Payload): boolean;
export declare function isHighDownPayload(payload: Payload): payload is HighlightPayload | DownplayPayload;
export declare function savePathStates(el: Path): void;
