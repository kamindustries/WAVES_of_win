#version 150

in vec4 position;
in vec2 texcoord;

out vec2 texCoordVarying;


uniform mat4 modelViewProjectionMatrix;

void main() {

  texCoordVarying = texcoord;
  gl_Position = modelViewProjectionMatrix * position;
    
//  vertColor = color;
//  vertTexCoord = texMatrix * vec4(texCoord, 1.0, 1.0);
}