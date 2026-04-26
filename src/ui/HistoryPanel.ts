import { AppState } from './AppState';

export class HistoryPanel {
  private container: HTMLElement;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container ${containerId} not found`);
    this.container = el;
    
    AppState.getInstance().subscribe(() => this.render());
  }

  render() {
    const state = AppState.getInstance();
    this.container.innerHTML = ''; // Clear out safely

    const title = document.createElement('h3');
    title.className = 'text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3';
    title.textContent = 'Recent Colors';
    this.container.appendChild(title);

    const flexContainer = document.createElement('div');
    flexContainer.className = 'flex flex-wrap gap-2';

    state.history.forEach((hex) => {
      const btn = document.createElement('button');
      btn.className = 'w-8 h-8 rounded-full border border-gray-700 shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white';
      btn.style.backgroundColor = hex;
      btn.title = `Restore ${hex}`;
      
      btn.addEventListener('click', () => {
        // Find main input and update its value to keep UI in sync
        const input = document.getElementById('primary-color-input') as HTMLInputElement;
        if (input) input.value = hex;
        
        state.setPrimaryColor(hex);
      });

      flexContainer.appendChild(btn);
    });

    this.container.appendChild(flexContainer);
  }
}
