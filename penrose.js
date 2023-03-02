"use strict";

// penrose.js
//
// This sample generates a penrose tiling
//
// It is a famous example of an an aperiodic tiling, where only
// 2 shapes fully cover a surface, but the pattern never repeats
//
// This code uses a simple recursive method described on Wikipedia 
//   https://en.wikipedia.org/wiki/Penrose_tiling
//
// Craig Fitzgerald 2023

import Point from './Point.js'
 
class PenroseTiler {
   constructor() {
      this.$canvas   = $("#canvas");
      this.canvas    = this.$canvas.get(0);
      this.ctx       = this.canvas.getContext("2d");
      this.triangles = [];
      this.PI2       = Math.PI * 2;          // two pi
      this.GR        = (1 + Math.sqrt(5))/2; // golden ratio
      this.GRS       = 1 / (this.GR + 1);    // golden ratio small pct
      this.GRB       = 1 - this.GRS;         // golden ratio big pct
      this.size      = 9999;
      this.steps     = 7;

      $(window).on("resize", ()=>this.SizeChange());
      $("input[type='range']").on("input", (e)=>this.SliderChange(e));

      this.Resize();
      this.InitState();
      this.Draw();
   }

   SizeChange() {
      this.Resize();
      this.Draw();
   }

   SliderChange(e) {
      this.steps = +$(e.currentTarget).val();
      this.CalcGeometry();
      this.Draw();
   }

   InitState() {
      let hue = this.Rand(360);
      this.color1 = this.HSL (hue      , this.RandI(90, 10), this.RandI(60, 40));
      this.color2 = this.HSL (hue + 180, this.RandI(90, 10), this.RandI(60, 40));
      this.CalcGeometry();
      $("input[type='range']").val(this.steps);
   }

   Resize() {
      let x = $(window).width();
      let y = $(window).height();
      this.$canvas.width (x);
      this.$canvas.height(y);
      this.canvas.width  = x;
      this.canvas.height = y;

      if (Math.max(this.canvas.width, this.canvas.height) * 0.7 > this.size) {
         this.CalcGeometry();
         this.Draw();
      }
   }

   CalcGeometry() {
      this.triangles = [];

      let size = this.size = Math.max(this.canvas.width, this.canvas.height) * 0.85;
      let pC = new Point(this.canvas.width/2, this.canvas.height/2);

      for (let i=0; i<10; i++) {
         let phi0 = -this.PI2 * i / 10;
         let phi2 = -this.PI2 * (i+1) / 10;
         let p0 = pC.Clone().Offset(size * Math.cos(phi0), size * Math.sin(phi0));
         let p2 = pC.Clone().Offset(size * Math.cos(phi2), size * Math.sin(phi2));

         let pts = i % 2 ? [p0, pC, p2] : [p2, pC, p0];
         this.BisectSmall(...pts, this.steps);
      }
      console.log(`Calculated ${this.triangles.length} triangles`);
   }

   BisectSmall(p0, p1, p2, steps) {
      if (!steps) return this.triangles.push({typ:0, p0, p1, p2});

      let pP = p0.Clone().InterpolateTo(p1, this.GRS);
      this.BisectSmall(pP, p2, p0, steps-1);
      this.BisectLarge(p2, pP, p1, steps-1);
   }

   BisectLarge(p0, p1, p2, steps) {
      if (!steps) return this.triangles.push({typ:1, p0, p1, p2});

      let pQ = p0.Clone().InterpolateTo(p1, this.GRB);
      let pR = p0.Clone().InterpolateTo(p2, this.GRB);
      this.BisectSmall(pQ, pR, p1, steps-1);
      this.BisectLarge(pR, pQ, p0, steps-1);
      this.BisectLarge(p2, pR, p1, steps-1);
   }
       
   Draw() {
      for (let t of this.triangles) {
         this.DrawTriangle(t);
      }
   }

   DrawTriangle(t) {
      this.ctx.fillStyle = t.typ ? this.color1 : this.color2;
      this.ctx.strokeStyle = "#000";
      this.ctx.lineWidth = 1;
      this.BeginPath().MoveTo(t.p0).LineTo(t.p1).LineTo(t.p2).ClosePath().Fill()
      this.BeginPath().MoveTo(t.p0).LineTo(t.p1).LineTo(t.p2).Stroke();
   }

   HSL(h, s, l){
      return 'hsl('+h+','+s+'%,'+l+'%)';
   }

   Rand(max=1, offset=0) {
      return offset + Math.random() * max;
   }

   RandI(max=360, offset=0) {
      return Math.floor(offset + Math.random() * max);
   }

   BeginPath() {this.ctx.beginPath();        return this}
   MoveTo(pt)  {this.ctx.moveTo(pt.x, pt.y); return this}
   LineTo(pt)  {this.ctx.lineTo(pt.x, pt.y); return this}
   ClosePath() {this.ctx.closePath();        return this}
   Fill()      {this.ctx.fill();             return this}
   Stroke()    {this.ctx.stroke();           return this}
}


$(function() {
   let p = new PenroseTiler("#canvas", {});
});

