import { PaletteRegistry } from '../engine/PaletteRegistry';
import type { HarmonyType } from '../engine/HarmonyGenerator';
import type { DesignSystemTokens } from '../engine/ColorTypes';

export type Listener = (state: AppState) => void;

export class AppState {
  private static instance: AppState;
  
  public primaryColor: string = '#3B82F6';
  public harmonyRule: HarmonyType = 'complementary';
  public tokens: DesignSystemTokens | null = null;
  public history: string[] = [];
  
  private listeners: Listener[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this);
    }
    this.saveToStorage();
  }

  setPrimaryColor(hex: string) {
    if (this.primaryColor !== hex) {
      this.primaryColor = hex;
      this.regenerateTokens();
    }
  }

  addCurrentToHistory() {
    this.addToHistory(this.primaryColor);
    this.notify();
  }

  setHarmonyRule(rule: HarmonyType) {
    if (this.harmonyRule !== rule) {
      this.harmonyRule = rule;
      this.regenerateTokens();
    }
  }

  regenerateTokens() {
    try {
      this.tokens = PaletteRegistry.generateMatrix(this.primaryColor, this.harmonyRule);
      this.notify();
    } catch (e) {
      console.error('Failed to generate tokens', e);
    }
  }

  private addToHistory(hex: string) {
    // Avoid immediate duplicates
    if (this.history[0] === hex) return;
    
    this.history.unshift(hex);
    if (this.history.length > 12) {
      this.history.pop();
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('color-gen-state');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.primaryColor = parsed.primaryColor || '#3B82F6';
        this.harmonyRule = parsed.harmonyRule || 'complementary';
        this.history = parsed.history || [];
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage');
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('color-gen-state', JSON.stringify({
        primaryColor: this.primaryColor,
        harmonyRule: this.harmonyRule,
        history: this.history
      }));
    } catch (e) {
      console.warn('Failed to save state to localStorage');
    }
  }
}
