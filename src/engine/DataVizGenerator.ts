import type { Oklch } from 'culori';
import { OklchConverter } from './OklchConverter';
import type { ColorOutput } from './ColorTypes';

export class DataVizGenerator {
  /**
   * Generates 6 highly distinct categorical colors using the Golden Angle.
   * Maintains harmony with the primary brand by anchoring to its L and C.
   */
  static generatePalette(baseColor: Oklch): ColorOutput[] {
    const GOLDEN_ANGLE = 137.5; // Mathematical golden angle for max distinctness
    const count = 6;
    const palette: ColorOutput[] = [];

    // Optimize lightness/chroma for dataviz visibility
    const vizL = Math.max(0.5, Math.min(0.7, baseColor.l)); 
    const vizC = Math.max(0.12, baseColor.c); 

    for (let i = 0; i < count; i++) {
      const shift = i * GOLDEN_ANGLE;
      const stepColor: Oklch = {
        mode: 'oklch',
        l: vizL,
        c: vizC,
        h: (baseColor.h || 0) + shift
      };

      // Ensure h is mapped 0-360 internally by Math if needed, 
      // but OklchConverter / culori handles >360 fine.
      palette.push(OklchConverter.getOutputs(stepColor));
    }

    return palette;
  }
}
