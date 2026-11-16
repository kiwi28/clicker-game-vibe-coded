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
const SPAWN_PADDING = 100;
const SPAWN_PADDING_BOTTOM = 200;
const MIN_GAP = 160;

const state: GameState = {
  mame: 0,
  mamePerSec: 0,
  kg: 0,
};

let clickCount = 0;

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
const clickZone = byId('click-zone');

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

interface FloatPoint {
  left: number;
  top: number;
}

function pickPosition(parent: HTMLElement, avoid: FloatPoint | null): FloatPoint {
  const width = parent.clientWidth;
  const height = parent.clientHeight;
  const minX = SPAWN_PADDING;
  const maxX = Math.max(width - SPAWN_PADDING, minX);
  const minY = SPAWN_PADDING;
  const maxY = Math.max(height - SPAWN_PADDING_BOTTOM, minY);

  let point: FloatPoint = { left: minX, top: minY };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    point = {
      left: minX + Math.random() * (maxX - minX),
      top: minY + Math.random() * (maxY - minY),
    };
    if (avoid === null || Math.hypot(point.left - avoid.left, point.top - avoid.top) >= MIN_GAP) {
      break;
    }
  }
  return point;
}

function spawnFloat(parent: HTMLElement, text: string, kind: 'roast' | 'gain', at: FloatPoint): void {
  const element = document.createElement('span');
  element.className = kind === 'roast' ? 'float float--roast' : 'float float--gain';
  element.textContent = text;
  element.style.left = `${at.left.toString()}px`;
  element.style.top = `${at.top.toString()}px`;
  parent.appendChild(element);
  element.addEventListener('animationend', () => element.remove());
}

function spawnRoast(parent: HTMLElement, at: FloatPoint): void {
  const text = ROASTS[Math.floor(Math.random() * ROASTS.length)] ?? 'maică-ta';
  spawnFloat(parent, text, 'roast', at);
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
  clickCount += 1;
  state.kg += 1;
  const stage = getStage(state.kg);
  const gain = BASE_CLICK_POWER * bonusMultiplier(stage.stage);
  state.mame += gain;

  const gainPosition = pickPosition(clickZone, null);
  if (clickCount % 3 === 0) {
    spawnRoast(clickZone, pickPosition(clickZone, gainPosition));
  }
  spawnFloat(clickZone, `+${formatGain(gain)} Mame`, 'gain', gainPosition);
  render();
});

setupTabs();
render();
