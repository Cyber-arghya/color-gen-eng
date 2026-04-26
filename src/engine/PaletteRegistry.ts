import { OklchConverter } from './OklchConverter';
import { ColorMath } from './ColorMath';
import { HarmonyGenerator, type HarmonyType } from './HarmonyGenerator';
import { DataVizGenerator } from './DataVizGenerator';
import { SemanticGenerator } from './SemanticGenerator';
import type { DesignSystemTokens } from './ColorTypes';

export class PaletteRegistry {
  /**
   * Orchestrates all generators and returns the complete Design System object.
   */
  static generateMatrix(primaryHexOrOklch: string, harmonyRule: HarmonyType = 'complementary'): DesignSystemTokens {
    // 1. Parse base color
    const baseColor = OklchConverter.parseToOklch(primaryHexOrOklch);

    // 2. Generate Primary scale
    const primaryScale = ColorMath.generateScale(baseColor);

    // 3. Generate Neutrals (Hue-shifted towards primary)
    // We drastically reduce chroma, but keep the hue for a psychological tint
    const neutralBase = {
      mode: 'oklch' as const,
      l: baseColor.l,
      c: Math.min(baseColor.c, 0.02), // Clamp chroma to max 0.02 for neutrals
      h: baseColor.h
    };
    const neutralScale = ColorMath.generateScale(neutralBase);

    // 4. Generate Harmonies
    const secondaryScale = HarmonyGenerator.generateSecondary(baseColor, harmonyRule);
    const accentScale = HarmonyGenerator.generateAccent(baseColor, harmonyRule);

    // 5. Generate Semantics & DataViz
    const semantic = SemanticGenerator.generate(baseColor);
    const dataViz = DataVizGenerator.generatePalette(baseColor);

    return {
      primary: primaryScale,
      secondary: secondaryScale,
      accent: accentScale,
      neutral: neutralScale,
      dataViz,
      semantic
    };
  }
}
