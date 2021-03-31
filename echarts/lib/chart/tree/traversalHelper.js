
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

function eachAfter(root, callback, separation) {
  var nodes = [root];
  var next = [];
  var node;

  while (node = nodes.pop()) {
    next.push(node);

    if (node.isExpand) {
      var children = node.children;

      if (children.length) {
        for (var i = 0; i < children.length; i++) {
          nodes.push(children[i]);
        }
      }
    }
  }

  while (node = next.pop()) {
    callback(node, separation);
  }
}

exports.eachAfter = eachAfter;

function eachBefore(root, callback) {
  var nodes = [root];
  var node;

  while (node = nodes.pop()) {
    callback(node);

    if (node.isExpand) {
      var children = node.children;

      if (children.length) {
        for (var i = children.length - 1; i >= 0; i--) {
          nodes.push(children[i]);
        }
      }
    }
  }
}

exports.eachBefore = eachBefore;