import type { GridEngine } from './GridEngine';

export class InputManager {
  private container: HTMLElement;
  private engine: GridEngine;
  private currentFocusIndex = 0;
  private boundPointerHandler: (e: PointerEvent) => void;
  private boundKeyHandler: (e: KeyboardEvent) => void;

  constructor(container: HTMLElement, engine: GridEngine) {
    this.container = container;
    this.engine = engine;

    this.boundPointerHandler = this.handlePointerDown.bind(this);
    this.boundKeyHandler = this.handleKeyDown.bind(this);

    this.attach();
  }

  private attach(): void {
    this.container.addEventListener('pointerdown', this.boundPointerHandler as EventListener);
    this.container.addEventListener('keydown', this.boundKeyHandler as EventListener);
  }

  public detach(): void {
    this.container.removeEventListener('pointerdown', this.boundPointerHandler as EventListener);
    this.container.removeEventListener('keydown', this.boundKeyHandler as EventListener);
  }

  private handlePointerDown(e: PointerEvent): void {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-tile-id]');
    if (!target) return;
    const tileId = target.getAttribute('data-tile-id');
    if (tileId) {
      this.engine.clickTile(tileId);
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const buttons = Array.from(this.container.querySelectorAll<HTMLButtonElement>('button[data-tile-id]'));
    if (buttons.length === 0) return;

    const row = Math.floor(this.currentFocusIndex / 10);
    const col = this.currentFocusIndex % 10;
    let nextIndex = this.currentFocusIndex;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = col < 9 ? this.currentFocusIndex + 1 : this.currentFocusIndex - 9;
        e.preventDefault();
        break;
      case 'ArrowLeft':
        nextIndex = col > 0 ? this.currentFocusIndex - 1 : this.currentFocusIndex + 9;
        e.preventDefault();
        break;
      case 'ArrowDown':
        nextIndex = row < 9 ? this.currentFocusIndex + 10 : col;
        e.preventDefault();
        break;
      case 'ArrowUp':
        nextIndex = row > 0 ? this.currentFocusIndex - 10 : 90 + col;
        e.preventDefault();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const activeTileId = buttons[this.currentFocusIndex]?.getAttribute('data-tile-id');
        if (activeTileId) {
          this.engine.clickTile(activeTileId);
        }
        return;
      default:
        return;
    }

    if (nextIndex >= 0 && nextIndex < buttons.length) {
      this.currentFocusIndex = nextIndex;
      buttons[nextIndex]?.focus();
    }
  }

  public setFocusIndex(index: number): void {
    this.currentFocusIndex = Math.max(0, Math.min(99, index));
  }
}
