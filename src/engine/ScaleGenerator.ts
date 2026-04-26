export class ScaleGenerator {
  /**
   * Generates a non-linear lightness scale for 50-950 Tailwind steps.
   * Utilizes a bezier-like easing to provide smoother transitions
   * and avoid muddy mid-tones.
   */
  static generateLightnessScale(): Record<number, number> {
    // Target lightness values in OKLCH (0-1 scale)
    // Non-linear adjustments: darker shades are compressed, lighter shades have subtle drops
    return {
      50:  0.98,
      100: 0.95,
      200: 0.90,
      300: 0.82,
      400: 0.72,
      500: 0.60, // The mathematical center for perception
      600: 0.50,
      700: 0.40,
      800: 0.30,
      900: 0.20,
      950: 0.14,
    };
  }

  /**
   * Computes the chroma (saturation) dynamically for a specific step.
   * "Dynamic Saturation Clamping": Dark mode surfaces (800, 900, 950) 
   * need saturation injected but mathematically clamped.
   */
  static getChromaForStep(baseChroma: number, step: number): number {
    const maxChroma = baseChroma;

    // Lighter steps decrease saturation slightly to stay clean
    if (step < 500) {
      const factor = 1 - ((500 - step) / 500) * 0.4; // up to 40% reduction at step 50
      return maxChroma * factor;
    } 
    
    // Base step
    if (step === 500) {
      return maxChroma;
    }

    // Dark steps: we need to clamp the saturation aggressively
    // to prevent eye strain on dark surfaces.
    if (step > 500) {
      // For 800, 900, 950: inject 5-10% of base hue -> which means chroma is ~ 5-10% of max
      // However, we transition smoothly
      let factor = 1;
      if (step === 600) factor = 0.85;
      else if (step === 700) factor = 0.65;
      else if (step === 800) factor = 0.40;
      else if (step === 900) factor = 0.20;
      else if (step === 950) factor = 0.10;

      return maxChroma * factor;
    }

    return maxChroma;
  }
}
