#version 150

// internal variables
uniform sampler2DRect tex0;
uniform vec4 globalColor;

in vec2 texCoordVarying;
out vec4 fragColor;

uniform float scale_factor;
uniform float frame_num;

///////////////////////////////////////////////////////////////////////
// F U N C T I O N S
///////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


void main() {

	// vec2 coord = texCoordVarying * vec2(scale_factor);
	vec2 coord = texCoordVarying;

  vec4 col = texture(tex0, coord);
  
  float mess_it_up = 1. + abs((sin(frame_num * .005)+0.001)*0.01);
  col.rgb = col.rgb * vec3(mess_it_up);

  fragColor = col;

}
