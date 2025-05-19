import React from 'react';
import { IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons-react';

function MobileOverlay() {
  return (
    <div className="fixed inset-0 z-[1000] bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-bounce mb-6">
        <IconDeviceMobile className="w-16 h-16 text-primary" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Hey!</h1>
      
      <p className="text-lg mb-8 max-w-md">
        For the best experience, please use a desktop or laptop computer to access Habit Tracker.
      </p>
      
      <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
        <IconDeviceDesktop className="w-8 h-8 text-primary" />
        <div className="text-left">
          <p className="font-medium">Recommended:</p>
          <p className="text-sm text-muted-foreground">Desktop resolution 1280×720 or higher</p>
        </div>
      </div>
    </div>
  );
}

export default MobileOverlay;
