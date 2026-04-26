import type { DesignSystemTokens, ColorScale } from '../engine/ColorTypes';

export class TailwindExporter {
  static generate(tokens: DesignSystemTokens): string {
    const tailwindTheme = {
      theme: {
        extend: {
          colors: {
            primary: this.mapScale(tokens.primary),
            secondary: this.mapScale(tokens.secondary),
            accent: this.mapScale(tokens.accent),
            neutral: this.mapScale(tokens.neutral),
            success: this.mapScale(tokens.semantic.success),
            warning: this.mapScale(tokens.semantic.warning),
            error: this.mapScale(tokens.semantic.error),
            info: this.mapScale(tokens.semantic.info),
            dataviz: tokens.dataViz.reduce((acc, color, i) => {
              acc[`${i + 1}`] = color.hex;
              return acc;
            }, {} as Record<string, string>)
          }
        }
      }
    };

    return `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(tailwindTheme, null, 2)};`;
  }

  private static mapScale(scale: ColorScale): Record<string, string> {
    const mapped: Record<string, string> = {};
    for (const [step, color] of Object.entries(scale)) {
      mapped[step] = color.hex;
    }
    return mapped;
  }
}
