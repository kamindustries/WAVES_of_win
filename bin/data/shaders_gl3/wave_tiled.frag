#version 150

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
const float xLength = 16.2;
const float yLength = 16.2;
const float dt = 0.001;
const float C = 1.;
const float spread = 1.;
const float simulate = 1.;

///////////////////////////////////////////////////////////////////////
// F U N C T I O N S
///////////////////////////////////////////////////////////////////////

// float mod(const float a, const float b) {
//   // emulate integer mod operations in a float-only environment
//   return floor(fract(a/b) * b);
// }

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
    vec2 coord_d = vertexUV;
    // vec2 coord_d = vec2((vertexUV.x), (vertexUV.y)) + vec2(0.5);
    // vec2 coord_d = vec2(round(vertexUV.s), round(vertexUV.t));
//    vec2 coord_d = gl_FragCoord.st/img_size;

    vec2 n0 = vec2(coord_d.s, coord_d.t);
    vec2 n1 = vec2(coord_d.s + it, coord_d.t);
    vec2 n2 = vec2(coord_d.s - it, coord_d.t);
    vec2 n3 = vec2(coord_d.s, coord_d.t + it);
    vec2 n4 = vec2(coord_d.s, coord_d.t - it);
    vec2 n5 = vec2(coord_d.s + it, coord_d.t + it);
    vec2 n6 = vec2(coord_d.s + it, coord_d.t - it);
    vec2 n7 = vec2(coord_d.s - it, coord_d.t + it);
    vec2 n8 = vec2(coord_d.s - it, coord_d.t - it);

    vec4 laplacian =  -8. * texture(tex0, n0) +
                      texture(tex0, n1) +
                      texture(tex0, n2) +
                      texture(tex0, n3) +
                      texture(tex0, n4) +
                      texture(tex0, n5) +
                      texture(tex0, n6) +
                      texture(tex0, n7) +
                      texture(tex0, n8);

  // }
  return laplacian.rgb;
}

// diffusion for tile 0
vec3 DiffusionWaveT0(vec3 _col){

  float it = spread;
  
  vec4 sample[9] = vec4[](vec4(0.), vec4(0.), vec4(0.), vec4(0.), 
                    vec4(0.), vec4(0.), vec4(0.), vec4(0.), vec4(0.));

  vec2 coord_d = vec2((vertexUV.x), (vertexUV.y)) + vec2(0.0);

  vec2 n0 = vec2(coord_d.s, coord_d.t);
  vec2 n1 = vec2(coord_d.s + it, coord_d.t);
  vec2 n2 = vec2(coord_d.s - it, coord_d.t);
  vec2 n3 = vec2(coord_d.s, coord_d.t + it);
  vec2 n4 = vec2(coord_d.s, coord_d.t - it);
  vec2 n5 = vec2(coord_d.s + it, coord_d.t + it);
  vec2 n6 = vec2(coord_d.s + it, coord_d.t - it);
  vec2 n7 = vec2(coord_d.s - it, coord_d.t + it);
  vec2 n8 = vec2(coord_d.s - it, coord_d.t - it);

  sample[0] = -8. * texture(tex0, n0);
  
  if (n1.x > img_size) sample[1] = texture(neighbor_x_tex, vec2(n1.x-img_size,n1.y));
  else sample[1] = texture(tex0, n1);
  
  sample[2] = texture(tex0, n2);
  
  if (n3.y > img_size) sample[3] = texture(neighbor_y_tex, vec2(n3.x,n3.y-img_size));
  else sample[3] = texture(tex0, n3);
  
  sample[4] = texture(tex0, n4);
  
  if (n5.x > img_size) sample[5] = texture(neighbor_x_tex, vec2(n5.x-img_size,n5.y));
  else if (n5.y > img_size) sample[5] = texture(neighbor_y_tex, vec2(n5.x,n5.y-img_size));
  else sample[5] = texture(tex0, n5);
  
  if (n6.x > img_size) sample[6] = texture(neighbor_x_tex, vec2(n6.x-img_size,n6.y));
  else sample[6] = texture(tex0, n6);
  
  if (n7.y > img_size) sample[7] = texture(neighbor_y_tex, vec2(n7.x,n7.y-img_size));
  else sample[7] = texture(tex0, n7);
  
  sample[8] = texture(tex0, n8);


  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+
                  sample[4]+sample[5]+sample[6]+sample[7]+sample[8];

  return laplacian.rgb;
}


// diffusion for tile 1
vec3 DiffusionWaveT1(vec3 _col){

  float it = spread;
  
  vec4 sample[9] = vec4[](vec4(0.), vec4(0.), vec4(0.), vec4(0.), 
                    vec4(0.), vec4(0.), vec4(0.), vec4(0.), vec4(0.));

  vec2 coord_d = vec2((vertexUV.x), (vertexUV.y)) + vec2(0.0);

  vec2 n0 = vec2(coord_d.s, coord_d.t);
  vec2 n1 = vec2(coord_d.s + it, coord_d.t);
  vec2 n2 = vec2(coord_d.s - it, coord_d.t);
  vec2 n3 = vec2(coord_d.s, coord_d.t + it);
  vec2 n4 = vec2(coord_d.s, coord_d.t - it);
  vec2 n5 = vec2(coord_d.s + it, coord_d.t + it);
  vec2 n6 = vec2(coord_d.s + it, coord_d.t - it);
  vec2 n7 = vec2(coord_d.s - it, coord_d.t + it);
  vec2 n8 = vec2(coord_d.s - it, coord_d.t - it);

  sample[0] = -8. * texture(tex0, n0);
  sample[1] = texture(tex0, n1);

  if (n2.x < 0.) sample[2] = texture(neighbor_x_tex, vec2(n2.x+img_size,n2.y));
  else sample[2] = texture(tex0, n2);

  if (n3.y > img_size) sample[3] = texture(neighbor_y_tex, vec2(n3.x,n3.y-img_size));
  else sample[3] = texture(tex0, n3);

  sample[4] = texture(tex0, n4);

  if (n5.y > img_size) sample[5] = texture(neighbor_y_tex, vec2(n5.x,n5.y-img_size));
  else sample[5] = texture(tex0, n5);

  sample[6] = texture(tex0, n6);

  if (n7.x < 0.) sample[7] = texture(neighbor_x_tex, vec2(n7.x+img_size,n7.y));
  else if (n7.y > img_size) sample[7] = texture(neighbor_y_tex, vec2(n7.x,n7.y-img_size));
  else sample[7] = texture(tex0, n7);

  if (n8.x < 0.) sample[8] = texture(neighbor_x_tex, vec2(n8.x+img_size,n8.y));
  else sample[8] = texture(tex0, n8);


  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+
                  sample[4]+sample[5]+sample[6]+sample[7]+sample[8];

  return laplacian.rgb;
}
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// diffusion for tile 2
vec3 DiffusionWaveT2(vec3 _col){

  float it = spread;
  
  vec4 sample[9] = vec4[](vec4(0.), vec4(0.), vec4(0.), vec4(0.), 
                    vec4(0.), vec4(0.), vec4(0.), vec4(0.), vec4(0.));

  vec2 coord_d = vec2((vertexUV.x), (vertexUV.y)) + vec2(0.0);

  vec2 n0 = vec2(coord_d.s, coord_d.t);
  vec2 n1 = vec2(coord_d.s + it, coord_d.t);
  vec2 n2 = vec2(coord_d.s - it, coord_d.t);
  vec2 n3 = vec2(coord_d.s, coord_d.t + it);
  vec2 n4 = vec2(coord_d.s, coord_d.t - it);
  vec2 n5 = vec2(coord_d.s + it, coord_d.t + it);
  vec2 n6 = vec2(coord_d.s + it, coord_d.t - it);
  vec2 n7 = vec2(coord_d.s - it, coord_d.t + it);
  vec2 n8 = vec2(coord_d.s - it, coord_d.t - it);

  sample[0] = -8. * texture(tex0, n0);
  if (n1.x > img_size) sample[1] = texture(neighbor_x_tex, vec2(n1.x-img_size, n1.y));
  else sample[1] = texture(tex0, n1);

  sample[2] = texture(tex0, n2);

  sample[3] = texture(tex0, n3);

  if (n4.y < 0.) sample[4] = texture(neighbor_y_tex, vec2(n4.x, n4.y+img_size));
  else sample[4] = texture(tex0, n4);

  if (n5.x > img_size) sample[5] = texture(neighbor_x_tex, vec2(n5.x-img_size,n5.y));
  else sample[5] = texture(tex0, n5);

  if (n6.x > img_size) sample[6] = texture(neighbor_x_tex, vec2(n6.x-img_size, n6.y));
  else if (n6.y < 0.) sample[6] = texture(neighbor_y_tex, vec2(n6.x, n6.y+img_size));
  else sample[6] = texture(tex0, n6);

  sample[7] = texture(tex0, n7);

  if (n8.y < 0.) sample[8] = texture(neighbor_y_tex, vec2(n8.x, n8.y+img_size));
  else sample[8] = texture(tex0, n8);


  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+
                  sample[4]+sample[5]+sample[6]+sample[7]+sample[8];

  return laplacian.rgb;
}
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// diffusion for tile 3
vec3 DiffusionWaveT3(vec3 _col){

  float it = spread;
  
  vec4 sample[9] = vec4[](vec4(0.), vec4(0.), vec4(0.), vec4(0.), 
                    vec4(0.), vec4(0.), vec4(0.), vec4(0.), vec4(0.));

  vec2 coord_d = vec2((vertexUV.x), (vertexUV.y)) + vec2(0.0);

  vec2 n0 = vec2(coord_d.s, coord_d.t);
  vec2 n1 = vec2(coord_d.s + it, coord_d.t);
  vec2 n2 = vec2(coord_d.s - it, coord_d.t);
  vec2 n3 = vec2(coord_d.s, coord_d.t + it);
  vec2 n4 = vec2(coord_d.s, coord_d.t - it);
  vec2 n5 = vec2(coord_d.s + it, coord_d.t + it);
  vec2 n6 = vec2(coord_d.s + it, coord_d.t - it);
  vec2 n7 = vec2(coord_d.s - it, coord_d.t + it);
  vec2 n8 = vec2(coord_d.s - it, coord_d.t - it);

  sample[0] = -8. * texture(tex0, n0);
  sample[1] = texture(tex0, n1);

  if (n2.x < 0.) sample[2] = texture(neighbor_x_tex, vec2(n2.x+img_size,n2.y));
  else sample[2] = texture(tex0, n2);

  sample[3] = texture(tex0, n3);

  if (n4.y < 0.) sample[4] = texture(neighbor_y_tex, vec2(n4.x,n4.y+img_size));
  else sample[4] = texture(tex0, n4);

  sample[5] = texture(tex0, n5);

  if (n6.y < 0.) sample[6] = texture(neighbor_y_tex, vec2(n6.x,n6.y+img_size));
  else sample[6] = texture(tex0, n6);

  if (n7.x < 0.) sample[7] = texture(neighbor_x_tex, vec2(n7.x+img_size,n7.y));
  else sample[7] = texture(tex0, n7);

  if (n8.x < 0.) sample[8] = texture(neighbor_x_tex, vec2(n8.x+img_size,n8.y));
  else if (n8.y < 0.) sample[8] = texture(neighbor_y_tex, vec2(n8.x,n8.y+img_size));
  else sample[8] = texture(tex0, n8);


  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+
                  sample[4]+sample[5]+sample[6]+sample[7]+sample[8];

  return laplacian.rgb;
}
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


void main() {
  float dx = xLength/img_size;
  float dy = xLength/img_size;
  if (pos > 1) dy = yLength/img_size;
  float box_size = 1000.;

  vec4 height = vec4(1.);
  vec4 height_old = vec4(1.);
  vec4 img_01 = vec4(1.);


  vec2 coord = vec2((vertexUV.s), (vertexUV.t)) + vec2(0.0);

  height = texture(tex0, coord);
  height_old = texture(height_old_tex, coord);
  img_01 = texture(img_01_tex, coord);

  vec3 Cd_img = img_01.rgb;
  float b = (Cd_img.r+Cd_img.g+Cd_img.b)/3.;
  // if (frame_num % 1 == 0){
    // if (frame_num % 1 == 0 && (pos == 1 || pos == 2 || pos == 3)){
    if (pos >= 0){
      // height.rgb = Cd_img;
      // if (b > .1) height.rgb = Cd_img;
      if (b > .4) {
        height_old.rgb = Cd_img;
        height.rgb = Cd_img;
      }
      // if (b > .5) height.rgb += (Cd_img * vec3(0.02));
    }
  // }

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

  float border_threshold = 5.;
  // original
  // if (gl_FragCoord.x < border_threshold || gl_FragCoord.x > img_size-border_threshold ||
  //     gl_FragCoord.y < border_threshold || gl_FragCoord.y > img_size-border_threshold) {
  //   height.rgb = vec3(-1.);
  //   height_old.rgb = vec3(-1.);
  // }
  if (pos == 0) {
    if (gl_FragCoord.x < border_threshold || gl_FragCoord.y < border_threshold) {
      height.rgb = vec3(-1.);
      height_old.rgb = vec3(-1.);
    }
  }
  else if (pos == 1) {
    if (gl_FragCoord.x > img_size-border_threshold || gl_FragCoord.y < border_threshold) {
      height.rgb = vec3(-1.);
      height_old.rgb = vec3(-1.);
    }
  }
//  if (simulate>=0.0001){
    height.rgb = (height.rgb - vec3(0.5)) * vec3(2.);
    height_old.rgb = (height_old.rgb - vec3(0.5)) * vec3(2.);


  // vec3 laplacian = DiffusionWave(height.rgb);
  vec3 laplacian = vec3(0.);
  if (pos == 0) laplacian = DiffusionWaveT0(height.rgb);
  else if (pos == 1) laplacian = DiffusionWaveT1(height.rgb);
  else if (pos == 2) laplacian = DiffusionWaveT2(height.rgb);
  else if (pos == 3) laplacian = DiffusionWaveT3(height.rgb);
  height.rgb = (height.rgb * vec3(2.)) + laplacian * ((dt*dt)*C)/(dx*dx);
  height.rgb = height.rgb - height_old.rgb;
  
  height.rgb = (height.rgb + vec3(1.)) * vec3(.5);
  height_old.rgb = (height_old.rgb + vec3(1.)) * vec3(.5);
//  }
  
 // height.r = 1.;

  // fragColor.rgb = height_old.rgb;
  fragColor.rgb = height.rgb;
  fragColor.w = 1.;
//  fragColor = vec4(0.,1.,0.,1.);
//  fragColor.g = 1.;

}