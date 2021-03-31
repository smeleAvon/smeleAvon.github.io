
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

import { __extends } from "tslib";
import * as zrUtil from 'zrender/esm/core/util';
import Scale from './Scale';
import * as numberUtil from '../util/number';
import * as scaleHelper from './helper';
import IntervalScale from './Interval';
var scaleProto = Scale.prototype;
var intervalScaleProto = IntervalScale.prototype;
var getPrecisionSafe = numberUtil.getPrecisionSafe;
var roundingErrorFix = numberUtil.round;
var mathFloor = Math.floor;
var mathCeil = Math.ceil;
var mathPow = Math.pow;
var mathLog = Math.log;

var LogScale = function (_super) {
  __extends(LogScale, _super);

  function LogScale() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = 'log';
    _this.base = 10;
    _this._originalScale = new IntervalScale();
    _this._interval = 0;
    return _this;
  }

  LogScale.prototype.getTicks = function (expandToNicedExtent) {
    var originalScale = this._originalScale;
    var extent = this._extent;
    var originalExtent = originalScale.getExtent();
    var ticks = intervalScaleProto.getTicks.call(this, expandToNicedExtent);
    return zrUtil.map(ticks, function (tick) {
      var val = tick.value;
      var powVal = numberUtil.round(mathPow(this.base, val));
      powVal = val === extent[0] && this._fixMin ? fixRoundingError(powVal, originalExtent[0]) : powVal;
      powVal = val === extent[1] && this._fixMax ? fixRoundingError(powVal, originalExtent[1]) : powVal;
      return {
        value: powVal
      };
    }, this);
  };

  LogScale.prototype.setExtent = function (start, end) {
    var base = this.base;
    start = mathLog(start) / mathLog(base);
    end = mathLog(end) / mathLog(base);
    intervalScaleProto.setExtent.call(this, start, end);
  };

  LogScale.prototype.getExtent = function () {
    var base = this.base;
    var extent = scaleProto.getExtent.call(this);
    extent[0] = mathPow(base, extent[0]);
    extent[1] = mathPow(base, extent[1]);
    var originalScale = this._originalScale;
    var originalExtent = originalScale.getExtent();
    this._fixMin && (extent[0] = fixRoundingError(extent[0], originalExtent[0]));
    this._fixMax && (extent[1] = fixRoundingError(extent[1], originalExtent[1]));
    return extent;
  };

  LogScale.prototype.unionExtent = function (extent) {
    this._originalScale.unionExtent(extent);

    var base = this.base;
    extent[0] = mathLog(extent[0]) / mathLog(base);
    extent[1] = mathLog(extent[1]) / mathLog(base);
    scaleProto.unionExtent.call(this, extent);
  };

  LogScale.prototype.unionExtentFromData = function (data, dim) {
    this.unionExtent(data.getApproximateExtent(dim));
  };

  LogScale.prototype.niceTicks = function (approxTickNum) {
    approxTickNum = approxTickNum || 10;
    var extent = this._extent;
    var span = extent[1] - extent[0];

    if (span === Infinity || span <= 0) {
      return;
    }

    var interval = numberUtil.quantity(span);
    var err = approxTickNum / span * interval;

    if (err <= 0.5) {
      interval *= 10;
    }

    while (!isNaN(interval) && Math.abs(interval) < 1 && Math.abs(interval) > 0) {
      interval *= 10;
    }

    var niceExtent = [numberUtil.round(mathCeil(extent[0] / interval) * interval), numberUtil.round(mathFloor(extent[1] / interval) * interval)];
    this._interval = interval;
    this._niceExtent = niceExtent;
  };

  LogScale.prototype.niceExtent = function (opt) {
    intervalScaleProto.niceExtent.call(this, opt);
    this._fixMin = opt.fixMin;
    this._fixMax = opt.fixMax;
  };

  LogScale.prototype.parse = function (val) {
    return val;
  };

  LogScale.prototype.contain = function (val) {
    val = mathLog(val) / mathLog(this.base);
    return scaleHelper.contain(val, this._extent);
  };

  LogScale.prototype.normalize = function (val) {
    val = mathLog(val) / mathLog(this.base);
    return scaleHelper.normalize(val, this._extent);
  };

  LogScale.prototype.scale = function (val) {
    val = scaleHelper.scale(val, this._extent);
    return mathPow(this.base, val);
  };

  LogScale.type = 'log';
  return LogScale;
}(Scale);

var proto = LogScale.prototype;
proto.getMinorTicks = intervalScaleProto.getMinorTicks;
proto.getLabel = intervalScaleProto.getLabel;

function fixRoundingError(val, originalVal) {
  return roundingErrorFix(val, getPrecisionSafe(originalVal));
}

Scale.registerClass(LogScale);
export default LogScale;