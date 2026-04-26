import type { Oklch } from 'culori';
import { converter } from 'culori';
import type { APCAContrastResult } from './ColorTypes';
import { OklchConverter } from './OklchConverter';

const toRgb = converter('rgb');

export class ContrastApca {
  /**
   * Calculates luminance (Y) from sRGB color.
   */
  private static getLuminance(r: number, g: number, b: number): number {
    // Math.pow used for approximate sRGB linearisation (APCA standardizes 2.4)
    const rs = Math.pow(Math.max(0, Math.min(1, r)), 2.4);
    const gs = Math.pow(Math.max(0, Math.min(1, g)), 2.4);
    const bs = Math.pow(Math.max(0, Math.min(1, b)), 2.4);
    return rs * 0.2126729 + gs * 0.7151522 + bs * 0.0721750;
  }

  /**
   * APCA core algorithm (Simplified for absolute contrast values)
   */
  private static calculateAPCA(yText: number, yBg: number): number {
    let contrast = 0;
    // Both clamped to minimum luminance to prevent division/math errors at absolute black
    const yB = Math.max(0.022, yBg);
    const yT = Math.max(0.022, yText);

    if (Math.abs(yB - yT) < 0.0005) return 0;

    if (yB > yT) {
      // Dark text on light background
      contrast = (Math.pow(yB, 0.56) - Math.pow(yT, 0.57)) * 1.14;
    } else {
      // Light text on dark background
      contrast = (Math.pow(yB, 0.65) - Math.pow(yT, 0.62)) * 1.14;
    }
    
    // Scale for readability
    return Math.abs(contrast * 100);
  }

  /**
   * Returns the optimal high-contrast text color for a given background
   * Returns extreme dark or extreme light depending on APCA score.
   */
  static getOptimalTextColor(background: Oklch): APCAContrastResult {
    const rgb = toRgb(background);
    if (!rgb) {
      throw new Error("Invalid background color for APCA");
    }

    const yBg = this.getLuminance(rgb.r, rgb.g, rgb.b);
    
    // Y for extreme light (white) and extreme dark (almost black)
    const yWhite = this.getLuminance(1, 1, 1);
    const yBlack = this.getLuminance(0.05, 0.05, 0.05); // slightly off-black for aesthetics

    const contrastWhite = this.calculateAPCA(yWhite, yBg);
    const contrastBlack = this.calculateAPCA(yBlack, yBg);

    const useWhiteText = contrastWhite >= contrastBlack;
    
    // Hardcoded optimal Oklch values for black/white text
    const textOklch: Oklch = useWhiteText 
      ? { mode: 'oklch', l: 1, c: 0, h: 0 } 
      : { mode: 'oklch', l: 0.05, c: 0.01, h: background.h || 0 }; // Inherit hue for dark text

    return {
      textColor: OklchConverter.getOutputs(textOklch),
      contrastValue: Math.max(contrastWhite, contrastBlack)
    };
  }
}
