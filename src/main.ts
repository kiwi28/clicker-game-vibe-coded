import './style.css';
import { bonusMultiplier, getStage, scaleFactor } from './fatness';

interface GameState {
  mame: number;
  mamePerSec: number;
  kg: number;
}

const ROASTS: readonly string[] = [
  'maică-ta',
  "da' ce zici mă",
  'câte kg?',
  'stai să sun pe maică-ta',
];

const BASE_CLICK_POWER = 1;

const state: GameState = {
  mame: 0,
  mamePerSec: 0,
  kg: 0,
};

function byId(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (element === null) throw new Error(`Missing element #${id}`);
  return element;
}

const mameValue = byId('mame-value');
const mpsValue = byId('mps-value');
const kgValue = byId('kg-value');
const mom = byId('mom');
const momEmoji = byId('mom-emoji');
const stageLabel = byId('stage-label');
const stageBonus = byId('stage-bonus');

function formatGain(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
}

function render(): void {
  const stage = getStage(state.kg);
  const bonus = bonusMultiplier(stage.stage);

  mameValue.textContent = Math.floor(state.mame).toString();
  mpsValue.textContent = Math.floor(state.mamePerSec).toString();
  kgValue.textContent = state.kg.toString();

  momEmoji.textContent = stage.emoji;
  momEmoji.style.setProperty('--mom-scale', scaleFactor(stage.stage).toString());
  stageLabel.textContent = stage.title;
  stageBonus.textContent = `+${Math.round((bonus - 1) * 100)}% click`;
}

function spawnFloat(parent: HTMLElement, text: string, kind: 'roast' | 'gain'): void {
  const element = document.createElement('span');
  element.className = kind === 'roast' ? 'float float--roast' : 'float float--gain';
  element.textContent = text;
  element.style.left = `${(40 + Math.random() * 40).toString()}%`;
  parent.appendChild(element);
  element.addEventListener('animationend', () => element.remove());
}

function spawnRoast(parent: HTMLElement): void {
  const text = ROASTS[Math.floor(Math.random() * ROASTS.length)] ?? 'maică-ta';
  spawnFloat(parent, text, 'roast');
}

function setupTabs(): void {
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.tab'));
  const panels = Array.from(document.querySelectorAll<HTMLElement>('.tab-panel'));
  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (target === undefined) return;
      for (const candidate of tabs) candidate.classList.toggle('is-active', candidate === tab);
      for (const panel of panels)
        panel.classList.toggle('is-active', panel.dataset.panel === target);
    });
  }
}

mom.addEventListener('click', () => {
  state.kg += 1;
  const stage = getStage(state.kg);
  const gain = BASE_CLICK_POWER * bonusMultiplier(stage.stage);
  state.mame += gain;
  spawnRoast(mom);
  spawnFloat(mom, `+${formatGain(gain)} Mame`, 'gain');
  render();
});

setupTabs();
render();
