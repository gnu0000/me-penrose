"use strict";

// a simple Point class with a chaining API
//
// Craig Fitzgerald
//
// note: all methods that take x,y params may alternatively take a Point instead
// ex:
//    let pt1 = new Point(10,20);
//    let pt2 = new Point(pt1);
//

export default class Point {
   constructor(x,y) {
      this.Set(x,y);
   };
   
   Set(x,y) {
      this._params(x,y);
      this.x = this.xParam; 
      this.y = this.yParam;
      return this;
   }

   Clone() {
      return new Point(this.x, this.y);
   }

   Scale(x,y) {
      this._params(x,y);
      this.x *= this.xParam;
      this.y *= this.yParam;
      return this;
   }

   UnScale(x,y) {
      this._params(x,y);
      this.x /= this.xParam;
      this.y /= this.yParam;
      return this;
   }

   Offset(x,y) {
      this._params(x,y);
      this.x += this.xParam;
      this.y += this.yParam;
      return this;
   }

   UnOffset(x,y) {
      this._params(x,y);
      this.x -= this.xParam;
      this.y -= this.yParam;
      return this;
   }

   FlipYAxis(ySize) {
      this.y = ySize - this.y;
      return this;
   }

   Min(x,y) {
      this._params(x,y);
      this.x = Math.min(this.x, this.xParam);
      this.y = Math.min(this.y, this.yParam);
      return this;
   }
      
   Max(x,y) {
      this._params(x,y);
      this.x = Math.max(this.x, this.xParam);
      this.y = Math.max(this.y, this.yParam);
      return this;
   }

   Range(val) {
      this.x = Math.min(this.x, val);
      this.y = Math.max(this.y, val);
      return this;
   }

   Round(precision) {
      this.x = Math.floor(this.x * precision + 0.5) / precision;
      this.y = Math.floor(this.y * precision + 0.5) / precision;
      return this;
   }

   Negate() {
      this.x = 0-this.x;
      this.y = 0-this.y;
      return this;
   }

   BindWithin (min, max) {
      this.x = Math.max(this.x, min.x);
      this.x = Math.min(this.x, max.x);
      this.y = Math.max(this.y, min.y);
      this.y = Math.min(this.y, max.y);
      return this;
   }

   RelativeTo(x,y) {
      this._params(x,y);
      this.x = this.x < 0 ? this.xParam + this.x : this.x;
      this.y = this.y < 0 ? this.yParam + this.y : this.y;
      return this;
   }

   InterpolateTo(x, y, ammt) {
      this._params(x,y);
      if (typeof x == "object") ammt = y;

      let dx = (this.xParam - this.x) * ammt;
      let dy = (this.yParam - this.y) * ammt;
      return this.Offset(dx, dy);
   }
      
   // not a true distance, this needs to be fast
   IsCloseTo(x, y, distance) {

      this._params(x,y);
      if (typeof x == "object") distance = y;

      var ndistance = 0-distance;
      var dx = this.x - this.xParam;
      var dy = this.y - this.yParam;
      return ((dx <= distance && dx >= ndistance &&
               dx <= distance && dx >= ndistance)
              ? 1 : 0);
   }
   
   AsString(label) {
      var str = (arguments.length > 0 ? label + ":" : "");
      str += "["+ Math.floor(this.x*1000)/1000 + "," + Math.floor(this.y*1000)/1000 + "]";
      return str;
   }

   // allow params to be (x,y) or (point)
   _params(x,y) {
      var tt = typeof x;
      
      if (x == undefined) {
         this.xParam = this.yParam = 0;
      } else if (typeof x == "object") {
         this.xParam = x.x - 0;
         this.yParam = x.y - 0;
      } else {
         this.xParam = x - 0; 
         this.yParam = y - 0;
      }
      return this;
   }
}

