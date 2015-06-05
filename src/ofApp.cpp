#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::DisableInterpolation(){
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_LOD, GL_NEAREST);
  glTexParameterf( GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
//  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAX_LOD, GL_NEAREST);
//  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAX_LOD, GL_NEAREST);
//  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_BASE_LEVEL, GL_NEAREST);
//  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAX_LEVEL, GL_NEAREST);
//  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_PRIORITY, GL_NEAREST);
//  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_COMPARE_FUNC, GL_NEAREST);
//  ofSetMinMagFilters(GL_NEAREST, GL_NEAREST);

}

//--------------------------------------------------------------
void ofApp::setup(){
  ofBackground(34, 34, 34);
  ofSetVerticalSync(true);
  ofSetFrameRate(240);
//  ofEnableAlphaBlending();

  img_size = 4096.;
  fbo_size = 8192.;
  w = img_size;
  h = img_size;
  scale_factor = 4.;

//  colorPixels = new unsigned char [w*h*3];
  doShader = true;
  frame_num = 0;
  time_step = 0;
  pick_step = 1;
  animate = false;

//  img_01.loadImage("images/ammann_1024.png");
//  img_01.loadImage("images/d7f_4k.png");
  img_00.loadImage("images/d7f_4k_01.png");
  img_01.loadImage("images/d7f_4k_02.png");
  img_02.loadImage("images/d7f_4k_03.png");
  img_03.loadImage("images/d7f_4k_04.png");

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
//  display.allocate(w,h,GL_RGB);

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

//  height_FBO.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_Fbo0.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_Fbo1.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_Fbo2.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_Fbo3.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
//  height_old_FBO.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_old_Fbo0.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_old_Fbo1.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_old_Fbo2.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_old_Fbo3.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
//  height_backup_FBO.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_backup_Fbo0.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_backup_Fbo1.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_backup_Fbo2.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
  height_backup_Fbo3.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);

  ofDisableArbTex();
  ofDisableNormalizedTexCoords();
  ofDisableTextureEdgeHack();
  ofDisableSmoothing();
//
  ClearFramebuffers();

//  height.allocate(w,h,GL_RGB);
//  height_old.allocate(w,h,GL_RGB);
//  height_backup.allocate(w,h,GL_RGB);
//  display.allocate(w,h,GL_RGB);
//
//  height_FBO.allocate(w,h,GL_RGB);
//  height_old_FBO.allocate(w,h,GL_RGB);
//  height_backup_FBO.allocate(w,h,GL_RGB);
//
//  height_FBO.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
//  height_old_FBO.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
//  height_backup_FBO.getTextureReference().setTextureMinMagFilter(GL_NEAREST,GL_NEAREST);
//
//  ofDisableArbTex();
//  ofDisableNormalizedTexCoords();
//  ofDisableTextureEdgeHack();
//  ofDisableSmoothing();
//
//
//  height_FBO.begin();
//    ofClear(0,0,0,255);
//  height_FBO.end();
//
//  height_old_FBO.begin();
//    ofClear(0,0,0,255);
////    img_test.loadImage("images/d7f_720_sq2.png");
////    img_test.draw(0,0);
//  height_old_FBO.end();
//
//  height_backup_FBO.begin();
//    ofClear(0,0,0,255);
//  height_backup_FBO.end();

  /////////////////////////////////////////////////////////////////////////////
  // end framebuffers
  /////////////////////////////////////////////////////////////////////////////

  DisableInterpolation();

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
//void ofApp::UpdateShaderUniforms(){
////        waveShader.begin();
////        waveShader.setUniformTexture("height_old_tex", height_old_FBO.getTextureReference(), 1);
////        waveShader.setUniformTexture("img_01_tex", img_01.getTextureReference(), 2);
//        waveShaderTiled.setUniform1f("img_size", img_size);
//        waveShaderTiled.setUniform1i("frame_num", frame_num);
//        waveShaderTiled.setUniform2f("mouse", mouseX, mouseY);
////        waveShader.end();
//}


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

      // needs tiling!!!!
      // need to output full res tiles
      // implement oscillator on previous timestep
      // fix diagonal line
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


    ///////////////////////////////////////////////////////////////////////
    // TILE 0
    ///////////////////////////////////////////////////////////////////////
      height_backup_Fbo0.begin();
        height_Fbo0.draw(0,0);
      height_backup_Fbo0.end();

      height_Fbo0.begin();
      waveShaderTiled.begin();
        waveShaderTiled.setUniformTexture("height_old_tex", height_old_Fbo0.getTextureReference(), 1);
        waveShaderTiled.setUniformTexture("img_01_tex", img_00.getTextureReference(), 2);
        waveShaderTiled.setUniformTexture("neighbor_x_tex", height_Fbo1.getTextureReference(), 3);
        waveShaderTiled.setUniformTexture("neighbor_y_tex", height_Fbo2.getTextureReference(), 4);
        waveShaderTiled.setUniform1i("pos", 0);
        waveShaderTiled.setUniform1i("frame_num", frame_num);
        waveShaderTiled.setUniform2f("mouse", mouseX, mouseY);
        height0.draw(0,0);
      waveShaderTiled.end();
      height_Fbo0.end();

      height_old_Fbo0.begin();
      waveShaderMod.begin();
        waveShaderMod.setUniform1f("frame_num", float(frame_num));
        height_backup_Fbo0.draw(0,0);
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
        height1.draw(0,0);
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
////
////    ///////////////////////////////////////////////////////////////////////
////    // TILE 3
////    ///////////////////////////////////////////////////////////////////////
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


      frame_num++;

      if (animate == true){
        time_step++;
        pick_step++;
      }
      else time_step++;
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
//  ofGetElapsedTimef()
//    ofSetColor(245, 58, 135);
//    ofFill();

//    waveShader_display.begin();
//      waveShader_display.setUniform1f("scale_factor", scale_factor);
//      height_FBO.draw(0,0);
//    waveShader_display.end();
//
    waveShader_displayTiled.begin();
      waveShader_displayTiled.setUniform1f("scale_factor", scale_factor);
      waveShader_displayTiled.setUniform1i("pos", 0);
      height_Fbo0.draw(0,0);
    waveShader_displayTiled.end();

    waveShader_displayTiled.begin();
      waveShader_displayTiled.setUniform1f("scale_factor", scale_factor);
      waveShader_displayTiled.setUniform1i("pos", 1);
      height_Fbo1.draw(0,0);
    waveShader_displayTiled.end();

    waveShader_displayTiled.begin();
      waveShader_displayTiled.setUniform1f("scale_factor", scale_factor);
      waveShader_displayTiled.setUniform1i("pos", 2);
      height_Fbo2.draw(0,0);
    waveShader_displayTiled.end();

    waveShader_displayTiled.begin();
      waveShader_displayTiled.setUniform1f("scale_factor", scale_factor);
      waveShader_displayTiled.setUniform1i("pos", 3);
      height_Fbo3.draw(0,0);
    waveShader_displayTiled.end();


//    cout<<"frame "<<frame_num<<endl;
}

//--------------------------------------------------------------
void ofApp::keyPressed  (int key){
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
    if( key == 's' ){
        doShader = !doShader;
    }
    if (key == 'r'){
      frame_num = 0;
      ClearFramebuffers();
    }
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

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
void ofApp::ClearFramebuffers(){
      height_FBO.begin();
      ofClear(0,0,0,255);
      height_FBO.end();
      height_old_FBO.begin();
      ofClear(0,0,0,255);
      height_old_FBO.end();
      height_backup_FBO.begin();
      ofClear(0,0,0,255);
      height_backup_FBO.end();

      height_Fbo0.begin();
      ofClear(0,0,0,255);
      height_Fbo0.end();

      height_Fbo1.begin();
      ofClear(0,0,0,255);
      height_Fbo1.end();

      height_Fbo2.begin();
      ofClear(0,0,0,255);
      height_Fbo2.end();

      height_Fbo3.begin();
      ofClear(0,0,0,255);
      height_Fbo3.end();

      height_old_Fbo0.begin();
      ofClear(0,0,0,255);
      height_old_Fbo0.end();

      height_old_Fbo1.begin();
      ofClear(0,0,0,255);
      height_old_Fbo1.end();

      height_old_Fbo2.begin();
      ofClear(0,0,0,255);
      height_old_Fbo2.end();

      height_old_Fbo3.begin();
      ofClear(0,0,0,255);
      height_old_Fbo3.end();

      height_backup_Fbo0.begin();
      ofClear(0,0,0,255);
      height_backup_Fbo0.end();

      height_backup_Fbo1.begin();
      ofClear(0,0,0,255);
      height_backup_Fbo1.end();

      height_backup_Fbo2.begin();
      ofClear(0,0,0,255);
      height_backup_Fbo2.end();

      height_backup_Fbo3.begin();
      ofClear(0,0,0,255);
      height_backup_Fbo3.end();
}

