import type { DesignSystemTokens, ColorScale } from '../engine/ColorTypes';

export class W3cTokenExporter {
  static generate(tokens: DesignSystemTokens): string {
    const root: Record<string, any> = {};

    root['color'] = {
      primary: this.mapScale(tokens.primary),
      secondary: this.mapScale(tokens.secondary),
      accent: this.mapScale(tokens.accent),
      neutral: this.mapScale(tokens.neutral),
      semantic: {
        success: this.mapScale(tokens.semantic.success),
        warning: this.mapScale(tokens.semantic.warning),
        error: this.mapScale(tokens.semantic.error),
        info: this.mapScale(tokens.semantic.info),
      },
      dataviz: tokens.dataViz.reduce((acc, color, i) => {
        acc[`${i + 1}`] = {
          $type: 'color',
          $value: color.hex
        };
        return acc;
      }, {} as Record<string, any>)
    };

    return JSON.stringify(root, null, 2);
  }

  private static mapScale(scale: ColorScale): Record<string, any> {
    const mapped: Record<string, any> = {};
    for (const [step, color] of Object.entries(scale)) {
      mapped[step] = {
        $type: 'color',
        $value: color.hex
      };
    }
    return mapped;
  }
}
