import React, { useEffect } from 'react';

export default function DisableCopy() {
  useEffect(() => {
    const onCopy = (e) => {
      e.preventDefault();
      // optional: show brief feedback for kiosk users
      // console.log('copy prevented');
    };

    const onContext = (e) => {
      e.preventDefault();
    };

    const onDragStart = (e) => {
      e.preventDefault();
    };

    const onKeyDown = (e) => {
      // block common copy/inspect/save shortcuts
      const key = e.key || '';
      const ctrl = e.ctrlKey || e.metaKey;

      // block Ctrl/Cmd+C, Ctrl/Cmd+U (view source), Ctrl/Cmd+S (save), Ctrl+Shift+I (devtools), F12
      if (ctrl && (key.toLowerCase() === 'c' || key.toLowerCase() === 'u' || key.toLowerCase() === 's')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if ((e.ctrlKey && e.shiftKey && (key === 'I' || key === 'i')) || key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    };

    document.addEventListener('copy', onCopy);
    document.addEventListener('contextmenu', onContext);
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('keydown', onKeyDown);

    // add a body class so CSS can disable selection
    document.body.classList.add('no-select');

    return () => {
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('contextmenu', onContext);
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('no-select');
    };
  }, []);

  return null;
}
