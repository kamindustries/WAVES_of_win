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
const float xLength = 20.8266666;
const float dt = 0.001;
const float C = 1.;
const float spread = 1.;
const float simulate = 1.;
const vec2 center_pixel = vec2(0., 0.);

///////////////////////////////////////////////////////////////////////
// C O L O R   F U N C T I O N S
///////////////////////////////////////////////////////////////////////

// R G B  2  H S V
vec3 rgb2HSV(vec3 _col){
  vec3 hsv;
  float mini = 0.0;
  float maxi = 0.0;
  if (_col.r < _col.g) mini = _col.r;
    else mini = _col.g;
  if (_col.b < mini) mini = _col.b;
  if (_col.r > _col.g) maxi = _col.r;
    else maxi = _col.g;
  if (_col.b > maxi) maxi = _col.b;
  hsv.z = maxi; //VALUE
  float delta = maxi - mini; //delta
  if (maxi > 0.0) hsv.y = delta / maxi; //SATURATION
    else hsv.y = 0.0;
  if (_col.r >= maxi) hsv.x = (_col.g - _col.b) / delta;
  else if (_col.g >= maxi) hsv.x = 2.0 + (_col.b - _col.r)/delta;
  else hsv.x = 4.0 + (_col.r - _col.g) / delta;
  hsv.x *= 60.0;
  if (hsv.x < 0.0) hsv.x += 360.0;
  return hsv;
}

// H S V  2  R G B
vec3 hsv2RGB(vec3 _hsv){
  float hh, p, q, t, ff;
  int i;
  vec3 rgb;
  if(_hsv.y <= 0.0){
    rgb.r = _hsv.z;
    rgb.g = _hsv.z;
    rgb.b = _hsv.z;
    return rgb;
  }
  hh = _hsv.x;
  if(hh >= 360.) hh = (hh/360.);
  hh /= 60.0;
  i = int(hh);
  ff = hh - float(i);
  p = _hsv.z * (1.0 - _hsv.y);
  q = _hsv.z * (1.0 - (_hsv.y * ff));
  t = _hsv.z * (1.0 - (_hsv.y * (1.0 - ff)));

  if (i == 0){
      rgb.r = _hsv.z;
      rgb.g = t;
      rgb.b = p;
      return rgb;
    }
  else if (i == 1){
      rgb.r = q;
      rgb.g = _hsv.z;
      rgb.b = p;
      return rgb;
    }
  else if (i == 2){
      rgb.r = p;
      rgb.g = _hsv.z;
      rgb.b = t;
      return rgb;
    }
  else if (i == 3){
      rgb.r = p;
      rgb.g = q;
      rgb.b = _hsv.z;
      return rgb;
    }
  else if (i == 4){
      rgb.r = t;
      rgb.g = p;
      rgb.b = _hsv.z;
      return rgb;
    }
  else if (i == 5){
      rgb.r = _hsv.z;
      rgb.g = p;
      rgb.b = q;
      return rgb;
    }
  else {
      rgb.r = _hsv.z;
      rgb.g = p;
      rgb.b = q;
    return rgb;
  }

}

vec3 rgb2DEF(vec3 _col){
  mat3 XYZ; // Adobe RGB (1998)
  XYZ[0] = vec3(0.5767309, 0.1855540, 0.1881852);
  XYZ[1] = vec3(0.2973769, 0.6273491, 0.0752741);
  XYZ[2] = vec3(0.0270343, 0.0706872, 0.9911085); 
  mat3 DEF;
  DEF[0] = vec3(0.2053, 0.7125, 0.4670);
  DEF[1] = vec3(1.8537, -1.2797, -0.4429);
  DEF[2] = vec3(-0.3655, 1.0120, -0.6104);

  vec3 xyz = _col.rgb * XYZ;
  vec3 def = xyz * DEF;
  return def;
}

vec3 def2RGB(vec3 _def){
  mat3 XYZ; 
  XYZ[0] = vec3(0.6712, 0.4955, 0.1540);
  XYZ[1] = vec3(0.7061, 0.0248, 0.5223);
  XYZ[2] = vec3(0.7689, -0.2556, -0.8645); 
  mat3 RGB; // Adobe RGB (1998)
  RGB[0] = vec3(2.0413690, -0.5649464, -0.3446944);
  RGB[1] = vec3(-0.9692660, 1.8760108, 0.0415560);
  RGB[2] = vec3(0.0134474, -0.1183897, 1.0154096);

  vec3 xyz = _def * XYZ;
  vec3 rgb = xyz * RGB;
  return rgb;
}
float getB(vec3 _def){
    float b = sqrt((_def.r*_def.r) + (_def.g*_def.g) + (_def.b*_def.b));
    // b *= .72; //normalize...not sure why i have to do this
    return b;
}
float getC(vec3 _def){
    vec3 def_D = vec3(1.,0.,0.);
    float C = atan(length(cross(_def,def_D)), dot(_def,def_D));
    return C;
}
float getH(vec3 _def){
    vec3 def_E_axis = vec3(0.,1.,0.);
    float H = atan(_def.z, _def.y) - atan(def_E_axis.z, def_E_axis.y) ;
    return H;
}
vec3 rgb2BCH(vec3 _col){
  vec3 DEF = rgb2DEF(_col);
  float B = getB(DEF);
  float C = getC(DEF);
  float H = getH(DEF);
  return vec3(B,C,H);
}
vec3 bch2RGB(vec3 _bch){
  vec3 def;
  def.x = _bch.x * cos(_bch.y);
  def.y = _bch.x * sin(_bch.y) * cos(_bch.z);
  def.z = _bch.x * sin(_bch.y) * sin(_bch.z);
  vec3 rgb = def2RGB(def);
  return rgb;
}
// vec3 bch2RGB_altAxis(vec3 _bch){
//   vec3 def;
//   def.x = _bch.x * cos(_bch.y);
//   def.y = _bch.x * sin(_bch.y) * cos(_bch.z);
//   def.z = _bch.x * sin(_bch.y) * sin(_bch.z+(ttime*3.14159));
//   vec3 rgb = def2RGB(def);
//   return rgb;
// }

// B R I G H T N E S S
vec3 Brightness(vec3 _col, float _f){
  vec3 BCH = rgb2BCH(_col);
  vec3 b3 = vec3(BCH.x,BCH.x,BCH.x);
  float x = pow((_f + 1.)/2.,2.);
  x = _f;
  _col = _col + (b3 * x)/3.;
  return _col;
}

// C O N T R A S T  
vec3 Contrast(vec3 _col, float _f){
  vec3 def = rgb2DEF(_col);
  float B = getB(def);
  float C = getC(def);
  float H = getH(def);
  
  B = B * pow(B*(1.-C), _f);

  def.x = B * cos(C);
  def.y = B * sin(C) * cos(H);
  def.z = B * sin(C) * sin(H);

  _col.rgb = def2RGB(def);
  return _col;
}

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
  // if (pos > 1) dy = (xLength*2.)/img_size;
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

  Cd_img = rgb2BCH(Cd_img);
  if (frame_num % 200 == 0){
    if (Cd_img.r > 0.5) {
      height_old.rgb = img_01.rgb * vec3(0.1);
      height.rgb = img_01.rgb * vec3(0.1);
    }
  }

  // add back based on old school brightness
  // if (frame_num % 600 == 0){
  //   if (b > .01) {
  //     height_old.rgb = Cd_img;
  //     height.rgb = Cd_img;
  //   }
  // }

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

  // try to manually correct the lower left triangle
  // vec2 coord_norm = coord / vec2(img_size*1.);
  // if (coord_norm.x + (-1.*coord_norm.y) < .0) {
  //   height_old.rgb -= .0005;
  //   height.rgb -= .0005;
  // }

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