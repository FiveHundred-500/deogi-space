'use strict';
// Orthographic spheres seen from z=0. All planets share the game's orbital plane.
// Obliquity: NASA Planetary Fact Sheet. Pole azimuths/texture meridians are fixed
// illustrative orientations, not date-dependent ephemerides. See in-app credits.
const OrbitalView={
 config:{
  mercury:{tilt:.034,map:'mercury',azimuth:.3},venus:{tilt:177.4,map:'venus_atmosphere',azimuth:1.1},
  earth:{tilt:23.4,map:'earth_daymap',azimuth:1.4},mars:{tilt:25.2,map:'mars',azimuth:.8},
  jupiter:{tilt:3.1,map:'jupiter',azimuth:.6},saturn:{tilt:26.7,map:'saturn',azimuth:1.2},
  uranus:{tilt:97.8,map:'uranus',azimuth:.5},neptune:{tilt:28.3,map:'neptune',azimuth:1.8}
 },
 maps:new Map(),cache:new Map(),views:new Map(),
 dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];},
 basis(id){const c=this.config[id],t=c.tilt*Math.PI/180,a=c.azimuth;return {pole:[Math.sin(t)*Math.cos(a),Math.sin(t)*Math.sin(a),Math.cos(t)],east:[-Math.sin(a),Math.cos(a),0],meridian:[-Math.cos(t)*Math.cos(a),-Math.cos(t)*Math.sin(a),Math.sin(t)]};},
 camera(p,observer=ship){const a=Math.atan2(observer.y-p.y,observer.x-p.x);return {angle:a,view:[Math.cos(a),Math.sin(a),0],right:[Math.sin(a),-Math.cos(a),0]};},
 texture(id){if(!this.maps.has(id)){const item={pixels:null,failed:false},img=new Image();this.maps.set(id,item);img.onload=()=>{const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,c.width,c.height);item.pixels=ctx.getImageData(0,0,c.width,c.height).data;item.width=c.width;item.height=c.height;this.cache.delete(id);};img.onerror=()=>{item.failed=true;};img.src='assets/maps/2k_'+this.config[id].map+'.jpg';}return this.maps.get(id);},
 disc(p,camera,diameter){const map=this.texture(p.id);if(!map.pixels)return null;const n=diameter>180?320:diameter>65?160:64,angle=Math.round(camera.angle*180/Math.PI)*Math.PI/180,key=n+':'+angle;const cached=this.cache.get(p.id);if(cached?.key===key)return cached.canvas;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=n;const ctx=canvas.getContext('2d'),out=ctx.createImageData(n,n),basis=this.basis(p.id),v=[Math.cos(angle),Math.sin(angle),0],right=[v[1],-v[0],0],sunDist=Math.hypot(p.x,p.y),light=[-p.x/sunDist,-p.y/sunDist,0];
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const sx=(x+.5)*2/n-1,sy=1-(y+.5)*2/n,r2=sx*sx+sy*sy;if(r2>1)continue;const z=Math.sqrt(1-r2),normal=[right[0]*sx+v[0]*z,right[1]*sx+v[1]*z,sy];const lat=Math.asin(Math.max(-1,Math.min(1,this.dot(normal,basis.pole)))),lon=Math.atan2(this.dot(normal,basis.meridian),this.dot(normal,basis.east));const u=((.5-lon/(Math.PI*2))%1+1)%1,tx=Math.min(map.width-1,Math.floor(u*map.width)),ty=Math.min(map.height-1,Math.floor((.5-lat/Math.PI)*map.height)),src=(ty*map.width+tx)*4,dst=(y*n+x)*4;
   // Small ambient term keeps the unlit hemisphere discernible in this learning model.
   const shade=.25+.75*Math.sqrt(Math.max(0,this.dot(normal,light)));out.data[dst]=map.pixels[src]*shade;out.data[dst+1]=map.pixels[src+1]*shade;out.data[dst+2]=map.pixels[src+2]*shade;out.data[dst+3]=Math.round(Math.min(1,(1-r2)*n*.5)*255);
  }ctx.putImageData(out,0,0);this.cache.set(p.id,{key,canvas});return canvas;
 },
 rings(ctx,p,camera,x,y,radius,front){if(!RingVisual.has(p.id))return;const b=this.basis(p.id),saturn=p.id==='saturn',count=saturn?44:1;ctx.save();ctx.lineJoin='round';
  for(let k=0;k<count;k++){const rr=saturn?1.24+k*.025:RingVisual.config[p.id].outer;if(saturn&&rr>1.94&&rr<2.03)continue;ctx.strokeStyle=saturn?(rr<1.5?'#9d938066':rr<1.94?'#d5c29ca6':'#bbab8c8c'):RingVisual.config[p.id].color;ctx.globalAlpha=saturn?1:.21;ctx.lineWidth=saturn?Math.max(.55,radius*.026):Math.max(.65,radius*.007);ctx.beginPath();let pen=false;
   if(saturn){const phase=Math.atan2(this.dot(b.meridian,camera.view),this.dot(b.east,camera.view)),start=phase-Math.PI/2+(front?0:Math.PI);ctx.fillStyle=ctx.strokeStyle;for(let side=0;side<2;side++)for(let i=0;i<=120;i++){const a=start+(side?120-i:i)*Math.PI/120,r=rr+(side?-.002:.027),world=b.east.map((v,j)=>(v*Math.cos(a)+b.meridian[j]*Math.sin(a))*r),px=x+this.dot(world,camera.right)*radius,py=y-world[2]*radius;side===0&&i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);}ctx.closePath();ctx.fill();continue;}
   for(let i=0;i<=240;i++){const a=i/240*Math.PI*2,c=Math.cos(a),s=Math.sin(a),world=b.east.map((v,j)=>(v*c+b.meridian[j]*s)*rr),depth=this.dot(world,camera.view);if((depth>=0)!==front){pen=false;continue;}const px=x+this.dot(world,camera.right)*radius,py=y-world[2]*radius;pen?ctx.lineTo(px,py):ctx.moveTo(px,py);pen=true;}ctx.stroke();
  }ctx.restore();
 },
 paint(ctx,p,x,y,diameter){if(diameter<7){ctx.fillStyle=p.color||'#8397aa';ctx.beginPath();ctx.arc(x,y,diameter/2,0,Math.PI*2);ctx.fill();return;}const camera=this.camera(p),n=diameter>180?320:diameter>65?160:64,pad=RingVisual.has(p.id)?2.4:1.04,key=n+':'+Math.round(camera.angle*180/Math.PI);let cached=this.views.get(p.id);if(!cached||cached.key!==key){const canvas=document.createElement('canvas');canvas.width=canvas.height=Math.ceil(n*pad);const c=canvas.getContext('2d'),mid=canvas.width/2,radius=n/2;this.rings(c,p,camera,mid,mid,radius,false);const disc=this.disc(p,camera,n);if(disc)c.drawImage(disc,mid-radius,mid-radius,n,n);else{c.fillStyle=p.color||'#8397aa';c.beginPath();c.arc(mid,mid,radius,0,Math.PI*2);c.fill();}this.rings(c,p,camera,mid,mid,radius,true);cached={key,canvas};if(disc)this.views.set(p.id,cached);}const size=diameter*cached.canvas.width/n;ctx.drawImage(cached.canvas,x-size/2,y-size/2,size,size);}
};
