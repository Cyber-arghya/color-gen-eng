export interface ColorOutput {
  hex: string;
  rgba: string;
  hsla: string;
}

export interface DesignToken {
  name: string;
  value: ColorOutput;
}

export interface ColorScale {
  [key: string]: ColorOutput; // 50, 100, ..., 900, 950
}

export interface SemanticPalette {
  success: ColorScale;
  error: ColorScale;
  warning: ColorScale;
  info: ColorScale;
}

export interface DesignSystemTokens {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  dataViz: ColorOutput[];
  semantic: SemanticPalette;
}

export interface APCAContrastResult {
  textColor: ColorOutput;
  contrastValue: number;
}
