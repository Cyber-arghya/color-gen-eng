import type { DesignSystemTokens, ColorScale } from '../engine/ColorTypes';

export class CssExporter {
  static generate(tokens: DesignSystemTokens): string {
    let css = `/* Design Infrastructure Engine - Auto Generated CSS Tokens */\n\n`;
    
    // Light Mode (:root)
    css += `:root {\n`;
    css += this.generateScaleVars('primary', tokens.primary);
    css += this.generateScaleVars('secondary', tokens.secondary);
    css += this.generateScaleVars('accent', tokens.accent);
    css += this.generateScaleVars('neutral', tokens.neutral);
    
    css += this.generateScaleVars('success', tokens.semantic.success);
    css += this.generateScaleVars('warning', tokens.semantic.warning);
    css += this.generateScaleVars('error', tokens.semantic.error);
    css += this.generateScaleVars('info', tokens.semantic.info);

    tokens.dataViz.forEach((color, i) => {
      css += `  --color-dataviz-${i + 1}: ${color.hex};\n`;
    });
    
    css += `}\n\n`;
    
    // We could potentially generate dark mode specific overrides here if needed,
    // but the engine currently generates a single universal scale 50-950
    // where 50-400 are light, and 500-950 are dark surfaces.
    // If we wanted to invert for .dark, we'd do it here.

    return css;
  }

  private static generateScaleVars(prefix: string, scale: ColorScale): string {
    let vars = `  /* ${prefix.toUpperCase()} */\n`;
    for (const [step, color] of Object.entries(scale)) {
      vars += `  --color-${prefix}-${step}: ${color.hex};\n`;
    }
    return vars + '\n';
  }
}
