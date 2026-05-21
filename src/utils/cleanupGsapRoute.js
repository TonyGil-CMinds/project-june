'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function cleanupGsapRoute(root) {
  if (!root) return;

  ScrollTrigger.getAll().forEach((trigger) => {
    const triggerElement = trigger.trigger;
    const pinElement = trigger.pin;
    const belongsToRoot =
      (triggerElement && root.contains(triggerElement)) ||
      (pinElement && root.contains(pinElement));

    if (belongsToRoot) {
      trigger.kill(true);
    }
  });

  gsap.killTweensOf(root);
  gsap.killTweensOf(root.querySelectorAll('*'));
}
