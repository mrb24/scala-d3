/*
 * Copyright (C) 2014 Deltamation Software. All rights reserved.
 * @author Jared Wiltshire
 */

define(['./Element', './CSSStyleDeclaration'], function(Element, CSSStyleDeclaration) {

function SVGElement() {
    Element.apply(this, arguments);
}

SVGElement.prototype = Object.create(Element.prototype, {
    style: { get: function() {
        if (!this._style)
          this._style = new CSSStyleDeclaration(this);
        return this._style;
    }},
});

return SVGElement;

});
