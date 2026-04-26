import { formatHex8, type Oklch, converter, parse } from 'culori';
import type { ColorOutput } from './ColorTypes';

// Pre-create converters to save performance
const toRgb = converter('rgb');
const toHsl = converter('hsl');
const toOklch = converter('oklch');

export class OklchConverter {
  /**
   * Parses a color string (HEX, RGB, HSL) into an OKLCH object.
   * Throws an error if the color is invalid.
   */
  static parseToOklch(colorString: string): Oklch {
    // Sanitize input
    const sanitized = colorString.trim();
    const parsed = parse(sanitized);
    
    if (!parsed) {
      throw new Error(`Invalid color format: ${colorString}`);
    }

    const oklchColor = toOklch(parsed);
    if (!oklchColor) {
      throw new Error(`Could not convert color to OKLCH: ${colorString}`);
    }

    // Ensure h is defined (grayscale colors might have undefined hue in culori)
    if (oklchColor.h === undefined) {
      oklchColor.h = 0;
    }

    return oklchColor as Oklch;
  }

  /**
   * Converts an OKLCH color to the required Output Formats
   */
  static getOutputs(color: Oklch): ColorOutput {
    const rgb = toRgb(color);
    const hsl = toHsl(color);
    
    if (!rgb || !hsl) {
      throw new Error('Failed to convert OKLCH to standard formats');
    }

    // Ensure alpha is present
    const alpha = color.alpha !== undefined ? color.alpha : 1;

    // Build standard strings
    const hexOutput = formatHex8({ ...rgb, alpha }).toUpperCase();
    
    // culori formatCss handles rgba/hsla correctly based on alpha
    const rgbaOutput = `rgba(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}, ${alpha})`;
    
    let h = hsl.h || 0;
    if (h < 0) h += 360;
    h = h % 360;
    const s = Math.max(0, Math.min(100, Math.round((hsl.s || 0) * 100)));
    const l = Math.max(0, Math.min(100, Math.round((hsl.l || 0) * 100)));
    const hslaOutput = `hsla(${Math.round(h)}, ${s}%, ${l}%, ${alpha})`;

    return {
      hex: hexOutput,
      rgba: rgbaOutput,
      hsla: hslaOutput
    };
  }
}
