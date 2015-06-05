#pragma once

#include "ofMain.h"

class ofApp : public ofBaseApp{

public:
    void setup();
    void update();
    void draw();

    void keyPressed  (int key);
    void keyReleased (int key);

    void mouseMoved(int x, int y );
    void mouseDragged(int x, int y, int button);
    void mousePressed(int x, int y, int button);
    void mouseReleased(int x, int y, int button);
    void windowResized(int w, int h);
    void dragEvent(ofDragInfo dragInfo);
    void gotMessage(ofMessage msg);

    void DisableInterpolation();
    void ClearFramebuffers();
//    void UpdateShaderUniforms();

    ofTrueTypeFont font;
    ofShader shader;
    ofShader waveShader, waveShaderTiled;
    ofShader waveShader_display, waveShader_displayTiled;

    ofFbo height_FBO,
          height_Fbo0,
          height_Fbo1,
          height_Fbo2,
          height_Fbo3;
    ofFbo height_old_FBO,
          height_old_Fbo0,
          height_old_Fbo1,
          height_old_Fbo2,
          height_old_Fbo3;
    ofFbo height_backup_FBO,
          height_backup_Fbo0,
          height_backup_Fbo1,
          height_backup_Fbo2,
          height_backup_Fbo3;



    ofFbo display;

    ofTexture height;
    ofTexture height0,height1,height2,height3;
    ofTexture height_old;
    ofTexture height_old0,height_old1,height_old2,height_old3;
    ofTexture height_backup;

    ofImage img_test;
    ofImage img_00,img_01,img_02,img_03;

    int frame_num, time_step, pick_step;
    int w, h;
    float scale_factor, img_size, fbo_size;
    bool doShader;
    bool animate;

    unsigned char 	* colorPixels;
};

