
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

"use strict";

exports.__esModule = true;

var zrUtil = require("zrender/lib/core/util");

var linkList_1 = require("./helper/linkList");

var List_1 = require("./List");

var createDimensions_1 = require("./helper/createDimensions");

var model_1 = require("../util/model");

var TreeNode = function () {
  function TreeNode(name, hostTree) {
    this.depth = 0;
    this.height = 0;
    this.dataIndex = -1;
    this.children = [];
    this.viewChildren = [];
    this.isExpand = false;
    this.name = name || '';
    this.hostTree = hostTree;
  }

  TreeNode.prototype.isRemoved = function () {
    return this.dataIndex < 0;
  };

  TreeNode.prototype.eachNode = function (options, cb, context) {
    if (typeof options === 'function') {
      context = cb;
      cb = options;
      options = null;
    }

    options = options || {};

    if (zrUtil.isString(options)) {
      options = {
        order: options
      };
    }

    var order = options.order || 'preorder';
    var children = this[options.attr || 'children'];
    var suppressVisitSub;
    order === 'preorder' && (suppressVisitSub = cb.call(context, this));

    for (var i = 0; !suppressVisitSub && i < children.length; i++) {
      children[i].eachNode(options, cb, context);
    }

    order === 'postorder' && cb.call(context, this);
  };

  TreeNode.prototype.updateDepthAndHeight = function (depth) {
    var height = 0;
    this.depth = depth;

    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      child.updateDepthAndHeight(depth + 1);

      if (child.height > height) {
        height = child.height;
      }
    }

    this.height = height + 1;
  };

  TreeNode.prototype.getNodeById = function (id) {
    if (this.getId() === id) {
      return this;
    }

    for (var i = 0, children = this.children, len = children.length; i < len; i++) {
      var res = children[i].getNodeById(id);

      if (res) {
        return res;
      }
    }
  };

  TreeNode.prototype.contains = function (node) {
    if (node === this) {
      return true;
    }

    for (var i = 0, children = this.children, len = children.length; i < len; i++) {
      var res = children[i].contains(node);

      if (res) {
        return res;
      }
    }
  };

  TreeNode.prototype.getAncestors = function (includeSelf) {
    var ancestors = [];
    var node = includeSelf ? this : this.parentNode;

    while (node) {
      ancestors.push(node);
      node = node.parentNode;
    }

    ancestors.reverse();
    return ancestors;
  };

  TreeNode.prototype.getAncestorsIndices = function () {
    var indices = [];
    var currNode = this;

    while (currNode) {
      indices.push(currNode.dataIndex);
      currNode = currNode.parentNode;
    }

    indices.reverse();
    return indices;
  };

  TreeNode.prototype.getDescendantIndices = function () {
    var indices = [];
    this.eachNode(function (childNode) {
      indices.push(childNode.dataIndex);
    });
    return indices;
  };

  TreeNode.prototype.getValue = function (dimension) {
    var data = this.hostTree.data;
    return data.get(data.getDimension(dimension || 'value'), this.dataIndex);
  };

  TreeNode.prototype.setLayout = function (layout, merge) {
    this.dataIndex >= 0 && this.hostTree.data.setItemLayout(this.dataIndex, layout, merge);
  };

  TreeNode.prototype.getLayout = function () {
    return this.hostTree.data.getItemLayout(this.dataIndex);
  };

  TreeNode.prototype.getModel = function (path) {
    if (this.dataIndex < 0) {
      return;
    }

    var hostTree = this.hostTree;
    var itemModel = hostTree.data.getItemModel(this.dataIndex);
    return itemModel.getModel(path);
  };

  TreeNode.prototype.getLevelModel = function () {
    return (this.hostTree.levelModels || [])[this.depth];
  };

  TreeNode.prototype.setVisual = function (key, value) {
    this.dataIndex >= 0 && this.hostTree.data.setItemVisual(this.dataIndex, key, value);
  };

  TreeNode.prototype.getVisual = function (key) {
    return this.hostTree.data.getItemVisual(this.dataIndex, key);
  };

  TreeNode.prototype.getRawIndex = function () {
    return this.hostTree.data.getRawIndex(this.dataIndex);
  };

  TreeNode.prototype.getId = function () {
    return this.hostTree.data.getId(this.dataIndex);
  };

  TreeNode.prototype.isAncestorOf = function (node) {
    var parent = node.parentNode;

    while (parent) {
      if (parent === this) {
        return true;
      }

      parent = parent.parentNode;
    }

    return false;
  };

  TreeNode.prototype.isDescendantOf = function (node) {
    return node !== this && node.isAncestorOf(this);
  };

  return TreeNode;
}();

exports.TreeNode = TreeNode;
;

var Tree = function () {
  function Tree(hostModel) {
    this.type = 'tree';
    this._nodes = [];
    this.hostModel = hostModel;
  }

  Tree.prototype.eachNode = function (options, cb, context) {
    this.root.eachNode(options, cb, context);
  };

  Tree.prototype.getNodeByDataIndex = function (dataIndex) {
    var rawIndex = this.data.getRawIndex(dataIndex);
    return this._nodes[rawIndex];
  };

  Tree.prototype.getNodeById = function (name) {
    return this.root.getNodeById(name);
  };

  Tree.prototype.update = function () {
    var data = this.data;
    var nodes = this._nodes;

    for (var i = 0, len = nodes.length; i < len; i++) {
      nodes[i].dataIndex = -1;
    }

    for (var i = 0, len = data.count(); i < len; i++) {
      nodes[data.getRawIndex(i)].dataIndex = i;
    }
  };

  Tree.prototype.clearLayouts = function () {
    this.data.clearItemLayouts();
  };

  Tree.createTree = function (dataRoot, hostModel, beforeLink) {
    var tree = new Tree(hostModel);
    var listData = [];
    var dimMax = 1;
    buildHierarchy(dataRoot);

    function buildHierarchy(dataNode, parentNode) {
      var value = dataNode.value;
      dimMax = Math.max(dimMax, zrUtil.isArray(value) ? value.length : 1);
      listData.push(dataNode);
      var node = new TreeNode(model_1.convertOptionIdName(dataNode.name, ''), tree);
      parentNode ? addChild(node, parentNode) : tree.root = node;

      tree._nodes.push(node);

      var children = dataNode.children;

      if (children) {
        for (var i = 0; i < children.length; i++) {
          buildHierarchy(children[i], node);
        }
      }
    }

    tree.root.updateDepthAndHeight(0);
    var dimensionsInfo = createDimensions_1["default"](listData, {
      coordDimensions: ['value'],
      dimensionsCount: dimMax
    });
    var list = new List_1["default"](dimensionsInfo, hostModel);
    list.initData(listData);
    beforeLink && beforeLink(list);
    linkList_1["default"]({
      mainData: list,
      struct: tree,
      structAttr: 'tree'
    });
    tree.update();
    return tree;
  };

  return Tree;
}();

function addChild(child, node) {
  var children = node.children;

  if (child.parentNode === node) {
    return;
  }

  children.push(child);
  child.parentNode = node;
}

exports["default"] = Tree;