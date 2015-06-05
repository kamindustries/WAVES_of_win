#version 150

// internal variables
uniform sampler2DRect tex0;
uniform vec4 globalColor;

in vec2 vertexUV;
out vec4 fragColor;

// my variables
uniform sampler2DRect height_old_tex;
uniform sampler2DRect img_01_tex;
uniform int frame_num;
uniform vec2 mouse;
uniform float img_size;

const float dt = 0.001;
const float C = 1.;
const float spread = .5;

const float simulate = 1.;

///////////////////////////////////////////////////////////////////////
// F U N C T I O N S
///////////////////////////////////////////////////////////////////////

float mod(const float a, const float b) {
  // emulate integer mod operations in a float-only environment
  return floor(fract(a/b) * b);
}

///////////////////////////////////////////////////////////////////////
// WAVE FUNCTIONS
///////////////////////////////////////////////////////////////////////

// Diffusion for wave equation
vec3 DiffusionWave(vec3 _col){

  // vec4 laplacian = vec4(0.);
  // for (int i = 0; i < 20; i++){
    float it = spread;
     // float it = 1. + ((mouse.y-(img_size*0.5))* 0.01);
   // float it = .7;
  

//    vec2 coord_d = (floor(gl_FragCoord.st*1000.)+0.5)/1000.;
    // vec2 coord_d = vertexUV;
    vec2 coord_d = vec2((vertexUV.x), (vertexUV.y));
    // vec2 coord_d = vec2(round(vertexUV.s), round(vertexUV.t));
//    vec2 coord_d = gl_FragCoord.st/img_size;

    vec2 n0 = vec2(coord_d.s, coord_d.t);
    vec2 n1 = vec2(coord_d.s + it, coord_d.t);
    vec2 n2 = vec2(coord_d.s - it, coord_d.t);
    vec2 n3 = vec2(coord_d.s, coord_d.t + it);
    vec2 n4 = vec2(coord_d.s, coord_d.t - it);

    vec4 laplacian =  -4. * texture(tex0, n0) +
                      texture(tex0, n1) +
                      texture(tex0, n2) +
                      texture(tex0, n3) +
                      texture(tex0, n4);

  // }
  return laplacian.rgb;
}


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


void main() {
  // float xLength = 0.1*(mouse.x-(img_size*0.5));
  float xLength = img_size/1000.;
  float dx = xLength/img_size;
  float box_size = 20.;

  vec4 height = vec4(1.);
  vec4 height_old = vec4(1.);
  vec4 img_01 = vec4(1.);


  vec2 coord = vec2((vertexUV.s), (vertexUV.t));

  height = texture(tex0, coord);
  height_old = texture(height_old_tex, coord);
  img_01 = texture(img_01_tex, coord);

  vec3 Cd_img = img_01.rgb;
  float b = (Cd_img.r+Cd_img.g+Cd_img.b)/3.;

  if (frame_num % 100 == 0){
    if (b > .1) height.rgb = Cd_img;
  }
 //  float bL = (img_size*0.5)-box_size;
 //  float bR = (img_size*0.5)+box_size;
 //  if (frame_num % 100 == 0){
 //    if (vertexUV.s >= bL && vertexUV.s <= bR &&
 //        vertexUV.t >= bL && vertexUV.t <= bR){
 //      height.rgb = vec3(1.);
 //    }
 // }



  ///////////////////////////////////////////////////////////////////////
  // W A V E
  ///////////////////////////////////////////////////////////////////////

  float border_threshold = 1.;
  if (gl_FragCoord.x < 1. || gl_FragCoord.x > img_size-border_threshold ||
      gl_FragCoord.y < 1. || gl_FragCoord.y > img_size-border_threshold) {
    height.rgb = vec3(0.,0.,0.);
    height_old.rgb = vec3(0.,0.,0.);
  }

//  if (simulate>=0.0001){
    height.rgb = (height.rgb - vec3(0.5)) * vec3(2.);
    height_old.rgb = (height_old.rgb - vec3(0.5)) * vec3(2.);

   vec3 laplacian = DiffusionWave(height.rgb);
   height.rgb = (height.rgb * vec3(2.)) + laplacian * ((dt*dt)*C)/(dx*dx);
   height.rgb = height.rgb - height_old.rgb;
  
    // if (height.r < 0.) height.b = 1.;
    height.rgb = (height.rgb + vec3(1.)) * vec3(.5);
    height_old.rgb = (height_old.rgb + vec3(1.)) * vec3(.5);
//  }
  
//  height.r = 1.;

  // fragColor.rgb = height_old.rgb;
  fragColor.rgb = height.rgb;
  fragColor.w = 1.;
//  fragColor = vec4(0.,1.,0.,1.);
//  fragColor.g = 1.;

}