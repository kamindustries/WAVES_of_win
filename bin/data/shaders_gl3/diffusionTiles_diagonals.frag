// Diffusion for wave equation
vec3 DiffusionWave(vec2 _coord){

    float it = spread;
     // float it = 1. + ((mouse.y-(img_size*0.5))* 0.01);

    vec2 coord_d = _coord;

    // diagonals

    // vec2 n0 = vec2(coord_d.s, coord_d.t);
    // vec2 n1 = vec2(coord_d.s + it, coord_d.t);
    // vec2 n2 = vec2(coord_d.s - it, coord_d.t);
    // vec2 n3 = vec2(coord_d.s, coord_d.t + it);
    // vec2 n4 = vec2(coord_d.s, coord_d.t - it);
    // vec2 n5 = vec2(coord_d.s + it, coord_d.t + it);
    // vec2 n6 = vec2(coord_d.s + it, coord_d.t - it);
    // vec2 n7 = vec2(coord_d.s - it, coord_d.t + it);
    // vec2 n8 = vec2(coord_d.s - it, coord_d.t - it);

    // vec4 laplacian =  -8. * texture(tex0, n0) +
    //                   texture(tex0, n1) +
    //                   texture(tex0, n2) +
    //                   texture(tex0, n3) +
    //                   texture(tex0, n4) +
    //                   texture(tex0, n5) +
    //                   texture(tex0, n6) +
    //                   texture(tex0, n7) +
    //                   texture(tex0, n8);

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
  vec2 n5 = vec2(coord_d.s + it, coord_d.t + it);
  vec2 n6 = vec2(coord_d.s + it, coord_d.t - it);
  vec2 n7 = vec2(coord_d.s - it, coord_d.t + it);
  vec2 n8 = vec2(coord_d.s - it, coord_d.t - it);

  // sample[0] = -8. * texture(tex0, n0);
  sample[0] = -8. * ((texture(tex0, n0)- vec4(0.5)) * vec4(2.));
  
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

  // shift into -1 to 1 range, skipping first sample
  for (int i = 1; i < 9; i++){
    sample[i].rgb = (sample[i].rgb - vec3(0.5)) * vec3(2.);
  }

  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+
                  sample[4]+sample[5]+sample[6]+sample[7]+sample[8];

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
  vec2 n5 = vec2(coord_d.s + it, coord_d.t + it);
  vec2 n6 = vec2(coord_d.s + it, coord_d.t - it);
  vec2 n7 = vec2(coord_d.s - it, coord_d.t + it);
  vec2 n8 = vec2(coord_d.s - it, coord_d.t - it);

  // sample[0] = -8. * texture(tex0, n0);
  sample[0] = -8. * ((texture(tex0, n0)- vec4(0.5)) * vec4(2.));
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

  // shift into -1 to 1 range, skipping first sample
  for (int i = 1; i < 9; i++){
    sample[i].rgb = (sample[i].rgb - vec3(0.5)) * vec3(2.);
  }

  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+
                  sample[4]+sample[5]+sample[6]+sample[7]+sample[8];

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
  vec2 n5 = vec2(coord_d.s + it, coord_d.t + it);
  vec2 n6 = vec2(coord_d.s + it, coord_d.t - it);
  vec2 n7 = vec2(coord_d.s - it, coord_d.t + it);
  vec2 n8 = vec2(coord_d.s - it, coord_d.t - it);

  // sample[0] = -8. * texture(tex0, n0);
  sample[0] = -8. * ((texture(tex0, n0)- vec4(0.5)) * vec4(2.));
  
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

  // shift into -1 to 1 range, skipping first sample
  for (int i = 1; i < 9; i++){
    sample[i].rgb = (sample[i].rgb - vec3(0.5)) * vec3(2.);
  }

  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+
                  sample[4]+sample[5]+sample[6]+sample[7]+sample[8];

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
  vec2 n5 = vec2(coord_d.s + it, coord_d.t + it);
  vec2 n6 = vec2(coord_d.s + it, coord_d.t - it);
  vec2 n7 = vec2(coord_d.s - it, coord_d.t + it);
  vec2 n8 = vec2(coord_d.s - it, coord_d.t - it);

  // sample[0] = -8. * texture(tex0, n0);
  sample[0] = -8. * ((texture(tex0, n0)- vec4(0.5)) * vec4(2.));
  
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

  // shift into -1 to 1 range, skipping first sample
  for (int i = 1; i < 9; i++){
    sample[i].rgb = (sample[i].rgb - vec3(0.5)) * vec3(2.);
  }


  vec4 laplacian =sample[0]+sample[1]+sample[2]+sample[3]+
                  sample[4]+sample[5]+sample[6]+sample[7]+sample[8];

  return laplacian.rgb;
}  