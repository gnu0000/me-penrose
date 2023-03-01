"use strict";

// penrose.js
//
//
// Craig Fitzgerald 2023

import Point from './Point.js'

 
class PageHandler {
   constructor() {
      this.$canvas   = $("#canvas");
      this.canvas    = this.$canvas.get(0);
      this.ctx       = this.canvas.getContext("2d");
      this.triangles = [];
      this.PI2       = Math.PI * 2;          // two pi
      this.GR        = (1 + Math.sqrt(5))/2; // golden ratio
      this.GRS       = 1 / (this.GR + 1);    // golden ratio small pct
      this.GRB       = 1 - this.GRS;         // golden ratio big pct
      this.size      = 2560;
      this.steps     = 7;

      $(window).on("resize", ()=>this.ResizeHandler());
      $("input[type='range']").on("change", (e)=>this.SliderChange(e));

      this.Resize();
      this.InitState();
      this.Draw();
   }

   ResizeHandler() {
      this.Resize();
      this.Draw();
   }

   SliderChange(ev) {
      this.steps = +$(ev.currentTarget).val();
      this.CalcGeometry();
      this.Draw();
   }

   Resize() {
      let x = $(window).width();
      let y = $(window).height();
      this.$canvas.width (x);
      this.$canvas.height(y);
      this.canvas.width  = this.size;
      this.canvas.height = this.size;
   }

   InitState() {
      let hue = this.Rand(360);
      this.color1 = this.HSL (hue,             this.RandI(90, 10), this.RandI(60, 29));
      this.color2 = this.HSL ((hue+180) % 360, this.RandI(90, 10), this.RandI(90, 10));
      this.CalcGeometry();
   }

   CalcGeometry() {
      this.triangles = [];

      let scale = this.size * 3 / 4;
      let pC = new Point(this.size/2, this.size/2);
      for (let i=0; i<10; i++) {
         let phi0 = -this.PI2 * i / 10;
         let phi2 = -this.PI2 * (i+1) / 10;
         let p1 = new Point(pC);
         let p0 = new Point(pC);
         let p2 = new Point(pC);
         p0.Offset(scale * Math.cos(phi0), scale * Math.sin(phi0))
         p2.Offset(scale * Math.cos(phi2), scale * Math.sin(phi2))
         i % 2 ? this.BisectSmall(p0, p1, p2, this.steps) : this.BisectSmall(p2, p1, p0, this.steps);
      }
      console.log(`Calculated ${this.triangles.length} triangles`);
   }

   BisectSmall(p0, p1, p2, steps) {
      if (!steps) return this.triangles.push(new Triangle(0, p0, p1, p2));

      let pP = p0.Interpolate(p1, this.GRS);
      this.BisectSmall(pP, p2, p0, steps-1);
      this.BisectLarge(p2, pP, p1, steps-1);
   }

   BisectLarge(p0, p1, p2, steps) {
      if (!steps) return this.triangles.push(new Triangle(1, p0, p1, p2));

      let pQ = p0.Interpolate(p1, this.GRB);
      let pR = p0.Interpolate(p2, this.GRB);
      this.BisectSmall(pQ, pR, p1, steps-1);
      this.BisectLarge(pR, pQ, p0, steps-1);
      this.BisectLarge(p2, pR, p1, steps-1);
   }
       
   Draw() {
      this.DrawBackground();
      for (let t of this.triangles) {
         this.DrawTriangle(t);
      }
   }

   DrawTriangle(t) {
      this.ctx.fillStyle = t.type ? this.color1 : this.color2;
      this.ctx.strokeStyle = "#000";
      this.ctx.lineWidth = 1;
      this.BeginPath().MoveTo(t.p0).LineTo(t.p1).LineTo(t.p2).ClosePath().Fill()
      this.BeginPath().MoveTo(t.p0).LineTo(t.p1).LineTo(t.p2).Stroke();
   }

   DrawBackground() {
      this.ctx.fillStyle = "#EEE";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

class Triangle {
   constructor (type, p0, p1, p2) {
      this.type = type;
      this.p0 = p0;
      this.p1 = p1;
      this.p2 = p2;
   }
}


$(function() {
   let p = new PageHandler("#canvas", {});
});

