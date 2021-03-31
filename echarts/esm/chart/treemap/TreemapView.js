
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
import { bind, each, indexOf, curry, extend, retrieve, normalizeCssArray, isFunction } from 'zrender/esm/core/util';
import * as graphic from '../../util/graphic';
import { getECData } from '../../util/innerStore';
import { isHighDownDispatcher, setAsHighDownDispatcher, setDefaultStateProxy, enableHoverFocus } from '../../util/states';
import DataDiffer from '../../data/DataDiffer';
import * as helper from '../helper/treeHelper';
import Breadcrumb from './Breadcrumb';
import RoamController from '../../component/helper/RoamController';
import BoundingRect from 'zrender/esm/core/BoundingRect';
import * as matrix from 'zrender/esm/core/matrix';
import * as animationUtil from '../../util/animation';
import makeStyleMapper from '../../model/mixin/makeStyleMapper';
import ChartView from '../../view/Chart';
import Displayable from 'zrender/esm/graphic/Displayable';
import { makeInner, convertOptionIdName } from '../../util/model';
import { windowOpen } from '../../util/format';
import { setLabelStyle, getLabelStatesModels } from '../../label/labelStyle';
var Group = graphic.Group;
var Rect = graphic.Rect;
var DRAG_THRESHOLD = 3;
var PATH_LABEL_NOAMAL = 'label';
var PATH_UPPERLABEL_NORMAL = 'upperLabel';
var Z_BASE = 10;
var Z_BG = 1;
var Z_CONTENT = 2;
var getStateItemStyle = makeStyleMapper([['fill', 'color'], ['stroke', 'strokeColor'], ['lineWidth', 'strokeWidth'], ['shadowBlur'], ['shadowOffsetX'], ['shadowOffsetY'], ['shadowColor']]);

var getItemStyleNormal = function (model) {
  var itemStyle = getStateItemStyle(model);
  itemStyle.stroke = itemStyle.fill = itemStyle.lineWidth = null;
  return itemStyle;
};

var inner = makeInner();

var TreemapView = function (_super) {
  __extends(TreemapView, _super);

  function TreemapView() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = TreemapView.type;
    _this._state = 'ready';
    _this._storage = createStorage();
    return _this;
  }

  TreemapView.prototype.render = function (seriesModel, ecModel, api, payload) {
    var models = ecModel.findComponents({
      mainType: 'series',
      subType: 'treemap',
      query: payload
    });

    if (indexOf(models, seriesModel) < 0) {
      return;
    }

    this.seriesModel = seriesModel;
    this.api = api;
    this.ecModel = ecModel;
    var types = ['treemapZoomToNode', 'treemapRootToNode'];
    var targetInfo = helper.retrieveTargetInfo(payload, types, seriesModel);
    var payloadType = payload && payload.type;
    var layoutInfo = seriesModel.layoutInfo;
    var isInit = !this._oldTree;
    var thisStorage = this._storage;
    var reRoot = payloadType === 'treemapRootToNode' && targetInfo && thisStorage ? {
      rootNodeGroup: thisStorage.nodeGroup[targetInfo.node.getRawIndex()],
      direction: payload.direction
    } : null;

    var containerGroup = this._giveContainerGroup(layoutInfo);

    var renderResult = this._doRender(containerGroup, seriesModel, reRoot);

    !isInit && (!payloadType || payloadType === 'treemapZoomToNode' || payloadType === 'treemapRootToNode') ? this._doAnimation(containerGroup, renderResult, seriesModel, reRoot) : renderResult.renderFinally();

    this._resetController(api);

    this._renderBreadcrumb(seriesModel, api, targetInfo);
  };

  TreemapView.prototype._giveContainerGroup = function (layoutInfo) {
    var containerGroup = this._containerGroup;

    if (!containerGroup) {
      containerGroup = this._containerGroup = new Group();

      this._initEvents(containerGroup);

      this.group.add(containerGroup);
    }

    containerGroup.x = layoutInfo.x;
    containerGroup.y = layoutInfo.y;
    return containerGroup;
  };

  TreemapView.prototype._doRender = function (containerGroup, seriesModel, reRoot) {
    var thisTree = seriesModel.getData().tree;
    var oldTree = this._oldTree;
    var lastsForAnimation = createStorage();
    var thisStorage = createStorage();
    var oldStorage = this._storage;
    var willInvisibleEls = [];

    function doRenderNode(thisNode, oldNode, parentGroup, depth) {
      return renderNode(seriesModel, thisStorage, oldStorage, reRoot, lastsForAnimation, willInvisibleEls, thisNode, oldNode, parentGroup, depth);
    }

    dualTravel(thisTree.root ? [thisTree.root] : [], oldTree && oldTree.root ? [oldTree.root] : [], containerGroup, thisTree === oldTree || !oldTree, 0);
    var willDeleteEls = clearStorage(oldStorage);
    this._oldTree = thisTree;
    this._storage = thisStorage;
    return {
      lastsForAnimation: lastsForAnimation,
      willDeleteEls: willDeleteEls,
      renderFinally: renderFinally
    };

    function dualTravel(thisViewChildren, oldViewChildren, parentGroup, sameTree, depth) {
      if (sameTree) {
        oldViewChildren = thisViewChildren;
        each(thisViewChildren, function (child, index) {
          !child.isRemoved() && processNode(index, index);
        });
      } else {
        new DataDiffer(oldViewChildren, thisViewChildren, getKey, getKey).add(processNode).update(processNode).remove(curry(processNode, null)).execute();
      }

      function getKey(node) {
        return node.getId();
      }

      function processNode(newIndex, oldIndex) {
        var thisNode = newIndex != null ? thisViewChildren[newIndex] : null;
        var oldNode = oldIndex != null ? oldViewChildren[oldIndex] : null;
        var group = doRenderNode(thisNode, oldNode, parentGroup, depth);
        group && dualTravel(thisNode && thisNode.viewChildren || [], oldNode && oldNode.viewChildren || [], group, sameTree, depth + 1);
      }
    }

    function clearStorage(storage) {
      var willDeleteEls = createStorage();
      storage && each(storage, function (store, storageName) {
        var delEls = willDeleteEls[storageName];
        each(store, function (el) {
          el && (delEls.push(el), inner(el).willDelete = true);
        });
      });
      return willDeleteEls;
    }

    function renderFinally() {
      each(willDeleteEls, function (els) {
        each(els, function (el) {
          el.parent && el.parent.remove(el);
        });
      });
      each(willInvisibleEls, function (el) {
        el.invisible = true;
        el.dirty();
      });
    }
  };

  TreemapView.prototype._doAnimation = function (containerGroup, renderResult, seriesModel, reRoot) {
    if (!seriesModel.get('animation')) {
      return;
    }

    var durationOption = seriesModel.get('animationDurationUpdate');
    var easingOption = seriesModel.get('animationEasing');
    var duration = (isFunction(durationOption) ? 0 : durationOption) || 0;
    var easing = (isFunction(easingOption) ? null : easingOption) || 'cubicOut';
    var animationWrap = animationUtil.createWrap();
    each(renderResult.willDeleteEls, function (store, storageName) {
      each(store, function (el, rawIndex) {
        if (el.invisible) {
          return;
        }

        var parent = el.parent;
        var target;
        var innerStore = inner(parent);

        if (reRoot && reRoot.direction === 'drillDown') {
          target = parent === reRoot.rootNodeGroup ? {
            shape: {
              x: 0,
              y: 0,
              width: innerStore.nodeWidth,
              height: innerStore.nodeHeight
            },
            style: {
              opacity: 0
            }
          } : {
            style: {
              opacity: 0
            }
          };
        } else {
          var targetX = 0;
          var targetY = 0;

          if (!innerStore.willDelete) {
            targetX = innerStore.nodeWidth / 2;
            targetY = innerStore.nodeHeight / 2;
          }

          target = storageName === 'nodeGroup' ? {
            x: targetX,
            y: targetY,
            style: {
              opacity: 0
            }
          } : {
            shape: {
              x: targetX,
              y: targetY,
              width: 0,
              height: 0
            },
            style: {
              opacity: 0
            }
          };
        }

        target && animationWrap.add(el, target, duration, 0, easing);
      });
    });
    each(this._storage, function (store, storageName) {
      each(store, function (el, rawIndex) {
        var last = renderResult.lastsForAnimation[storageName][rawIndex];
        var target = {};

        if (!last) {
          return;
        }

        if (el instanceof graphic.Group) {
          if (last.oldX != null) {
            target.x = el.x;
            target.y = el.y;
            el.x = last.oldX;
            el.y = last.oldY;
          }
        } else {
          if (last.oldShape) {
            target.shape = extend({}, el.shape);
            el.setShape(last.oldShape);
          }

          if (last.fadein) {
            el.setStyle('opacity', 0);
            target.style = {
              opacity: 1
            };
          } else if (el.style.opacity !== 1) {
            target.style = {
              opacity: 1
            };
          }
        }

        animationWrap.add(el, target, duration, 0, easing);
      });
    }, this);
    this._state = 'animating';
    animationWrap.finished(bind(function () {
      this._state = 'ready';
      renderResult.renderFinally();
    }, this)).start();
  };

  TreemapView.prototype._resetController = function (api) {
    var controller = this._controller;

    if (!controller) {
      controller = this._controller = new RoamController(api.getZr());
      controller.enable(this.seriesModel.get('roam'));
      controller.on('pan', bind(this._onPan, this));
      controller.on('zoom', bind(this._onZoom, this));
    }

    var rect = new BoundingRect(0, 0, api.getWidth(), api.getHeight());
    controller.setPointerChecker(function (e, x, y) {
      return rect.contain(x, y);
    });
  };

  TreemapView.prototype._clearController = function () {
    var controller = this._controller;

    if (controller) {
      controller.dispose();
      controller = null;
    }
  };

  TreemapView.prototype._onPan = function (e) {
    if (this._state !== 'animating' && (Math.abs(e.dx) > DRAG_THRESHOLD || Math.abs(e.dy) > DRAG_THRESHOLD)) {
      var root = this.seriesModel.getData().tree.root;

      if (!root) {
        return;
      }

      var rootLayout = root.getLayout();

      if (!rootLayout) {
        return;
      }

      this.api.dispatchAction({
        type: 'treemapMove',
        from: this.uid,
        seriesId: this.seriesModel.id,
        rootRect: {
          x: rootLayout.x + e.dx,
          y: rootLayout.y + e.dy,
          width: rootLayout.width,
          height: rootLayout.height
        }
      });
    }
  };

  TreemapView.prototype._onZoom = function (e) {
    var mouseX = e.originX;
    var mouseY = e.originY;

    if (this._state !== 'animating') {
      var root = this.seriesModel.getData().tree.root;

      if (!root) {
        return;
      }

      var rootLayout = root.getLayout();

      if (!rootLayout) {
        return;
      }

      var rect = new BoundingRect(rootLayout.x, rootLayout.y, rootLayout.width, rootLayout.height);
      var layoutInfo = this.seriesModel.layoutInfo;
      mouseX -= layoutInfo.x;
      mouseY -= layoutInfo.y;
      var m = matrix.create();
      matrix.translate(m, m, [-mouseX, -mouseY]);
      matrix.scale(m, m, [e.scale, e.scale]);
      matrix.translate(m, m, [mouseX, mouseY]);
      rect.applyTransform(m);
      this.api.dispatchAction({
        type: 'treemapRender',
        from: this.uid,
        seriesId: this.seriesModel.id,
        rootRect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        }
      });
    }
  };

  TreemapView.prototype._initEvents = function (containerGroup) {
    var _this = this;

    containerGroup.on('click', function (e) {
      if (_this._state !== 'ready') {
        return;
      }

      var nodeClick = _this.seriesModel.get('nodeClick', true);

      if (!nodeClick) {
        return;
      }

      var targetInfo = _this.findTarget(e.offsetX, e.offsetY);

      if (!targetInfo) {
        return;
      }

      var node = targetInfo.node;

      if (node.getLayout().isLeafRoot) {
        _this._rootToNode(targetInfo);
      } else {
        if (nodeClick === 'zoomToNode') {
          _this._zoomToNode(targetInfo);
        } else if (nodeClick === 'link') {
          var itemModel = node.hostTree.data.getItemModel(node.dataIndex);
          var link = itemModel.get('link', true);
          var linkTarget = itemModel.get('target', true) || 'blank';
          link && windowOpen(link, linkTarget);
        }
      }
    }, this);
  };

  TreemapView.prototype._renderBreadcrumb = function (seriesModel, api, targetInfo) {
    var _this = this;

    if (!targetInfo) {
      targetInfo = seriesModel.get('leafDepth', true) != null ? {
        node: seriesModel.getViewRoot()
      } : this.findTarget(api.getWidth() / 2, api.getHeight() / 2);

      if (!targetInfo) {
        targetInfo = {
          node: seriesModel.getData().tree.root
        };
      }
    }

    (this._breadcrumb || (this._breadcrumb = new Breadcrumb(this.group))).render(seriesModel, api, targetInfo.node, function (node) {
      if (_this._state !== 'animating') {
        helper.aboveViewRoot(seriesModel.getViewRoot(), node) ? _this._rootToNode({
          node: node
        }) : _this._zoomToNode({
          node: node
        });
      }
    });
  };

  TreemapView.prototype.remove = function () {
    this._clearController();

    this._containerGroup && this._containerGroup.removeAll();
    this._storage = createStorage();
    this._state = 'ready';
    this._breadcrumb && this._breadcrumb.remove();
  };

  TreemapView.prototype.dispose = function () {
    this._clearController();
  };

  TreemapView.prototype._zoomToNode = function (targetInfo) {
    this.api.dispatchAction({
      type: 'treemapZoomToNode',
      from: this.uid,
      seriesId: this.seriesModel.id,
      targetNode: targetInfo.node
    });
  };

  TreemapView.prototype._rootToNode = function (targetInfo) {
    this.api.dispatchAction({
      type: 'treemapRootToNode',
      from: this.uid,
      seriesId: this.seriesModel.id,
      targetNode: targetInfo.node
    });
  };

  TreemapView.prototype.findTarget = function (x, y) {
    var targetInfo;
    var viewRoot = this.seriesModel.getViewRoot();
    viewRoot.eachNode({
      attr: 'viewChildren',
      order: 'preorder'
    }, function (node) {
      var bgEl = this._storage.background[node.getRawIndex()];

      if (bgEl) {
        var point = bgEl.transformCoordToLocal(x, y);
        var shape = bgEl.shape;

        if (shape.x <= point[0] && point[0] <= shape.x + shape.width && shape.y <= point[1] && point[1] <= shape.y + shape.height) {
          targetInfo = {
            node: node,
            offsetX: point[0],
            offsetY: point[1]
          };
        } else {
          return false;
        }
      }
    }, this);
    return targetInfo;
  };

  TreemapView.type = 'treemap';
  return TreemapView;
}(ChartView);

function createStorage() {
  return {
    nodeGroup: [],
    background: [],
    content: []
  };
}

function renderNode(seriesModel, thisStorage, oldStorage, reRoot, lastsForAnimation, willInvisibleEls, thisNode, oldNode, parentGroup, depth) {
  if (!thisNode) {
    return;
  }

  var thisLayout = thisNode.getLayout();
  var data = seriesModel.getData();
  var nodeModel = thisNode.getModel();
  data.setItemGraphicEl(thisNode.dataIndex, null);

  if (!thisLayout || !thisLayout.isInView) {
    return;
  }

  var thisWidth = thisLayout.width;
  var thisHeight = thisLayout.height;
  var borderWidth = thisLayout.borderWidth;
  var thisInvisible = thisLayout.invisible;
  var thisRawIndex = thisNode.getRawIndex();
  var oldRawIndex = oldNode && oldNode.getRawIndex();
  var thisViewChildren = thisNode.viewChildren;
  var upperHeight = thisLayout.upperHeight;
  var isParent = thisViewChildren && thisViewChildren.length;
  var itemStyleNormalModel = nodeModel.getModel('itemStyle');
  var itemStyleEmphasisModel = nodeModel.getModel(['emphasis', 'itemStyle']);
  var itemStyleBlurModel = nodeModel.getModel(['blur', 'itemStyle']);
  var itemStyleSelectModel = nodeModel.getModel(['select', 'itemStyle']);
  var borderRadius = itemStyleNormalModel.get('borderRadius') || 0;
  var group = giveGraphic('nodeGroup', Group);

  if (!group) {
    return;
  }

  parentGroup.add(group);
  group.x = thisLayout.x || 0;
  group.y = thisLayout.y || 0;
  group.markRedraw();
  inner(group).nodeWidth = thisWidth;
  inner(group).nodeHeight = thisHeight;

  if (thisLayout.isAboveViewRoot) {
    return group;
  }

  var bg = giveGraphic('background', Rect, depth, Z_BG);
  bg && renderBackground(group, bg, isParent && thisLayout.upperLabelHeight);
  var focus = nodeModel.get(['emphasis', 'focus']);
  var blurScope = nodeModel.get(['emphasis', 'blurScope']);
  var focusDataIndices = focus === 'ancestor' ? thisNode.getAncestorsIndices() : focus === 'descendant' ? thisNode.getDescendantIndices() : null;

  if (isParent) {
    if (isHighDownDispatcher(group)) {
      setAsHighDownDispatcher(group, false);
    }

    if (bg) {
      setAsHighDownDispatcher(bg, true);
      data.setItemGraphicEl(thisNode.dataIndex, bg);
      enableHoverFocus(bg, focusDataIndices || focus, blurScope);
    }
  } else {
    var content = giveGraphic('content', Rect, depth, Z_CONTENT);
    content && renderContent(group, content);

    if (bg && isHighDownDispatcher(bg)) {
      setAsHighDownDispatcher(bg, false);
    }

    setAsHighDownDispatcher(group, true);
    data.setItemGraphicEl(thisNode.dataIndex, group);
    enableHoverFocus(group, focusDataIndices || focus, blurScope);
  }

  return group;

  function renderBackground(group, bg, useUpperLabel) {
    var ecData = getECData(bg);
    ecData.dataIndex = thisNode.dataIndex;
    ecData.seriesIndex = seriesModel.seriesIndex;
    bg.setShape({
      x: 0,
      y: 0,
      width: thisWidth,
      height: thisHeight,
      r: borderRadius
    });

    if (thisInvisible) {
      processInvisible(bg);
    } else {
      bg.invisible = false;
      var style = thisNode.getVisual('style');
      var visualBorderColor = style.stroke;
      var normalStyle = getItemStyleNormal(itemStyleNormalModel);
      normalStyle.fill = visualBorderColor;
      var emphasisStyle = getStateItemStyle(itemStyleEmphasisModel);
      emphasisStyle.fill = itemStyleEmphasisModel.get('borderColor');
      var blurStyle = getStateItemStyle(itemStyleBlurModel);
      blurStyle.fill = itemStyleBlurModel.get('borderColor');
      var selectStyle = getStateItemStyle(itemStyleSelectModel);
      selectStyle.fill = itemStyleSelectModel.get('borderColor');

      if (useUpperLabel) {
        var upperLabelWidth = thisWidth - 2 * borderWidth;
        prepareText(bg, visualBorderColor, upperLabelWidth, upperHeight, style.opacity, {
          x: borderWidth,
          y: 0,
          width: upperLabelWidth,
          height: upperHeight
        });
      } else {
        bg.removeTextContent();
      }

      bg.setStyle(normalStyle);
      bg.ensureState('emphasis').style = emphasisStyle;
      bg.ensureState('blur').style = blurStyle;
      bg.ensureState('select').style = selectStyle;
      setDefaultStateProxy(bg);
    }

    group.add(bg);
  }

  function renderContent(group, content) {
    var ecData = getECData(content);
    ecData.dataIndex = thisNode.dataIndex;
    ecData.seriesIndex = seriesModel.seriesIndex;
    var contentWidth = Math.max(thisWidth - 2 * borderWidth, 0);
    var contentHeight = Math.max(thisHeight - 2 * borderWidth, 0);
    content.culling = true;
    content.setShape({
      x: borderWidth,
      y: borderWidth,
      width: contentWidth,
      height: contentHeight,
      r: borderRadius
    });

    if (thisInvisible) {
      processInvisible(content);
    } else {
      content.invisible = false;
      var nodeStyle = thisNode.getVisual('style');
      var visualColor = nodeStyle.fill;
      var normalStyle = getItemStyleNormal(itemStyleNormalModel);
      normalStyle.fill = visualColor;
      normalStyle.decal = nodeStyle.decal;
      var emphasisStyle = getStateItemStyle(itemStyleEmphasisModel);
      var blurStyle = getStateItemStyle(itemStyleBlurModel);
      var selectStyle = getStateItemStyle(itemStyleSelectModel);
      prepareText(content, visualColor, contentWidth, nodeStyle.opacity, contentHeight);
      content.setStyle(normalStyle);
      content.ensureState('emphasis').style = emphasisStyle;
      content.ensureState('blur').style = blurStyle;
      content.ensureState('select').style = selectStyle;
      setDefaultStateProxy(content);
    }

    group.add(content);
  }

  function processInvisible(element) {
    !element.invisible && willInvisibleEls.push(element);
  }

  function prepareText(rectEl, visualColor, visualOpacity, width, height, upperLabelRect) {
    var normalLabelModel = nodeModel.getModel(upperLabelRect ? PATH_UPPERLABEL_NORMAL : PATH_LABEL_NOAMAL);
    var text = retrieve(seriesModel.getFormattedLabel(thisNode.dataIndex, 'normal', null, null, normalLabelModel.get('formatter')), convertOptionIdName(nodeModel.get('name'), null));

    if (!upperLabelRect && thisLayout.isLeafRoot) {
      var iconChar = seriesModel.get('drillDownIcon', true);
      text = iconChar ? iconChar + ' ' + text : text;
    }

    var isShow = normalLabelModel.getShallow('show');
    setLabelStyle(rectEl, getLabelStatesModels(nodeModel, upperLabelRect ? PATH_UPPERLABEL_NORMAL : PATH_LABEL_NOAMAL), {
      defaultText: isShow ? text : null,
      inheritColor: visualColor,
      defaultOpacity: visualOpacity,
      labelFetcher: seriesModel,
      labelDataIndex: thisNode.dataIndex
    });
    var textEl = rectEl.getTextContent();
    var textStyle = textEl.style;
    var textPadding = normalizeCssArray(textStyle.padding || 0);

    if (upperLabelRect) {
      rectEl.setTextConfig({
        layoutRect: upperLabelRect
      });
      textEl.disableLabelLayout = true;
    }

    textEl.beforeUpdate = function () {
      var width = Math.max((upperLabelRect ? upperLabelRect.width : rectEl.shape.width) - textPadding[1] - textPadding[3], 0);
      var height = Math.max((upperLabelRect ? upperLabelRect.height : rectEl.shape.height) - textPadding[0] - textPadding[2], 0);

      if (textStyle.width !== width || textStyle.height !== height) {
        textEl.setStyle({
          width: width,
          height: height
        });
      }
    };

    textStyle.truncateMinChar = 2;
    textStyle.lineOverflow = 'truncate';
    addDrillDownIcon(textStyle, upperLabelRect, thisLayout);
    var textEmphasisState = textEl.getState('emphasis');
    addDrillDownIcon(textEmphasisState ? textEmphasisState.style : null, upperLabelRect, thisLayout);
  }

  function addDrillDownIcon(style, upperLabelRect, thisLayout) {
    var text = style ? style.text : null;

    if (!upperLabelRect && thisLayout.isLeafRoot && text != null) {
      var iconChar = seriesModel.get('drillDownIcon', true);
      style.text = iconChar ? iconChar + ' ' + text : text;
    }
  }

  function giveGraphic(storageName, Ctor, depth, z) {
    var element = oldRawIndex != null && oldStorage[storageName][oldRawIndex];
    var lasts = lastsForAnimation[storageName];

    if (element) {
      oldStorage[storageName][oldRawIndex] = null;
      prepareAnimationWhenHasOld(lasts, element);
    } else if (!thisInvisible) {
      element = new Ctor();

      if (element instanceof Displayable) {
        element.z = calculateZ(depth, z);
      }

      prepareAnimationWhenNoOld(lasts, element);
    }

    return thisStorage[storageName][thisRawIndex] = element;
  }

  function prepareAnimationWhenHasOld(lasts, element) {
    var lastCfg = lasts[thisRawIndex] = {};

    if (element instanceof Group) {
      lastCfg.oldX = element.x;
      lastCfg.oldY = element.y;
    } else {
      lastCfg.oldShape = extend({}, element.shape);
    }
  }

  function prepareAnimationWhenNoOld(lasts, element) {
    var lastCfg = lasts[thisRawIndex] = {};
    var parentNode = thisNode.parentNode;
    var isGroup = element instanceof graphic.Group;

    if (parentNode && (!reRoot || reRoot.direction === 'drillDown')) {
      var parentOldX = 0;
      var parentOldY = 0;
      var parentOldBg = lastsForAnimation.background[parentNode.getRawIndex()];

      if (!reRoot && parentOldBg && parentOldBg.oldShape) {
        parentOldX = parentOldBg.oldShape.width;
        parentOldY = parentOldBg.oldShape.height;
      }

      if (isGroup) {
        lastCfg.oldX = 0;
        lastCfg.oldY = parentOldY;
      } else {
        lastCfg.oldShape = {
          x: parentOldX,
          y: parentOldY,
          width: 0,
          height: 0
        };
      }
    }

    lastCfg.fadein = !isGroup;
  }
}

function calculateZ(depth, zInLevel) {
  var zb = depth * Z_BASE + zInLevel;
  return (zb - 1) / zb;
}

ChartView.registerClass(TreemapView);