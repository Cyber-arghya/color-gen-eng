import type { Oklch } from 'culori';
import { ColorMath } from './ColorMath';
import type { SemanticPalette, ColorScale } from './ColorTypes';

export class SemanticGenerator {
  /**
   * Generates Success, Error, Warning, and Info scales.
   * Matches the brand's Chroma intensity while forcing standard semantic hues.
   */
  static generate(baseColor: Oklch): SemanticPalette {
    // Standard semantic hues in OKLCH
    const HUES = {
      success: 145, // Green
      error: 25,    // Red
      warning: 75,  // Yellow/Orange
      info: 245     // Blue
    };

    // We take the base color's chroma to match the brand intensity,
    // but ensure a minimum chroma so semantics don't become gray if brand is gray.
    const targetChroma = Math.max(0.15, baseColor.c);

    // We don't want to use the base L exactly, because semantic colors
    // usually look best around L=0.6 for their '500' step.
    const targetL = 0.6;

    const generateSemanticScale = (hue: number): ColorScale => {
      const semanticBase: Oklch = {
        mode: 'oklch',
        l: targetL,
        c: targetChroma,
        h: hue
      };
      return ColorMath.generateScale(semanticBase);
    };

    return {
      success: generateSemanticScale(HUES.success),
      error: generateSemanticScale(HUES.error),
      warning: generateSemanticScale(HUES.warning),
      info: generateSemanticScale(HUES.info)
    };
  }
}
