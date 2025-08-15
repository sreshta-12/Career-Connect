export function checkBrowserCompatibility() {
  const checks = {
    ethereum: !!window.ethereum,
    ethereumProvider: !!window.ethereum?.isMetaMask,
    solana: !!window.solana,
    phantom: !!window.solana?.isPhantom,
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })(),
    modernBrowser: (() => {
      const userAgent = navigator.userAgent;
      const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
      const isFirefox = /Firefox/.test(userAgent);
      const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
      const isEdge = /Edge/.test(userAgent);
      return isChrome || isFirefox || isSafari || isEdge;
    })(),
    https: window.location.protocol === 'https:' || window.location.hostname === 'localhost'
  };

  const issues = [];
  
  if (!checks.ethereum && !checks.solana) {
    issues.push('No Web3 wallet extensions detected. Install MetaMask or Phantom.');
  }
  
  if (!checks.localStorage) {
    issues.push('Local storage not available. This may affect wallet state persistence.');
  }
  
  if (!checks.modernBrowser) {
    issues.push('Browser may not be fully compatible. Use Chrome, Firefox, Safari, or Edge.');
  }
  
  if (!checks.https && window.location.hostname !== 'localhost') {
    issues.push('HTTPS is recommended for Web3 features. Some wallets may not work on HTTP.');
  }

  return {
    checks,
    issues,
    isCompatible: issues.length === 0,
    recommendations: [
      'Install MetaMask extension for Ethereum support',
      'Install Phantom extension for Solana support',
      'Use a modern browser (Chrome, Firefox, Safari, Edge)',
      'Enable HTTPS in production'
    ]
  };
}

export function getWalletRecommendations() {
  const compatibility = checkBrowserCompatibility();
  
  if (compatibility.checks.ethereum) {
    return {
      primary: 'MetaMask',
      secondary: 'Phantom (for Solana)',
      status: 'Ready to connect'
    };
  } else if (compatibility.checks.solana) {
    return {
      primary: 'Phantom',
      secondary: 'MetaMask (for Ethereum)',
      status: 'Ready to connect'
    };
  } else {
    return {
      primary: 'Install MetaMask',
      secondary: 'Install Phantom',
      status: 'No wallets detected'
    };
  }
}
