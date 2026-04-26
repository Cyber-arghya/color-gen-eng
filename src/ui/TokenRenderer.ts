import { AppState } from './AppState';
import { ContrastApca } from '../engine/ContrastApca';
import { OklchConverter } from '../engine/OklchConverter';
import { ClipboardManager } from '../exports/ClipboardManager';
import type { ColorScale, ColorOutput } from '../engine/ColorTypes';

export class TokenRenderer {
  private container: HTMLElement;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container ${containerId} not found`);
    this.container = el;
    
    AppState.getInstance().subscribe(() => {
      // Use requestAnimationFrame to batch DOM updates
      requestAnimationFrame(() => this.render());
    });
  }

  private createSwatch(name: string, color: ColorOutput): HTMLElement {
    const swatch = document.createElement('div');
    swatch.className = 'flex flex-col justify-end p-4 rounded-xl shadow-lg relative overflow-hidden group min-h-[140px] transition-transform hover:-translate-y-1';
    swatch.style.backgroundColor = color.hex;

    // Calculate APCA contrast for text
    const oklch = OklchConverter.parseToOklch(color.hex);
    const textColors = ContrastApca.getOptimalTextColor(oklch);
    swatch.style.color = textColors.textColor.hex;

    // Name label
    const nameLabel = document.createElement('div');
    nameLabel.className = 'font-bold text-lg mb-auto z-10 transition-opacity group-hover:opacity-0';
    nameLabel.textContent = name;
    swatch.appendChild(nameLabel);

    // Formats container (hidden by default, shown on hover with solid background)
    const formats = document.createElement('div');
    formats.className = 'absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white p-3 z-20 backdrop-blur-sm';
    
    // Label for the name inside hover state
    const hoverName = document.createElement('div');
    hoverName.className = 'font-bold text-sm text-gray-400 mb-1';
    hoverName.textContent = name;
    formats.appendChild(hoverName);

    const createCopyBtn = (val: string) => {
      const btn = document.createElement('button');
      btn.className = 'text-[11px] font-mono bg-white/10 hover:bg-white/20 border border-white/10 rounded px-2 py-1.5 w-full text-left truncate transition-colors flex justify-between items-center focus:outline-none';
      btn.innerHTML = `<span class="truncate pr-2">${val}</span> <svg class="opacity-50 shrink-0" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
      
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await ClipboardManager.copy(val);
        const originalBg = btn.style.backgroundColor;
        btn.style.backgroundColor = '#16a34a'; // green-600
        setTimeout(() => btn.style.backgroundColor = originalBg, 400);
      });
      return btn;
    };

    formats.appendChild(createCopyBtn(color.hex));
    formats.appendChild(createCopyBtn(color.rgba));
    formats.appendChild(createCopyBtn(color.hsla));

    swatch.appendChild(formats);

    return swatch;
  }

  private renderScale(title: string, scale: ColorScale, fragment: DocumentFragment) {
    const section = document.createElement('section');
    section.className = 'mb-12';

    const h2 = document.createElement('h2');
    h2.className = 'text-2xl font-bold mb-6 capitalize border-b border-gray-800 pb-2 text-gray-200';
    h2.textContent = title;
    section.appendChild(h2);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-4';

    const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    steps.forEach(step => {
      if (scale[step]) {
        grid.appendChild(this.createSwatch(step, scale[step]));
      }
    });

    section.appendChild(grid);
    fragment.appendChild(section);
  }

  private renderPaletteList(title: string, colors: ColorOutput[], fragment: DocumentFragment) {
    const section = document.createElement('section');
    section.className = 'mb-12';

    const h2 = document.createElement('h2');
    h2.className = 'text-2xl font-bold mb-6 capitalize border-b border-gray-800 pb-2 text-gray-200';
    h2.textContent = title;
    section.appendChild(h2);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4';

    colors.forEach((color, i) => {
      grid.appendChild(this.createSwatch(`Color ${i + 1}`, color));
    });

    section.appendChild(grid);
    fragment.appendChild(section);
  }

  render() {
    const state = AppState.getInstance();
    if (!state.tokens) return;

    const fragment = document.createDocumentFragment();

    this.renderScale('Primary', state.tokens.primary, fragment);
    this.renderScale('Neutral', state.tokens.neutral, fragment);
    this.renderScale(`Secondary (${state.harmonyRule})`, state.tokens.secondary, fragment);
    this.renderScale(`Accent (${state.harmonyRule})`, state.tokens.accent, fragment);
    
    this.renderScale('Success', state.tokens.semantic.success, fragment);
    this.renderScale('Warning', state.tokens.semantic.warning, fragment);
    this.renderScale('Error', state.tokens.semantic.error, fragment);
    this.renderScale('Info', state.tokens.semantic.info, fragment);

    this.renderPaletteList('Data Visualization', state.tokens.dataViz, fragment);

    this.container.innerHTML = '';
    this.container.appendChild(fragment);
  }
}
