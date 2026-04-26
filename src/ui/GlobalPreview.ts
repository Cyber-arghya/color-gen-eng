import { AppState } from './AppState';
import { ClipboardManager } from '../exports/ClipboardManager';
import { ContrastApca } from '../engine/ContrastApca';
import { OklchConverter } from '../engine/OklchConverter';

export class GlobalPreview {
  private container: HTMLElement;

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
    // Could integrate the toast here via a custom event, but for now simple logging is okay,
    // or we can rely on visual feedback on the button itself.
  }

  render() {
    const state = AppState.getInstance();
    if (!state.tokens) return;

    const tokens = state.tokens;
    
    // Explicit Mapping for Global Variables (Dark Mode Assumption)
    const map = {
      background: tokens.neutral['950'],
      surface: tokens.neutral['900'],
      text: tokens.neutral['50'],
      textMuted: tokens.neutral['400'],
      primary: tokens.primary['500'],
      primaryHover: tokens.primary['400'],
      secondary: tokens.secondary['500'],
      accent: tokens.accent['500']
    };

    // Calculate dynamic contrast for buttons
    const primaryOklch = OklchConverter.parseToOklch(map.primary.hex);
    const primaryText = ContrastApca.getOptimalTextColor(primaryOklch).textColor.hex;

    const secondaryOklch = OklchConverter.parseToOklch(map.secondary.hex);
    const secondaryText = ContrastApca.getOptimalTextColor(secondaryOklch).textColor.hex;

    const accentOklch = OklchConverter.parseToOklch(map.accent.hex);
    const accentText = ContrastApca.getOptimalTextColor(accentOklch).textColor.hex;

    this.container.innerHTML = `
      <section class="mb-12 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div class="p-4 bg-gray-900 border-b border-gray-800">
          <h2 class="text-xl font-bold text-gray-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
            Global Colors & Preview
          </h2>
          <p class="text-sm text-gray-400 mt-1">Recommended mapping for your Design System variables.</p>
        </div>
        
        <!-- UI Preview Canvas -->
        <div class="p-8 md:p-12" style="background-color: ${map.background.hex}; color: ${map.text.hex};">
          <div class="max-w-3xl mx-auto flex flex-col md:flex-row gap-8">
            
            <!-- Mock Content -->
            <div class="flex-1 space-y-6">
              <h1 class="text-4xl md:text-5xl font-black tracking-tight" style="color: ${map.primary.hex}">
                Build faster, design better.
              </h1>
              <p class="text-lg leading-relaxed" style="color: ${map.textMuted.hex}">
                This is a live preview showing how your generated colors interact. The background is using your darkest neutral, while the text uses the lightest. Buttons are perfectly contrasted.
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

              <!-- Mini Card on Surface -->
              <div class="mt-8 p-6 rounded-xl border border-white/5 shadow-xl flex items-start gap-4" style="background-color: ${map.surface.hex}">
                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style="background-color: ${map.accent.hex}; color: ${accentText}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg">Accent Element</h3>
                  <p class="text-sm mt-1" style="color: ${map.textMuted.hex}">This card uses your "surface" color (neutral-900) to stand out against the background (neutral-950).</p>
                </div>
              </div>
            </div>

            <!-- Explicit Variable Mapping -->
            <div class="w-full md:w-64 shrink-0 space-y-3">
              <div class="text-sm font-semibold uppercase tracking-wider mb-4 opacity-60">Variables</div>
              
              ${this.createVariableRow('Background', map.background.hex)}
              ${this.createVariableRow('Text', map.text.hex)}
              ${this.createVariableRow('Primary', map.primary.hex)}
              ${this.createVariableRow('Secondary', map.secondary.hex)}
              ${this.createVariableRow('Accent', map.accent.hex)}
            </div>

          </div>
        </div>
      </section>
    `;

    // Bind copy events for the variable rows
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
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            setTimeout(() => icon.innerHTML = oldSvg, 1500);
          }
        }
      });
    });
  }

  private createVariableRow(name: string, hex: string): string {
    return `
      <div class="flex items-center justify-between p-2 rounded bg-black/20 hover:bg-black/40 transition border border-white/5 cursor-pointer group copy-var-btn" data-hex="${hex}">
        <div class="flex items-center gap-3">
          <div class="w-4 h-4 rounded-full shadow-sm" style="background-color: ${hex}; border: 1px solid rgba(255,255,255,0.2)"></div>
          <span class="text-sm font-medium opacity-90 group-hover:opacity-100">${name}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono opacity-50 group-hover:opacity-100 transition">${hex}</span>
          <span class="copy-icon opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </span>
        </div>
      </div>
    `;
  }
}
