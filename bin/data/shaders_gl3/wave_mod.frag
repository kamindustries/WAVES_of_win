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


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


void main() {

	// vec2 coord = texCoordVarying * vec2(scale_factor);
	vec2 coord = texCoordVarying;

  vec4 col = texture(tex0, coord);

  // -1 - 1
  col.rgb = (col.rgb - vec3(0.5)) * vec3(2.);

    // float mess_it_up = 1. + abs((sin(frame_num * .005)+0.001)*0.004);
    // float mess_it_up = 1. + abs((sin(frame_num * .004)+0.001)*0.006);
    float mess_it_up = 1. + abs((sin(frame_num * .005)+0.001)*0.0055);
    col.rgb = col.rgb * vec3(mess_it_up);

  // 0 - 1
  col.rgb = (col.rgb + vec3(1.)) * vec3(.5);

  fragColor = col;

}
