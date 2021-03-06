#include "ofApp.h"

// High Resolution Wave Equation
// Kurt Kaminski
// 9 June 2015
//
// a: start/stop animation
// +/-: zoom
// g: center camera and lock
// mouse click: lock current camera position
// .: save all 4 tiles
// /: save current HD frame
// m: start recording all frames


//--------------------------------------------------------------
void ofApp::DisableInterpolation(){
//  height_FBO.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
//  height_old_FBO.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
//  height_backup_FBO.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);

  // textures
  height0.setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height1.setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height2.setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height3.setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );

  // Fbos
  height_Fbo0.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_Fbo1.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_Fbo2.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_old_Fbo0.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_Fbo3.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_old_Fbo1.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_old_Fbo2.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_old_Fbo3.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_backup_Fbo0.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_backup_Fbo1.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_backup_Fbo2.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  height_backup_Fbo3.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );

  display.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );

  img_00.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  img_01.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  img_02.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );
  img_03.getTextureReference().setTextureMinMagFilter( GL_NEAREST, GL_NEAREST );

}

//--------------------------------------------------------------
void ofApp::setup(){
  ofBackground(34, 34, 34);
  ofSetVerticalSync(true);
  ofSetFrameRate(0);
//  ofDisableAntiAliasing();
  ofDisableLighting();
//  ofDisableAlphaBlending();
//  ofEnableNormalizedTexCoords();
//  ofDisableArbTex();
  ofEnableArbTex();
//  ofDisableNormalizedTexCoords();
  ofDisableTextureEdgeHack();
//  ofDisableSmoothing();
  ofSetMinMagFilters(GL_NEAREST, GL_NEAREST);
//  ofEnableAlphaBlending();

  img_size = 4096.;
  fbo_size = 8192.;
  w = img_size;
  h = img_size;
  scale_display = 5.7;
  scale_target = scale_display;

//  colorPixels = new unsigned char [w*h*3];
  doShader = true;
  frame_num = 0;
  record_num = 0;
  time_step = 0;
  pick_step = 1;
  animate = false;
  camera_lock = false;
  camera_home = false;
  record = false;
  showFPS = false;

  font.loadFont("type/verdana.ttf", 10);

  quad.clear();
  quad.setMode(OF_PRIMITIVE_TRIANGLE_STRIP);
  quad.addVertex(ofVec3f(0, 0, 0));
  quad.addVertex(ofVec3f(w, 0, 0));
  quad.addVertex(ofVec3f(0, h, 0));
  quad.addVertex(ofVec3f(w, h, 0));

  img_00.loadImage("images/d7f_4k_01.png");
  img_01.loadImage("images/d7f_4k_02.png");
  img_02.loadImage("images/d7f_4k_03.png");
  img_03.loadImage("images/d7f_4k_04.png");
//  img_00.loadImage("images/micro_01.jpg");
//  img_01.loadImage("images/micro_02.jpg");
//  img_02.loadImage("images/micro_03.jpg");
//  img_03.loadImage("images/micro_04.jpg");

  /////////////////////////////////////////////////////////////////////////////
  // Framebuffers, allocation, etc
  /////////////////////////////////////////////////////////////////////////////
//  height.allocate(w,h,GL_RGB);
  height0.allocate(w,h,GL_RGB);
  height1.allocate(w,h,GL_RGB);
  height2.allocate(w,h/2,GL_RGB);
  height3.allocate(w,h/2,GL_RGB);

//  height_old.allocate(w,h,GL_RGB);
//  height_backup.allocate(w,h,GL_RGB);
  display.allocate(ofGetWidth(),ofGetHeight(),GL_RGB);

//  height_FBO.allocate(w,h,GL_RGB);
  height_Fbo0.allocate(w,h,GL_RGB);
  height_Fbo1.allocate(w,h,GL_RGB);
  height_Fbo2.allocate(w,h/2,GL_RGB);
  height_Fbo3.allocate(w,h/2,GL_RGB);
//  height_old_FBO.allocate(w,h,GL_RGB);
  height_old_Fbo0.allocate(w,h,GL_RGB);
  height_old_Fbo1.allocate(w,h,GL_RGB);
  height_old_Fbo2.allocate(w,h/2,GL_RGB);
  height_old_Fbo3.allocate(w,h/2,GL_RGB);
//  height_backup_FBO.allocate(w,h,GL_RGB);
  height_backup_Fbo0.allocate(w,h,GL_RGB);
  height_backup_Fbo1.allocate(w,h,GL_RGB);
  height_backup_Fbo2.allocate(w,h/2,GL_RGB);
  height_backup_Fbo3.allocate(w,h/2,GL_RGB);

  ClearFramebuffers();
  DisableInterpolation();


  /////////////////////////////////////////////////////////////////////////////
  // end framebuffers
  /////////////////////////////////////////////////////////////////////////////


//  #ifdef TARGET_OPENGLES
//    shader.load("shaders_gles/noise.vert","shaders_gles/noise.frag");
//  #else
    if(ofGetGLProgrammableRenderer()){
      shader.load("shaders_gl3/noise.vert", "shaders_gl3/noise.frag");
      waveShader.load("shaders_gl3/wave.vert", "shaders_gl3/wave.frag");
      waveShaderTiled.load("shaders_gl3/wave_tiled.vert", "shaders_gl3/wave_tiled.frag");
      waveShader_display.load("shaders_gl3/wave_DISPLAY.vert",
                              "shaders_gl3/wave_DISPLAY.frag");
      waveShader_displayTiled.load("shaders_gl3/wave_DISPLAY_tiled.vert",
                                    "shaders_gl3/wave_DISPLAY_tiled.frag");
      waveShaderMod.load("shaders_gl3/wave_mod.vert", "shaders_gl3/wave_mod.frag");
    }
    else{
      shader.load("shaders/noise.vert", "shaders/noise.frag");
    }
//  #endif


}


//--------------------------------------------------------------
void ofApp::update(){

    if (time_step < pick_step){
      if (frame_num % 48 == 0){
          waveShader.load("shaders_gl3/wave.vert",
                          "shaders_gl3/wave.frag");
          waveShaderTiled.load("shaders_gl3/wave_tiled.vert",
                               "shaders_gl3/wave_tiled.frag");
          waveShader_display.load("shaders_gl3/wave_DISPLAY.vert",
                              "shaders_gl3/wave_DISPLAY.frag");
          waveShader_displayTiled.load("shaders_gl3/wave_DISPLAY_tiled.vert",
                              "shaders_gl3/wave_DISPLAY_tiled.frag");
          waveShaderMod.load("shaders_gl3/wave_mod.vert",
                             "shaders_gl3/wave_mod.frag");
      }

//      height_backup_FBO.begin();
//        height_FBO.draw(0,0);
//      height_backup_FBO.end();
//
//      height_FBO.begin();
//      waveShader.begin();
//        waveShader.setUniformTexture("height_old_tex", height_old_FBO.getTextureReference(), 1);
//        waveShader.setUniformTexture("img_01_tex", img_01.getTextureReference(), 2);
//        waveShader.setUniform1f("img_size", img_size);
//        waveShader.setUniform1i("frame_num", frame_num);
//        waveShader.setUniform2f("mouse", mouseX, mouseY);
//        height.draw(0,0);
//      waveShader.end();
//      height_FBO.end();
//
//      height_old_FBO.begin();
//        height_backup_FBO.draw(0,0);
//      height_old_FBO.end();
//
//      height = height_FBO.getTextureReference();

//    DisableInterpolation();

    ///////////////////////////////////////////////////////////////////////
    // TILE 0
    ///////////////////////////////////////////////////////////////////////
      height_backup_Fbo0.begin();
//        height_Fbo0.draw(0,0);
        height_Fbo0.draw(0.0,0.0);
      height_backup_Fbo0.end();

      height_Fbo0.begin();
      waveShaderTiled.begin();
        waveShaderTiled.setUniformTexture("height_old_tex", height_old_Fbo0.getTextureReference(), 1);
//        waveShaderTiled.setUniformTexture("height_old_tex", old_fbo->getTextureReference(), 1);
        waveShaderTiled.setUniformTexture("img_01_tex", img_00.getTextureReference(), 2);
        waveShaderTiled.setUniformTexture("neighbor_x_tex", height_Fbo1.getTextureReference(), 3);
        waveShaderTiled.setUniformTexture("neighbor_y_tex", height_Fbo2.getTextureReference(), 4);
        waveShaderTiled.setUniform1i("pos", 0);
        waveShaderTiled.setUniform1i("frame_num", frame_num);
        waveShaderTiled.setUniform2f("mouse", mouseX, mouseY);
        height0.draw(0.0,0.0);
      waveShaderTiled.end();
      height_Fbo0.end();

      height_old_Fbo0.begin();
      waveShaderMod.begin();
        waveShaderMod.setUniform1f("frame_num", float(frame_num));
        height_backup_Fbo0.draw(0.0,0.0);
      waveShaderMod.end();
      height_old_Fbo0.end();

      height0 = height_Fbo0.getTextureReference();


    ///////////////////////////////////////////////////////////////////////
    // TILE 1
    ///////////////////////////////////////////////////////////////////////
      height_backup_Fbo1.begin();
        height_Fbo1.draw(0,0);
      height_backup_Fbo1.end();

      height_Fbo1.begin();
      waveShaderTiled.begin();
        waveShaderTiled.setUniformTexture("height_old_tex", height_old_Fbo1.getTextureReference(), 1);
        waveShaderTiled.setUniformTexture("img_01_tex", img_01.getTextureReference(), 2);
        waveShaderTiled.setUniformTexture("neighbor_x_tex", height_Fbo0.getTextureReference(), 3);
        waveShaderTiled.setUniformTexture("neighbor_y_tex", height_Fbo3.getTextureReference(), 4);
        waveShaderTiled.setUniform1i("pos", 1);
        waveShaderTiled.setUniform1i("frame_num", frame_num);
        waveShaderTiled.setUniform2f("mouse", mouseX, mouseY);
//        height1.draw(0,0);
        height_Fbo1.draw(0,0);
      waveShaderTiled.end();
      height_Fbo1.end();

      height_old_Fbo1.begin();
      waveShaderMod.begin();
        waveShaderMod.setUniform1f("frame_num", float(frame_num));
        height_backup_Fbo1.draw(0,0);
      waveShaderMod.end();
      height_old_Fbo1.end();

      height1 = height_Fbo1.getTextureReference();

    ///////////////////////////////////////////////////////////////////////
    // TILE 2
    ///////////////////////////////////////////////////////////////////////
      height_backup_Fbo2.begin();
        height_Fbo2.draw(0,0);
      height_backup_Fbo2.end();

      height_Fbo2.begin();
      waveShaderTiled.begin();
        waveShaderTiled.setUniformTexture("height_old_tex", height_old_Fbo2.getTextureReference(), 1);
        waveShaderTiled.setUniformTexture("img_01_tex", img_02.getTextureReference(), 2);
        waveShaderTiled.setUniformTexture("neighbor_x_tex", height_Fbo3.getTextureReference(), 3);
        waveShaderTiled.setUniformTexture("neighbor_y_tex", height_Fbo0.getTextureReference(), 4);
        waveShaderTiled.setUniform1i("pos", 2);
        waveShaderTiled.setUniform1i("frame_num", frame_num);
        waveShaderTiled.setUniform2f("mouse", mouseX, mouseY);
        height2.draw(0,0);
      waveShaderTiled.end();
      height_Fbo2.end();

      height_old_Fbo2.begin();
      waveShaderMod.begin();
        waveShaderMod.setUniform1f("frame_num", float(frame_num));
        height_backup_Fbo2.draw(0,0);
      waveShaderMod.end();
      height_old_Fbo2.end();

      height2 = height_Fbo2.getTextureReference();

    ///////////////////////////////////////////////////////////////////////
    // TILE 3
    ///////////////////////////////////////////////////////////////////////
      height_backup_Fbo3.begin();
        height_Fbo3.draw(0,0);
      height_backup_Fbo3.end();

      height_Fbo3.begin();
      waveShaderTiled.begin();
        waveShaderTiled.setUniformTexture("height_old_tex", height_old_Fbo3.getTextureReference(), 1);
        waveShaderTiled.setUniformTexture("img_01_tex", img_03.getTextureReference(), 2);
        waveShaderTiled.setUniformTexture("neighbor_x_tex", height_Fbo2.getTextureReference(), 3);
        waveShaderTiled.setUniformTexture("neighbor_y_tex", height_Fbo1.getTextureReference(), 4);
        waveShaderTiled.setUniform1i("pos", 3);
        waveShaderTiled.setUniform1i("frame_num", frame_num);
        waveShaderTiled.setUniform2f("mouse", mouseX, mouseY);
        height3.draw(0,0);
      waveShaderTiled.end();
      height_Fbo3.end();

      height_old_Fbo3.begin();
      waveShaderMod.begin();
        waveShaderMod.setUniform1f("frame_num", float(frame_num));
        height_backup_Fbo3.draw(0,0);
      waveShaderMod.end();
      height_old_Fbo3.end();

      height3 = height_Fbo3.getTextureReference();

      // record movie as individual HD frames
      if (record == true){
        if (frame_num % 1 == 0) {
          string movie_number = "10b";
          string folder = "captures/";
          folder += "movie/m" + movie_number + "/";
          string movie_fn= ofToString(frame_num);
          string filename = folder + "m" + movie_number + "_" + movie_fn+ ".jpg";

          display.readToPixels(screenshot);
          ofSaveImage(screenshot, filename);
          cout<<"Saved "<<filename<<endl;
        }
      }

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

      frame_num++;
      record_num++;

      if (animate == true){
        time_step++;
        pick_step++;
      }
      else time_step++;
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
//    ofSetColor(245, 58, 135);
//    ofFill();


    if (camera_home == true){
      mx = ofGetWidth()/2;
      my = ofGetHeight()/2;
    }
    else if (camera_lock == false){
      mx += EaseIn(mx, float(mouseX), 0.05);
      my += EaseIn(my, float(mouseY), 0.05);
      if (abs(mouseX - mx) < 1) mx = mouseX;
      if (abs(mouseY - my) < 1) my = mouseY;
    }
    scale_display += EaseIn(scale_display, scale_target, 0.05);

    display.begin();
    ofBackground(34, 34, 34);
    waveShader_displayTiled.begin();
      waveShader_displayTiled.setUniform2f("mouse", mx, my);
      waveShader_displayTiled.setUniform1f("scale_factor", scale_display);
      waveShader_displayTiled.setUniform1i("pos", 0);
      height_Fbo0.draw(0,0);
    waveShader_displayTiled.end();

    waveShader_displayTiled.begin();
      waveShader_displayTiled.setUniform2f("mouse", mx, my);
      waveShader_displayTiled.setUniform1f("scale_factor", scale_display);
      waveShader_displayTiled.setUniform1i("pos", 1);
      height_Fbo1.draw(0,0);
    waveShader_displayTiled.end();

    waveShader_displayTiled.begin();
      waveShader_displayTiled.setUniform2f("mouse", mx, my);
      waveShader_displayTiled.setUniform1f("scale_factor", scale_display);
      waveShader_displayTiled.setUniform1i("pos", 2);
      height_Fbo2.draw(0,0);
    waveShader_displayTiled.end();

    waveShader_displayTiled.begin();
      waveShader_displayTiled.setUniform2f("mouse", mx, my);
      waveShader_displayTiled.setUniform1f("scale_factor", scale_display);
      waveShader_displayTiled.setUniform1i("pos", 3);
      height_Fbo3.draw(0,0);
    waveShader_displayTiled.end();
    display.end();

    // finally display the image
    display.draw(0,0);

    // show framerate at top left
    if (showFPS){
      ofSetColor(0);
      ofRect(10, 5, 60, 15);
      ofSetColor(255);
      string framerate = ofToString(ofGetFrameRate());
      font.drawString(framerate, 10, 18);

    }

//    cout<<"frame "<<frame_num<<endl;
}

//--------------------------------------------------------------
void ofApp::keyPressed  (int key){
    if (key == '?'){
      cout << height_Fbo0.getTextureReference().texData.textureTarget << " " << GL_TEXTURE_2D << " " <<  GL_TEXTURE_RECTANGLE_ARB << endl;
    }
    if (key == '.'){
      string folder = "02/";
      folder = "captures/" + folder;
      string timestamp = ofGetTimestampString("%Y%m%d_%H%M%S.png");
      string filename = folder + "t0_" + timestamp;

      height_Fbo0.readToPixels(screenshot);
      ofSaveImage(screenshot, filename);

      filename = folder + "t1_" + timestamp;
      height_Fbo1.readToPixels(screenshot);
      ofSaveImage(screenshot, filename);

      filename = folder + "t2_" + timestamp;
      height_Fbo2.readToPixels(screenshot);
      ofSaveImage(screenshot, filename);

      filename = folder + "t3_" + timestamp;
      height_Fbo3.readToPixels(screenshot);
      ofSaveImage(screenshot, filename);
    }
    if (key  == '/'){
      string folder = "captures/";
      string timestamp = ofGetTimestampString("%Y%m%d_%H%M%S.png");
      string filename = folder + "display_" + timestamp;

      display.readToPixels(screenshot);
      ofSaveImage(screenshot, filename);
    }
    if (key == '-'){
      scale_target += 1.;
    }
    if (key == '='){
      scale_target -= 1.;
      if (scale_target <= .4) scale_target = 0.4;
    }
    if (key == ' '){
      pick_step++;
    }
    if (key == 'a'){
      if (animate==true) {
        pick_step--;
        animate = false;
      }
      else {
        pick_step++;
        animate = true;
      }
    }
    if (key == 'g'){
      if (camera_home == false) {
          scale_target = 5.7;
          camera_home=true;
      }
      else camera_home = false;
    }
    if (key == 'f'){
      if (showFPS==false) showFPS=true;
      else showFPS = false;
    }
    if( key == 's' ){
        doShader = !doShader;
    }
    if (key == 'r'){
      frame_num = 0;
      ClearFramebuffers();
    }
    if (key == 'm'){
      if (record == false) {
        cout<<"Starting movie!"<<endl;
        record = true;
      }
      else {
        cout<<"Stopping recording movie."<<endl;
        record = false;
      }
    }

    if (key == '0'){
      scale_target = 5.7;
    }
    if (key == '1'){
      scale_target = 1.0;
    }
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){
//  cout<<x<<", "<<y<<endl;
}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){
  if(camera_lock==true){
    cout<<"CAMERA UNLOCKED"<<endl;
    camera_lock=false;
  }
  else {
    cout<<"CAMERA LOCKED"<<endl;
    camera_lock = true;
  }
}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){

}

//--------------------------------------------------------------
float ofApp::EaseIn(float _value, float _target, float _speed){
  float x = _value;
  float d = _target - _value;
  x = d * _speed;
  return x;
}

//--------------------------------------------------------------
void ofApp::ClearFramebuffers(){
      height_FBO.begin();
      ofClear(0,0,0,0);
      height_FBO.end();
      height_old_FBO.begin();
      ofClear(0,0,0,0);
      height_old_FBO.end();
      height_backup_FBO.begin();
      ofClear(0,0,0,0);
      height_backup_FBO.end();

      height_Fbo0.begin();
      ofClear(0,0,0,0);
      height_Fbo0.end();

      height_Fbo1.begin();
      ofClear(0,0,0,0);
      height_Fbo1.end();

      height_Fbo2.begin();
      ofClear(0,0,0,0);
      height_Fbo2.end();

      height_Fbo3.begin();
      ofClear(0,0,0,0);
      height_Fbo3.end();

      height_old_Fbo0.begin();
      ofClear(0,0,0,0);
      height_old_Fbo0.end();

      height_old_Fbo1.begin();
      ofClear(0,0,0,0);
      height_old_Fbo1.end();

      height_old_Fbo2.begin();
      ofClear(0,0,0,0);
      height_old_Fbo2.end();

      height_old_Fbo3.begin();
      ofClear(0,0,0,0);
      height_old_Fbo3.end();

      height_backup_Fbo0.begin();
      ofClear(0,0,0,0);
      height_backup_Fbo0.end();

      height_backup_Fbo1.begin();
      ofClear(0,0,0,0);
      height_backup_Fbo1.end();

      height_backup_Fbo2.begin();
      ofClear(0,0,0,0);
      height_backup_Fbo2.end();

      height_backup_Fbo3.begin();
      ofClear(0,0,0,0);
      height_backup_Fbo3.end();
}

