#version 150

// internal variables
uniform sampler2DRect tex0;
uniform vec4 globalColor;

in vec2 texCoordVarying;
out vec4 fragColor;

uniform float scale_factor;

///////////////////////////////////////////////////////////////////////
// F U N C T I O N S
///////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


void main() {

	// vec2 coord = texCoordVarying * vec2(scale_factor);
	vec2 coord = texCoordVarying * vec2(4.);

  vec4 col = texture(tex0, coord);
  
  float c = col.r;
 // if (c < .5) col.rgb = vec3(0., 0., c * 2.);
 // else col.rgb = vec3((c-.5)*2., 0., 0.);
  

  // else if (col.r < 0.) col.g = 1.;
  // col.rgb = vec3(1.,0.,1.);

  // if (col.g > 0.0001){
  //   col.b = col.g;
  //   col.g = 0.;
  // }



  fragColor = col;

}
