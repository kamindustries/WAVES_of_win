#version 150

// internal variables
uniform sampler2DRect tex0;
uniform vec4 globalColor;

in vec2 texCoordVarying;
out vec4 fragColor;

uniform float scale_factor;
uniform int pos;

///////////////////////////////////////////////////////////////////////
// F U N C T I O N S
///////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////ra//////////////////////////
///////////////////////////////////////////////////////////////////////


void main() {

  float scale = 2.;
  // float slide = 1024.;
  float slide = 8192./(scale*2.);
  vec2 offset = vec2(1024.,1600.);
	// vec2 coord = texCoordVarying * vec2(scale);
  vec2 coord = vec2(0.,0.);
  if (pos == 0) coord = (texCoordVarying + offset) * vec2(scale);
  if (pos == 1) coord = (vec2(texCoordVarying.s-slide, texCoordVarying.t) + offset) * vec2(scale);
  if (pos == 2) coord = (vec2(texCoordVarying.s, texCoordVarying.t - slide ) + offset) * vec2(scale);
  if (pos == 3) coord = (vec2(texCoordVarying.s - slide, texCoordVarying.t - slide) + offset) * vec2(scale);

  vec4 col = texture(tex0, coord);
  
  if (coord.s < 0. || coord.s > 4096. ||
      coord.t < 0. || coord.t > 4096.){
      col.r = 1.;
      col.a = 0.;
  }


  fragColor = col;

}
