#version 150

in vec4 position;
in vec2 texcoord;

out vec2 vertexUV;


uniform mat4 modelViewProjectionMatrix;

void main() {

  vertexUV = texcoord + vec2(-0.0);
  gl_Position = modelViewProjectionMatrix * position;
    
//  vertColor = color;
//  vertTexCoord = texMatrix * vec4(texCoord, 1.0, 1.0);
}