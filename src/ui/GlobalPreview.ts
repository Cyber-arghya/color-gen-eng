import { AppState } from './AppState';
import { ClipboardManager } from '../exports/ClipboardManager';
import { ContrastApca } from '../engine/ContrastApca';
import { OklchConverter } from '../engine/OklchConverter';

export class GlobalPreview {
  private container: HTMLElement;
  private isDarkMode: boolean = true; // Theme state

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container ${containerId} not found`);
    this.container = el;

    AppState.getInstance().subscribe(() => {
      requestAnimationFrame(() => this.render());
    });
  }

  private async copyToClipboard(text: string) {
    await ClipboardManager.copy(text);
  }

  render() {
    const state = AppState.getInstance();
    if (!state.tokens) return;

    const tokens = state.tokens;

    // Dynamic Mapping based on Theme State
    const map = this.isDarkMode ? {
      background: tokens.neutral['950'],
      surface: tokens.neutral['900'],
      text: tokens.neutral['50'],
      textMuted: tokens.neutral['400'],
      primary: tokens.primary['500'],
      primaryHover: tokens.primary['400'],
      secondary: tokens.secondary['500'],
      accent: tokens.accent['500']
    } : {
      background: tokens.neutral['50'], // Light Mode Background
      surface: tokens.neutral['100'],   // Light Mode Surface/Card
      text: tokens.neutral['950'],      // Dark Text for Light Mode
      textMuted: tokens.neutral['600'],
      primary: tokens.primary['500'],
      primaryHover: tokens.primary['600'],
      secondary: tokens.secondary['500'],
      accent: tokens.accent['500']
    };

    // Calculate dynamic contrast for buttons
    const primaryText = ContrastApca.getOptimalTextColor(OklchConverter.parseToOklch(map.primary.hex)).textColor.hex;
    const secondaryText = ContrastApca.getOptimalTextColor(OklchConverter.parseToOklch(map.secondary.hex)).textColor.hex;
    const accentText = ContrastApca.getOptimalTextColor(OklchConverter.parseToOklch(map.accent.hex)).textColor.hex;

    this.container.innerHTML = `
      <section class="mb-12 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative transition-colors duration-300">
        <div class="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
            Global Colors & Preview
          </h2>
          
          <button id="theme-toggle-btn" class="px-3 py-1.5 text-sm font-medium bg-gray-800 hover:bg-gray-700 text-white rounded-md border border-gray-700 transition flex items-center gap-2">
            ${this.isDarkMode
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42 1.42"/></svg> Switch to Light'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Switch to Dark'}
          </button>
        </div>
        
        <div class="p-8 md:p-12 transition-colors duration-300" style="background-color: ${map.background.hex}; color: ${map.text.hex};">
          <div class="max-w-3xl mx-auto flex flex-col md:flex-row gap-8">
            
            <div class="flex-1 space-y-6">
              <h1 class="text-4xl md:text-5xl font-black tracking-tight" style="color: ${map.primary.hex}">
                Build faster, design better.
              </h1>
              <p class="text-lg leading-relaxed transition-colors duration-300" style="color: ${map.textMuted.hex}">
                This is a live preview showing how your generated colors interact. The background is using your ${this.isDarkMode ? 'darkest' : 'lightest'} neutral, while the text uses the opposite.
              </p>
              
              <div class="flex flex-wrap gap-4 pt-2">
                <button class="px-6 py-3 rounded-lg font-semibold transition-transform hover:-translate-y-1 shadow-lg" 
                        style="background-color: ${map.primary.hex}; color: ${primaryText}; border: 1px solid ${map.primaryHover.hex}">
                  Primary Action
                </button>
                <button class="px-6 py-3 rounded-lg font-semibold transition-transform hover:-translate-y-1 shadow-lg" 
                        style="background-color: ${map.secondary.hex}; color: ${secondaryText};">
                  Secondary Action
                </button>
              </div>

              <div class="mt-8 p-6 rounded-xl shadow-xl flex items-start gap-4 transition-colors duration-300" 
                   style="background-color: ${map.surface.hex}; border: 1px solid ${this.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}">
                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style="background-color: ${map.accent.hex}; color: ${accentText}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg">Accent Element</h3>
                  <p class="text-sm mt-1 transition-colors duration-300" style="color: ${map.textMuted.hex}">This card uses your "surface" color to stand out against the background.</p>
                </div>
              </div>
            </div>

            <div class="w-full md:w-64 shrink-0 space-y-3">
              <div class="text-sm font-semibold uppercase tracking-wider mb-4 opacity-60">Variables</div>
              
              ${this.createVariableRow('Background', map.background.hex)}
              ${this.createVariableRow('Surface', map.surface.hex)}
              ${this.createVariableRow('Text', map.text.hex)}
              ${this.createVariableRow('Primary', map.primary.hex)}
              ${this.createVariableRow('Secondary', map.secondary.hex)}
              ${this.createVariableRow('Accent', map.accent.hex)}
            </div>

          </div>
        </div>
      </section>
    `;

    // Bind Theme Toggle Event
    const toggleBtn = this.container.querySelector('#theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.isDarkMode = !this.isDarkMode;
        this.render(); // Re-render with new theme
      });
    }

    // Bind copy events
    const rows = this.container.querySelectorAll('.copy-var-btn');
    rows.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const target = e.currentTarget as HTMLElement;
        const hex = target.dataset.hex;
        if (hex) {
          await this.copyToClipboard(hex);
          const icon = target.querySelector('.copy-icon');
          if (icon) {
            const oldSvg = icon.innerHTML;
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            setTimeout(() => icon.innerHTML = oldSvg, 1500);
          }
        }
      });
    });
  }

  private createVariableRow(name: string, hex: string): string {
    const isLightText = this.isDarkMode ? 'text-white' : 'text-gray-900';
    const bgHover = this.isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';
    const border = this.isDarkMode ? 'border-white/5' : 'border-black/5';

    return `
      <div class="flex items-center justify-between p-2 rounded transition border cursor-pointer group copy-var-btn ${bgHover} ${border}" data-hex="${hex}">
        <div class="flex items-center gap-3">
          <div class="w-4 h-4 rounded-full shadow-sm" style="background-color: ${hex}; border: 1px solid rgba(128,128,128,0.2)"></div>
          <span class="text-sm font-medium opacity-90 group-hover:opacity-100 ${isLightText}">${name}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono opacity-50 group-hover:opacity-100 transition ${isLightText}">${hex}</span>
          <span class="copy-icon opacity-0 group-hover:opacity-100 transition text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </span>
        </div>
      </div>
    `;
  }
}