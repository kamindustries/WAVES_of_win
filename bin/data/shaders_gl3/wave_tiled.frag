#version 150

precision highp float;

// internal variables
uniform sampler2DRect tex0;
uniform vec4 globalColor;

in vec2 vertexUV;
out vec4 fragColor;

// my variables
uniform sampler2DRect height_old_tex;
uniform sampler2DRect img_01_tex;
uniform sampler2DRect neighbor_x_tex;
uniform sampler2DRect neighbor_y_tex;
uniform int frame_num;
uniform int pos;
uniform vec2 mouse;

const float img_size = 4096.;
const float xLength = 8.8266666;
const float dt = 0.001;
const float C = 1.;
const float spread = 1.;
const float simulate = 1.;
const vec2 center_pixel = vec2(0., 0.);

///////////////////////////////////////////////////////////////////////a
// F U N C T I O N S
///////////////////////////////////////////////////////////////////////

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

///////////////////////////////////////////////////////////////////////
// WAVE FUNCTIONS
///////////////////////////////////////////////////////////////////////

// Diffusion for wave equation
vec3 DiffusionWave(vec2 _coord){

  float it = spread;

  vec2 coord_d = _coord;

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

// diffusion for tile 0
vec3 DiffusionWaveT0(vec2 _coord){

  float it = spread;
  
  vec4 sample[9] = vec4[](vec4(0.), vec4(0.), vec4(0.), vec4(0.), 
                    vec4(0.), vec4(0.), vec4(0.), vec4(0.), vec4(0.));

  vec2 coord_d = _coord;
  // if (coord_d.x == coord_d.y){
    // float random = rand(coord_d) * .1;
    // coord_d.x += random;
  // }

  vec2 n0 = vec2(coord_d.s, coord_d.t);
  vec2 n1 = vec2(coord_d.s + it, coord_d.t);
  vec2 n2 = vec2(coord_d.s - it, coord_d.t);
  vec2 n3 = vec2(coord_d.s, coord_d.t + it);
  vec2 n4 = vec2(coord_d.s, coord_d.t - it);
  
  sample[0] = -4. * texture(tex0, n0);
  
  if (n1.x > img_size) sample[1] = texture(neighbor_x_tex, vec2(n1.x-img_size-1.,n1.y));
  else sample[1] = texture(tex0, n1);
  
  sample[2] = texture(tex0, n2);
  
  if (n3.y > img_size) sample[3] = texture(neighbor_y_tex, vec2(n3.x,n3.y-img_size));
  else sample[3] = texture(tex0, n3);
  
  sample[4] = texture(tex0, n4);

  // shift into -1 to 1 range, skipping first sample
  // for (int i = 1; i < 9; i++){
  //   sample[i].rgb = (sample[i].rgb - vec3(0.5)) * vec3(2.);
  // }

  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+sample[4];

  return laplacian.rgb;
}


// diffusion for tile 1
vec3 DiffusionWaveT1(vec2 _coord){

  float it = spread;
  
  vec4 sample[9] = vec4[](vec4(0.), vec4(0.), vec4(0.), vec4(0.), 
                    vec4(0.), vec4(0.), vec4(0.), vec4(0.), vec4(0.));

  vec2 coord_d = _coord;
  // if (coord_d.x == coord_d.y){
    // float random = rand(coord_d) * .1;
    // coord_d.x += random;
  // }

  vec2 n0 = vec2(coord_d.s, coord_d.t);
  vec2 n1 = vec2(coord_d.s + it, coord_d.t);
  vec2 n2 = vec2(coord_d.s - it, coord_d.t);
  vec2 n3 = vec2(coord_d.s, coord_d.t + it);
  vec2 n4 = vec2(coord_d.s, coord_d.t - it);
  
  sample[0] = -4. * texture(tex0, n0);
  sample[1] = texture(tex0, n1);

  if (n2.x < 0.) sample[2] = texture(neighbor_x_tex, vec2(n2.x+img_size+1.,n2.y));
  else sample[2] = texture(tex0, n2);

  if (n3.y > img_size) sample[3] = texture(neighbor_y_tex, vec2(n3.x,n3.y-img_size));
  else sample[3] = texture(tex0, n3);

  sample[4] = texture(tex0, n4);

  // shift into -1 to 1 range, skipping first sample
  // for (int i = 1; i < 9; i++){
  //   sample[i].rgb = (sample[i].rgb - vec3(0.5)) * vec3(2.);
  // }

  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+sample[4];

  return laplacian.rgb;
}
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// diffusion for tile 2
vec3 DiffusionWaveT2(vec2 _coord){

  float it = spread;
  
  vec4 sample[9] = vec4[](vec4(0.), vec4(0.), vec4(0.), vec4(0.), 
                    vec4(0.), vec4(0.), vec4(0.), vec4(0.), vec4(0.));

  vec2 coord_d = _coord;
  // if (coord_d.x == coord_d.y){
    // float random = rand(coord_d) * .1;
    // coord_d.x += random;
  // }

  vec2 n0 = vec2(coord_d.s, coord_d.t);
  vec2 n1 = vec2(coord_d.s + it, coord_d.t);
  vec2 n2 = vec2(coord_d.s - it, coord_d.t);
  vec2 n3 = vec2(coord_d.s, coord_d.t + it);
  vec2 n4 = vec2(coord_d.s, coord_d.t - it);
  
  sample[0] = -4. * texture(tex0, n0);
  
  if (n1.x > img_size) sample[1] = texture(neighbor_x_tex, vec2(n1.x-img_size-1., n1.y));
  else sample[1] = texture(tex0, n1);

  sample[2] = texture(tex0, n2);

  sample[3] = texture(tex0, n3);

  if (n4.y < 0.) sample[4] = texture(neighbor_y_tex, vec2(n4.x, n4.y+img_size));
  else sample[4] = texture(tex0, n4);

  // shift into -1 to 1 range, skipping first sample
  // for (int i = 1; i < 9; i++){
  //   sample[i].rgb = (sample[i].rgb - vec3(0.5)) * vec3(2.);
  // }

  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+sample[4];

  return laplacian.rgb;
}
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// diffusion for tile 3
vec3 DiffusionWaveT3(vec2 _coord){

  float it = spread;
  
  vec4 sample[9] = vec4[](vec4(0.), vec4(0.), vec4(0.), vec4(0.), 
                    vec4(0.), vec4(0.), vec4(0.), vec4(0.), vec4(0.));

  vec2 coord_d = _coord;
  // if (coord_d.x == coord_d.y){
    // float random = rand(coord_d) * .1;
    // coord_d.x += random;
  // }

  vec2 n0 = vec2(coord_d.s, coord_d.t);
  vec2 n1 = vec2(coord_d.s + it, coord_d.t);
  vec2 n2 = vec2(coord_d.s - it, coord_d.t);
  vec2 n3 = vec2(coord_d.s, coord_d.t + it);
  vec2 n4 = vec2(coord_d.s, coord_d.t - it);
  
  sample[0] = -4. * texture(tex0, n0);
  
  sample[1] = texture(tex0, n1);

  if (n2.x < 0.) sample[2] = texture(neighbor_x_tex, vec2(n2.x+img_size+1.,n2.y));
  else sample[2] = texture(tex0, n2);

  sample[3] = texture(tex0, n3);

  if (n4.y < 0.) sample[4] = texture(neighbor_y_tex, vec2(n4.x,n4.y+img_size));
  else sample[4] = texture(tex0, n4);

  // shift into -1 to 1 range, skipping first sample
  // for (int i = 1; i < 9; i++){
  //   sample[i].rgb = (sample[i].rgb - vec3(0.5)) * vec3(2.);
  // }


  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+sample[4];

  return laplacian.rgb;
}  
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


void main() {
  float dx = xLength/img_size;
  float dy = xLength/img_size;
  if (pos > 1) dy = (xLength*2.)/img_size;
  // dy = yLength/img_size;
  float box_size = 1000.;

  vec4 height = vec4(1.);
  vec4 height_old = vec4(1.);
  vec4 img_01 = vec4(1.);


  vec2 coord = vec2((vertexUV.s), (vertexUV.t)) + center_pixel;
  // if (coord.x == coord.y) {
  //   coord.x += 0.05;
  //   coord.y += 0.05;
  // }


  // vec2 coord = gl_FragCoord.st + vec2(0.);
  // if (coord.x == coord.y){
    // float random = rand(coord) * .1;
    // coord.x += random;
  // }

  height = texture(tex0, coord);
  height_old = texture(height_old_tex, coord);
  img_01 = texture(img_01_tex, coord);

  vec3 Cd_img = img_01.rgb;
  float b = (Cd_img.r+Cd_img.g+Cd_img.b)/3.;
  if (frame_num % 100 == 0){
    if (b > .05) {
      height_old.rgb = Cd_img;
      height.rgb = Cd_img;
    }
  }

  // if (frame_num % 100 == 0){
  //   if (mod(vertexUV.x, 100) < 10.){
  //     height.rgb += vec3(1.);
  //     height_old.rgb += 1.;
  //   }
  // }

  // if (frame_num < 10){
  //   height.rgb = vec3(1.);
  //   height_old.rgb = vec3(1.);
  // }

  // draw a box
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

  float border_threshold = 0.1;
  // original
  // if (gl_FragCoord.x < border_threshold || gl_FragCoord.x > img_size-border_threshold ||
  //     gl_FragCoord.y < border_threshold || gl_FragCoord.y > img_size-border_threshold) {
  //   height.rgb = vec3(-1.);
  //   height_old.rgb = vec3(-1.);
  // }
  if (pos == 0) {
    if (gl_FragCoord.x < border_threshold || gl_FragCoord.y < border_threshold) {
      height.rgb = vec3(.5);
      height_old.rgb = vec3(.5);
    }
  }
  else if (pos == 1) {
    if (gl_FragCoord.x > img_size-border_threshold || gl_FragCoord.y < border_threshold) {
      height.rgb = vec3(.5);
      height_old.rgb = vec3(.5);
    }
  }
  else if (pos == 2) {
    if (gl_FragCoord.x < border_threshold || gl_FragCoord.y > (img_size/2.)-border_threshold) {
      height.rgb = vec3(.5);
      height_old.rgb = vec3(.5);
    }
  }  
  else if (pos == 3) {
    if (gl_FragCoord.x > img_size-border_threshold || gl_FragCoord.y > (img_size/2.)-border_threshold) {
      height.rgb = vec3(.5);
      height_old.rgb = vec3(.5);
    }
  }


  // shift to -1 - 1
  height.rgb = (height.rgb - vec3(0.5)) * vec3(2.);
  height_old.rgb = (height_old.rgb - vec3(0.5)) * vec3(2.);

  // vec3 laplacian = DiffusionWave(coord);
  vec3 laplacian = vec3(0.);
  if (pos == 0) laplacian = DiffusionWaveT0(coord);
  else if (pos == 1) laplacian = DiffusionWaveT1(coord);
  else if (pos == 2) laplacian = DiffusionWaveT2(coord);
  else if (pos == 3) laplacian = DiffusionWaveT3(coord);

  height.rgb = (height.rgb * vec3(2.)) + laplacian * ((dt*dt)*C)/(dx*dy);
  height.rgb = height.rgb - height_old.rgb;
  
  // shift to 0 - 1
  height.rgb = (height.rgb + vec3(1.)) * vec3(.5);
  // height_old.rgb = (height_old.rgb + vec3(1.)) * vec3(.5);
  
 // height.r = 1.;



  // fragColor.rgb = height_old.rgb;
  fragColor.rgb = height.rgb;
  fragColor.w = 1.;
//  fragColor = vec4(0.,1.,0.,1.);
//  fragColor.g = 1.;

}