#version 150

// internal variables
uniform sampler2DRect tex0;
uniform vec4 globalColor;

in vec2 texCoordVarying;
out vec4 fragColor;

uniform vec2 mouse;
uniform float scale_factor;
uniform int pos;

///////////////////////////////////////////////////////////////////////
// F U N C T I O N S
///////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////ra//////////////////////////
///////////////////////////////////////////////////////////////////////


void main() {

  // float scale = 5.68;
  float scale = scale_factor;
  // float scale = 5.7;
  // float scale = 1.;
  // float scale = 5.68*mouse.y/1080.;
  // float slide = 1024.;
  float slide = 8192./(scale*2.);
  // vec2 offset = vec2(1024.,1600.);
  // vec2 offset = vec2(-1440./scale,0.);
  vec2 offset = vec2(-1920./2.,-396);
  float follow_scale = 3.3/scale;
  // if (scale < 1.) follow_scale = pow((1./scale),3.3/scale);
  offset.x += (mouse.x-(1920./2.)) * follow_scale;
  offset.y += (mouse.y-(1080./2.)) * (follow_scale*2.);
  vec2 center = vec2((1920.*2.05)+(4.*(scale)),(1080.*2.05)+(1.*(scale*scale)));
  // vec2 coord = texCoordVarying * vec2(scale);
  vec2 coord = vec2(0.,0.);
  if (pos == 0) coord = ((texCoordVarying + offset) * vec2(scale))+center;
  if (pos == 1) coord = ((vec2(texCoordVarying.s-slide, texCoordVarying.t) + offset) * vec2(scale))+center;
  if (pos == 2) coord = ((vec2(texCoordVarying.s, texCoordVarying.t - slide ) + offset) * vec2(scale))+center;
  if (pos == 3) coord = ((vec2(texCoordVarying.s - slide, texCoordVarying.t - slide) + offset) * vec2(scale))+center;

  vec4 col = texture(tex0, coord);

  // red helper lines
  // float red_border = 1.;
  // if (pos <= 1){
  //   if (coord.s < red_border || coord.s > 4096.-red_border ||
  //       coord.t < red_border || coord.t > 4096.-red_border){
  //       // col.rgb = vec3(1.);
  //       col.r = 1.;
  //   }
  // }
  // else {
  //   if (coord.s < red_border || coord.s > 4096.-red_border ||
  //       coord.t < red_border || coord.t > 2048.-red_border){
  //       // col.rgb = vec3(1.);
  //       col.r = 1.;
  //   }
  // }


  // secure outside borders
if (pos < 2) {
  if (coord.s < 0. || coord.s > 4096. ||
      coord.t < 0. || coord.t > 4096.){
      col.r = 0.;
      col.a = 0.;
  }
} else{ 
    if (coord.s < 0. || coord.s > 4096. ||
      coord.t < 0. || coord.t > 2048.){
      col.r = 0.;
      col.a = 0.;
    }
  }


  fragColor = col;

}
