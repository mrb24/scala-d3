define(function (require, exports, module) {
module.exports = NodeList;

function item(i) {
  return this[i];
}

function NodeList(a) {
  if (!a) a = [];
  a.item = item;
  return a;
}

});
