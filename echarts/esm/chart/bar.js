
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/



/**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */

import * as echarts from '../echarts';
import * as zrUtil from 'zrender/esm/core/util';
import { layout, largeLayout } from '../layout/barGrid';
import '../coord/cartesian/Grid';
import './bar/BarSeries';
import './bar/BarView';
import '../action/changeAxisOrder';
import '../component/gridSimple';
import dataSample from '../processor/dataSample';
echarts.registerLayout(echarts.PRIORITY.VISUAL.LAYOUT, zrUtil.curry(layout, 'bar'));
echarts.registerLayout(echarts.PRIORITY.VISUAL.PROGRESSIVE_LAYOUT, largeLayout);
echarts.registerVisual({
  seriesType: 'bar',
  reset: function (seriesModel) {
    seriesModel.getData().setVisual('legendSymbol', 'roundRect');
  }
});
echarts.registerProcessor(echarts.PRIORITY.PROCESSOR.STATISTIC, dataSample('bar'));