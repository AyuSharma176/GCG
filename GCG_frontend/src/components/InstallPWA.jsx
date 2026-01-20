import { Download, Smartphone, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show manual install instructions
      alert('To install this app:\n\n' +
            '🖥️ Desktop: Click the ⊕ icon in the address bar\n' +
            '📱 Mobile: Tap browser menu → "Add to Home Screen"\n\n' +
            'Or use your browser\'s install option from the menu!');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
        <Check size={20} />
        <span className="font-medium">App Installed ✓</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 z-50 animate-pulse"
    >
      <Smartphone size={20} />
      <span className="font-medium">Install GCG App</span>
      <Download size={18} className="animate-bounce" />
    </button>
  );
}
