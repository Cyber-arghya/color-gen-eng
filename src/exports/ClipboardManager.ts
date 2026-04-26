export class ClipboardManager {
  /**
   * Copies text to clipboard securely with a fallback mechanism.
   */
  static async copy(text: string): Promise<boolean> {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Modern clipboard copy failed', err);
      }
    }

    // Fallback for older browsers or non-secure contexts
    return this.fallbackCopy(text);
  }

  private static fallbackCopy(text: string): boolean {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Move out of screen to avoid scrolling
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    } catch (err) {
      console.error('Fallback clipboard copy failed', err);
      textArea.remove();
      return false;
    }
  }
}
