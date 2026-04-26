import type { Oklch } from 'culori';
import { OklchConverter } from './OklchConverter';
import { ScaleGenerator } from './ScaleGenerator';
import type { ColorScale } from './ColorTypes';

export class ColorMath {
  /**
   * Adjusts the hue of an OKLCH color by a specific degree shift.
   */
  static shiftHue(color: Oklch, degree: number): Oklch {
    const currentHue = color.h === undefined ? 0 : color.h;
    let newHue = (currentHue + degree) % 360;
    if (newHue < 0) newHue += 360;

    return {
      ...color,
      h: newHue,
    };
  }

  /**
   * Generates a full 50-950 color scale from a single base OKLCH color.
   */
  static generateScale(baseColor: Oklch): ColorScale {
    const scale: ColorScale = {};
    const lightnessSteps = ScaleGenerator.generateLightnessScale();
    
    // Ensure hue is preserved even for near-grayscale inputs if possible
    const h = baseColor.h === undefined ? 0 : baseColor.h;

    // We consider the baseColor's chroma as the peak (at step 500)
    // If the provided base is very light or dark, its chroma might be low. 
    // Ideally, the base color should be normalized, but here we take its c directly.
    const baseC = baseColor.c;

    for (const [stepKey, lValue] of Object.entries(lightnessSteps)) {
      const stepNum = parseInt(stepKey, 10);
      const cValue = ScaleGenerator.getChromaForStep(baseC, stepNum);

      const stepOklch: Oklch = {
        mode: 'oklch',
        l: lValue,
        c: cValue,
        h: h
      };

      scale[stepKey] = OklchConverter.getOutputs(stepOklch);
    }

    return scale;
  }
}
