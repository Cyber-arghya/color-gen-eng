import { AppState } from './AppState';
import { MainLayout } from './MainLayout';
import { GlobalPreview } from './GlobalPreview';
import { TokenRenderer } from './TokenRenderer';
import { HistoryPanel } from './HistoryPanel';
import type { HarmonyType } from '../engine/HarmonyGenerator';
import { ClipboardManager } from '../exports/ClipboardManager';
import { CssExporter } from '../exports/CssExporter';
import { TailwindExporter } from '../exports/TailwindExporter';
import { W3cTokenExporter } from '../exports/W3cTokenExporter';

export class AppOrchestrator {
  initialize() {
    // 1. Build the DOM structure
    MainLayout.build('app');

    // 2. Initialize Components
    const state = AppState.getInstance();
    new GlobalPreview('global-preview');
    new TokenRenderer('token-renderer');
    new HistoryPanel('history-panel');

    // 3. Bind Events
    this.bindInputs(state);
    
    // We bind exports
    this.bindExports(state);

    // 4. Initial Render Trigger
    // Sync initial state to inputs
    const colorInput = document.getElementById('primary-color-input') as HTMLInputElement;
    const hexInput = document.getElementById('primary-hex-input') as HTMLInputElement;
    const harmonySelect = document.getElementById('harmony-select') as HTMLSelectElement;
    
    if (colorInput) colorInput.value = state.primaryColor;
    if (hexInput) hexInput.value = state.primaryColor;
    if (harmonySelect) harmonySelect.value = state.harmonyRule;

    state.regenerateTokens();
  }

  private bindInputs(state: AppState) {
    const colorInput = document.getElementById('primary-color-input') as HTMLInputElement;
    const hexInput = document.getElementById('primary-hex-input') as HTMLInputElement;
    const harmonySelect = document.getElementById('harmony-select') as HTMLSelectElement;

    if (colorInput && hexInput) {
      colorInput.addEventListener('input', (e) => {
        const val = (e.target as HTMLInputElement).value;
        hexInput.value = val.toUpperCase();
        state.setPrimaryColor(val);
      });

      hexInput.addEventListener('input', (e) => {
        let val = (e.target as HTMLInputElement).value;
        if (!val.startsWith('#')) val = '#' + val;
        
        // Basic hex regex
        if (/^#[0-9A-F]{6}$/i.test(val)) {
          colorInput.value = val;
          state.setPrimaryColor(val);
        }
      });
    }

    if (harmonySelect) {
      harmonySelect.addEventListener('change', (e) => {
        const val = (e.target as HTMLSelectElement).value as HarmonyType;
        state.setHarmonyRule(val);
      });
    }
  }

  private bindExports(state: AppState) {
    const exportPanel = document.getElementById('export-panel');
    if (!exportPanel) return;

    const createBtn = (label: string, exporter: (tokens: any) => string) => {
      const btn = document.createElement('button');
      btn.className = 'bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors rounded-lg px-4 py-2 text-sm font-medium text-left flex items-center justify-between group';
      
      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      
      const icon = document.createElement('span');
      icon.className = 'text-gray-500 group-hover:text-white transition-colors';
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      
      btn.appendChild(labelSpan);
      btn.appendChild(icon);

      btn.addEventListener('click', async () => {
        if (!state.tokens) return;
        const result = exporter(state.tokens);
        const success = await ClipboardManager.copy(result);
        if (success) {
          this.showToast(`Copied ${label}!`);
        } else {
          this.showToast(`Failed to copy ${label}.`, true);
        }
      });

      return btn;
    };

    exportPanel.appendChild(createBtn('CSS Variables', CssExporter.generate.bind(CssExporter)));
    exportPanel.appendChild(createBtn('Tailwind Config', TailwindExporter.generate.bind(TailwindExporter)));
    exportPanel.appendChild(createBtn('W3C Tokens', W3cTokenExporter.generate.bind(W3cTokenExporter)));
  }

  private showToast(message: string, isError = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded shadow-lg text-white text-sm transform transition-all duration-300 translate-y-0 opacity-100 flex items-center gap-2 ${isError ? 'bg-red-600' : 'bg-green-600'}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Animate out
    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
}
