#include "ofMain.h"
#include "ofApp.h"
#ifdef TARGET_OPENGLES
#include "ofGLProgrammableRenderer.h"
#endif
//========================================================================
int main( ){
    ofSetLogLevel(OF_LOG_VERBOSE);
    //#ifdef TARGET_OPENGLES
    ofSetCurrentRenderer(ofGLProgrammableRenderer::TYPE);

//	ofSetupOpenGL(1024,1024,OF_WINDOW);			// <-------- setup the GL context
//	ofSetupOpenGL(2048,1024,OF_WINDOW);			// <-------- setup the GL context
	ofSetupOpenGL(1920,1080,OF_WINDOW);			// <-------- setup the GL context
//	ofSetupOpenGL(8192,8192,OF_WINDOW);			// <-------- setup the GL context
	// this kicks off the running of my app
	// can be OF_WINDOW or OF_FULLSCREEN
	// pass in width and height too:
	ofRunApp(new ofApp());

}
