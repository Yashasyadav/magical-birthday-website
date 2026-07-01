import gsap from 'gsap';

class CameraDirector {
  constructor() {
    this.idleTween = null;
    this.directorTimeline = null;
  }

  // Starts organic, multi-axis handheld breathing of the camera container
  startBreathing(cameraElement) {
    if (this.idleTween) this.idleTween.kill();

    // Create an organic multi-stage random breathing loop
    this.idleTween = gsap.timeline({ repeat: -1, yoyo: true });

    this.idleTween.to(cameraElement, {
      x: '+=5',
      y: '-=3',
      rotationZ: 0.18,
      rotationX: 1.2,
      rotationY: -0.8,
      scale: 1.008,
      duration: 4.5,
      ease: 'sine.inOut',
    }, 0);

    this.idleTween.to(cameraElement, {
      x: '-=3',
      y: '+=2',
      rotationZ: -0.12,
      rotationX: -0.8,
      rotationY: 1.0,
      scale: 0.996,
      duration: 5.2,
      ease: 'sine.inOut',
    }, 4.5);
  }

  stopBreathing() {
    if (this.idleTween) {
      this.idleTween.kill();
      this.idleTween = null;
    }
  }

  // Follow the balloons rising upward and then return focus back to the scene
  animateBalloonTracking(cameraElement, callbacks = {}) {
    const { onFollow, onReturn } = callbacks;

    if (this.directorTimeline) this.directorTimeline.kill();
    this.stopBreathing();

    this.directorTimeline = gsap.timeline();

    // 1. Zoom in and tilt camera up to trace balloons ascending into sky
    this.directorTimeline.to(cameraElement, {
      y: -160,
      scale: 1.04,
      rotationX: -12, // Tilt up
      duration: 3.8,
      ease: 'power2.inOut',
      onStart: () => {
        if (onFollow) onFollow();
      }
    }, 0);

    // 2. Slow hold at the peak
    this.directorTimeline.to(cameraElement, {
      y: -180,
      duration: 1.4,
      ease: 'sine.inOut'
    }, 3.8);

    // 3. Pan and zoom back to center on envelope
    this.directorTimeline.to(cameraElement, {
      y: 0,
      scale: 1.0,
      rotationX: 0,
      duration: 4.2,
      ease: 'power3.inOut',
      onComplete: () => {
        this.startBreathing(cameraElement);
        if (onReturn) onReturn();
      }
    }, 5.2);
  }

  // Dolly and tilt coordinates to focus on specific phases (e.g. envelope-opening vs letter rise)
  focusScene(cameraElement, targetStyles, duration = 3.5, ease = 'power2.out') {
    this.stopBreathing();
    
    const { scale, rotationX, rotationY, y, x } = targetStyles;

    gsap.to(cameraElement, {
      scale: scale !== undefined ? scale : 1,
      rotationX: rotationX !== undefined ? rotationX : 0,
      rotationY: rotationY !== undefined ? rotationY : 0,
      y: y !== undefined ? y : 0,
      x: x !== undefined ? x : 0,
      duration: duration,
      ease: ease,
      onComplete: () => {
        // Re-enable ambient breathing overlaying the new base coordinates
        this.startBreathing(cameraElement);
      }
    });
  }

  // Quick dolly zoom
  dollyZoom(cameraElement, scaleValue, durationValue = 4) {
    gsap.to(cameraElement, {
      scale: scaleValue,
      duration: durationValue,
      ease: 'sine.inOut'
    });
  }

  cleanup() {
    this.stopBreathing();
    if (this.directorTimeline) {
      this.directorTimeline.kill();
      this.directorTimeline = null;
    }
  }
}

export default new CameraDirector();
