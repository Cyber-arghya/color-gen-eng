export class MainLayout {
  /**
   * Initializes the DOM structure inside the root element
   */
  static build(rootId: string) {
    const root = document.getElementById(rootId);
    if (!root) throw new Error(`Root element #${rootId} not found`);

    // Pure DOM manipulation for building structure
    root.innerHTML = ''; // Start clean
    
    const wrapper = document.createElement('div');
    wrapper.className = 'min-h-screen flex flex-col md:flex-row bg-gray-950 text-gray-100 font-sans';

    // Sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'w-full md:w-80 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-8 shrink-0 overflow-y-auto';

    // Header
    const header = document.createElement('div');
    const logo = document.createElement('h1');
    logo.className = 'text-xl font-black bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent';
    logo.textContent = 'Design Infra Engine';
    header.appendChild(logo);
    sidebar.appendChild(header);

    // Controls Panel
    const controls = document.createElement('div');
    controls.className = 'flex flex-col gap-6';

    // Color Input
    const inputGroup = document.createElement('div');
    const inputLabel = document.createElement('label');
    inputLabel.className = 'block text-sm font-medium text-gray-400 mb-2';
    inputLabel.textContent = 'Base Brand Color';
    
    const colorInputWrapper = document.createElement('div');
    colorInputWrapper.className = 'flex items-center gap-3 bg-gray-800 p-2 rounded-lg border border-gray-700 focus-within:border-blue-500 transition-colors';
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'primary-color-input';
    colorInput.className = 'w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0';
    
    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.id = 'primary-hex-input';
    hexInput.className = 'bg-transparent border-none outline-none text-white font-mono uppercase flex-1';
    hexInput.maxLength = 7;
    
    colorInputWrapper.appendChild(colorInput);
    colorInputWrapper.appendChild(hexInput);
    inputGroup.appendChild(inputLabel);
    inputGroup.appendChild(colorInputWrapper);
    controls.appendChild(inputGroup);

    // Harmony Select
    const harmonyGroup = document.createElement('div');
    const harmonyLabel = document.createElement('label');
    harmonyLabel.className = 'block text-sm font-medium text-gray-400 mb-2';
    harmonyLabel.textContent = 'Harmony Rule';
    
    const harmonySelect = document.createElement('select');
    harmonySelect.id = 'harmony-select';
    harmonySelect.className = 'w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer';
    
    ['complementary', 'analogous', 'triadic'].forEach(rule => {
      const option = document.createElement('option');
      option.value = rule;
      option.textContent = rule.charAt(0).toUpperCase() + rule.slice(1);
      harmonySelect.appendChild(option);
    });
    
    harmonyGroup.appendChild(harmonyLabel);
    harmonyGroup.appendChild(harmonySelect);
    controls.appendChild(harmonyGroup);

    // Export Buttons Area
    const exportGroup = document.createElement('div');
    exportGroup.id = 'export-panel';
    exportGroup.className = 'flex flex-col gap-2 mt-4';
    const exportLabel = document.createElement('label');
    exportLabel.className = 'block text-sm font-medium text-gray-400 mb-2';
    exportLabel.textContent = 'Export Design System';
    exportGroup.appendChild(exportLabel);
    // Export buttons will be injected by AppOrchestrator
    controls.appendChild(exportGroup);

    sidebar.appendChild(controls);

    // History Panel Container
    const historyContainer = document.createElement('div');
    historyContainer.id = 'history-panel';
    historyContainer.className = 'mt-auto pt-8 border-t border-gray-800';
    sidebar.appendChild(historyContainer);

    // Main Content
    const main = document.createElement('main');
    main.className = 'flex-1 p-6 md:p-12 overflow-y-auto bg-[#0a0a0c]';
    
    const previewContainer = document.createElement('div');
    previewContainer.id = 'global-preview';
    previewContainer.className = 'max-w-7xl mx-auto';
    main.appendChild(previewContainer);

    const tokenContainer = document.createElement('div');
    tokenContainer.id = 'token-renderer';
    tokenContainer.className = 'max-w-7xl mx-auto';
    main.appendChild(tokenContainer);

    wrapper.appendChild(sidebar);
    wrapper.appendChild(main);
    
    // Toast Container
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-6 right-6 flex flex-col gap-2 z-50';
    wrapper.appendChild(toastContainer);

    root.appendChild(wrapper);
  }
}
