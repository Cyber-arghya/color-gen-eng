/// <reference types="vite/client" />

declare module 'culori' {
  export interface Oklch {
    mode: 'oklch';
    l: number;
    c: number;
    h?: number;
    alpha?: number;
  }
  export interface Rgb {
    mode: 'rgb';
    r: number;
    g: number;
    b: number;
    alpha?: number;
  }
  export interface Hsl {
    mode: 'hsl';
    h?: number;
    s: number;
    l: number;
    alpha?: number;
  }
  export function converter(mode: string): (color: any) => any;
  export function parse(color: string): any;
  export function formatHex8(color: any): string;
  export function formatCss(color: any): string;
  export function oklch(color: any): any;
}
