// Content script - runs at document_start to intercept monitoring [citation:1]
(function() {
  'use strict';
  
  // Override screen capture APIs
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
    navigator.mediaDevices.getDisplayMedia = function(constraints) {
      console.log('Screen capture blocked by bypass extension');
      return Promise.reject(new Error('Screen capture blocked'));
    };
  }
  
  // Override getUserMedia to prevent camera/mic monitoring
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = function(constraints) {
      // Block video/screen sharing requests from malware extensions
      if (constraints.video && constraints.video.mediaSource) {
        return Promise.reject(new Error('Media capture blocked'));
      }
      return originalGetUserMedia.call(this, constraints);
    };
  }
  
  // Block visibility tracking [citation:1]
  Object.defineProperty(document, 'visibilityState', {
    get: () => 'visible'
  });
  
  Object.defineProperty(document, 'hidden', {
    get: () => false
  });
  
  // Prevent focus/blur tracking
  window.addEventListener('blur', (e) => {
    e.stopImmediatePropagation();
  }, true);
  
  window.addEventListener('focus', (e) => {
    e.stopImmediatePropagation();
  }, true);
  
  // Bypass copy/paste restrictions
  document.addEventListener('copy', (e) => {
    e.stopPropagation();
  }, true);
  
  document.addEventListener('paste', (e) => {
    e.stopPropagation();
  }, true);
  
  // Block keyboard event monitoring [citation:2]
  document.addEventListener('keydown', (e) => {
    e.stopPropagation();
  }, true);
  
  document.addEventListener('keyup', (e) => {
    e.stopPropagation();
  }, true);
})();