import LegendModel, { LegendOption } from './LegendModel';
import { ZRColor, LabelOption } from '../../util/types';
import Model from '../../model/Model';
import GlobalModel from '../../model/Global';
export interface ScrollableLegendOption extends LegendOption {
    scrollDataIndex?: number;
    pageButtonItemGap?: number;
    pageButtonGap?: number;
    pageButtonPosition?: 'start' | 'end';
    pageFormatter?: string | ((param: {
        current: number;
        total: number;
    }) => string);
    pageIcons?: {
        horizontal?: string[];
        vertical?: string[];
    };
    pageIconColor?: ZRColor;
    pageIconInactiveColor?: ZRColor;
    pageIconSize?: number;
    pageTextStyle?: LabelOption;
    animationDurationUpdate?: number;
}
declare class ScrollableLegendModel extends LegendModel<ScrollableLegendOption> {
    static type: "legend.scroll";
    type: "legend.scroll";
    setScrollDataIndex(scrollDataIndex: number): void;
    init(option: ScrollableLegendOption, parentModel: Model, ecModel: GlobalModel): void;
    mergeOption(option: ScrollableLegendOption, ecModel: GlobalModel): void;
    static defaultOption: ScrollableLegendOption;
}
export default ScrollableLegendModel;
