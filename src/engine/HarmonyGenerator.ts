import type { Oklch } from 'culori';
import { ColorMath } from './ColorMath';
import type { ColorScale } from './ColorTypes';

export type HarmonyType = 'analogous' | 'complementary' | 'triadic' | 'split-complementary' | 'tetradic' | 'square';

export class HarmonyGenerator {
  /**
   * Generates a secondary color scale based on the selected harmony rule.
   */
  static generateSecondary(baseColor: Oklch, rule: HarmonyType): ColorScale {
    let shift = 0;
    
    switch (rule) {
      case 'analogous':
        shift = 30; // 30 degrees adjacent
        break;
      case 'complementary':
        shift = 180; // opposite on the wheel
        break;
      case 'triadic':
        shift = 120; // 1/3 around the wheel
        break;
      case 'split-complementary':
        shift = 150;
        break;
      case 'tetradic':
        shift = 60;
        break;
      case 'square':
        shift = 90;
        break;
    }

    const secondaryBase = ColorMath.shiftHue(baseColor, shift);
    return ColorMath.generateScale(secondaryBase);
  }

  /**
   * Generates an accent color scale based on the selected harmony rule.
   */
  static generateAccent(baseColor: Oklch, rule: HarmonyType): ColorScale {
    let shift = 0;
    
    switch (rule) {
      case 'analogous':
        shift = -30; // the other adjacent color
        break;
      case 'complementary':
        // For complementary, we might want a split complementary or just a different lightness/chroma
        // We'll use 150 for a split complementary feel
        shift = 150; 
        break;
      case 'triadic':
        shift = 240; // 2/3 around the wheel
        break;
      case 'split-complementary':
        shift = 210;
        break;
      case 'tetradic':
        shift = 240;
        break;
      case 'square':
        shift = 270;
        break;
    }

    const accentBase = ColorMath.shiftHue(baseColor, shift);
    return ColorMath.generateScale(accentBase);
  }
}
