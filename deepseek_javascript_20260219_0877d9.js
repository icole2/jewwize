// Injected directly into page context for deeper API manipulation
(function() {
  // Create a sandboxed environment
  const script = document.createElement('script');
  script.textContent = `
    // Override performance APIs to prevent timing-based tracking [citation:1]
    const originalNow = performance.now;
    performance.now = function() {
      return originalNow.call(this) + (Math.random() * 10 - 5);
    };
    
    // Block canvas fingerprinting
    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function() {
      // Add slight noise to canvas data
      const imageData = originalGetImageData.apply(this, arguments);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = imageData.data[i] ^ 0x01;
      }
      return imageData;
    };
    
    // Override WebGL fingerprinting
    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
        return 'Intel Inc.';
      }
      if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
        return 'Intel Iris OpenGL Engine';
      }
      return originalGetParameter.call(this, parameter);
    };
    
    // Block extension detection attempts
    if (window.chrome && window.chrome.runtime && window.chrome.runtime.sendMessage) {
      const originalSendMessage = window.chrome.runtime.sendMessage;
      window.chrome.runtime.sendMessage = function() {
        // Intercept and block messages to malicious extensions
        return new Promise((resolve) => {
          resolve({ blocked: true });
        });
      };
    }
  `;
  
  document.documentElement.appendChild(script);
  script.remove();
})();