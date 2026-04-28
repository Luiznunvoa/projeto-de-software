import { type GameObjects } from 'phaser';

import { ResponsiveScene, type SceneSize } from './base/ResponsiveScene';
import { SceneKey } from './SceneKeys';

// ─── Palette ────────────────────────────────────────────────────────────────

const PLAYER_COLORS = [
  { hex: '#2ecc71', num: 0x2ecc71, name: 'Verde' },
  { hex: '#3498db', num: 0x3498db, name: 'Azul' },
  { hex: '#e74c3c', num: 0xe74c3c, name: 'Vermelho' },
  { hex: '#9b59b6', num: 0x9b59b6, name: 'Roxo' },
  { hex: '#e67e22', num: 0xe67e22, name: 'Laranja' },
  { hex: '#1abc9c', num: 0x1abc9c, name: 'Ciano' }
] as const;

type ColorEntry = (typeof PLAYER_COLORS)[number];

const UI = {
  bg: 0x1a1a2e,
  panel: 0x16213e,
  border: 0x8b7355,
  borderHover: 0xd4a855,
  btnPrimary: 0x2d5a27,
  btnPrimaryHover: 0x3d7a35,
  btnPrimaryDisabled: 0x1a3018,
  btnSecondary: 0x2a2a3e,
  btnSecondaryHover: 0x3a3a5e,
  title: '#d4a855',
  titleStroke: '#1a0a00',
  text: '#f5deb3',
  textMuted: '#7a8a6a',
  white: '#ffffff'
} as const;

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;

const nullArray = (length: number): (string | null)[] =>
  Array.from({ length }).map(() => null) as (string | null)[];

// ─── Internal types ─────────────────────────────────────────────────────────

export interface GameSetupData {
  playerCount: number;
  colors: string[]; // hex por slot
}

interface SwatchGroup {
  circles: GameObjects.Arc[];
  borders: GameObjects.Arc[];
  slotIndex: number;
}

interface PlayerRow {
  label: GameObjects.Text;
  swatchGroup: SwatchGroup;
}

interface StepButton {
  bg: GameObjects.Rectangle;
  border: GameObjects.Rectangle;
  label: GameObjects.Text;
}

interface ActionButton {
  bg: GameObjects.Rectangle;
  border: GameObjects.Rectangle;
  label: GameObjects.Text;
}

// ─── Scene ──────────────────────────────────────────────────────────────────

export class GameSetup extends ResponsiveScene {
  // state
  private playerCount = 2;
  private selectedColors: (string | null)[] = nullArray(MAX_PLAYERS);

  // ui refs — title area
  private titleText?: GameObjects.Text;
  private backdrop?: GameObjects.Rectangle;
  private decorTop?: GameObjects.Rectangle;
  private decorBot?: GameObjects.Rectangle;

  // ui refs — player count selector
  private countLabel?: GameObjects.Text;
  private btnMinus?: StepButton;
  private btnPlus?: StepButton;

  // ui refs — player rows
  private playerRows: PlayerRow[] = [];

  // ui refs — action buttons
  private btnStart?: ActionButton;
  private btnBack?: ActionButton;

  // font guard
  private fontsReady = false;

  constructor() {
    super(SceneKey.GameSetup);
  }

  preload() {
    this.load.setPath('assets');
  }

  // ── helpers ──────────────────────────────────────────────────────────────

  private get allColorsChosen(): boolean {
    return this.selectedColors.slice(0, this.playerCount).every((c) => c !== null);
  }

  private isColorTaken(hex: string, excludeSlot: number): boolean {
    return this.selectedColors.some((c, i) => i !== excludeSlot && c === hex);
  }

  // ── build helpers ─────────────────────────────────────────────────────────

  private makeStepButton(x: number, y: number, label: string, onClick: () => void): StepButton {
    const size = 40;
    const border = this.add.rectangle(x, y, size + 4, size + 4, UI.border).setDepth(10);
    const bg = this.add
      .rectangle(x, y, size, size, UI.btnSecondary)
      .setDepth(11)
      .setInteractive({ useHandCursor: true });
    const text = this.add
      .text(x, y, label, { fontFamily: '"Jersey 10", monospace', fontSize: 26, color: UI.text })
      .setOrigin(0.5)
      .setDepth(12);

    bg.on('pointerover', () => {
      bg.setFillStyle(UI.btnSecondaryHover);
      border.setFillStyle(UI.borderHover);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(UI.btnSecondary);
      border.setFillStyle(UI.border);
    });
    bg.on('pointerup', onClick);

    return { bg, border, label: text };
  }

  private makeActionButton(
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    isPrimary: boolean,
    onClick: () => void
  ): ActionButton {
    const bgColor = isPrimary ? UI.btnPrimary : UI.btnSecondary;
    const bgHover = isPrimary ? UI.btnPrimaryHover : UI.btnSecondaryHover;

    const border = this.add.rectangle(x, y, w + 4, h + 4, UI.border).setDepth(10);
    const bg = this.add
      .rectangle(x, y, w, h, bgColor)
      .setDepth(11)
      .setInteractive({ useHandCursor: true });
    const text = this.add
      .text(x, y, label, {
        fontFamily: '"Jersey 10", monospace',
        fontSize: Math.floor(h * 0.45),
        color: UI.text
      })
      .setOrigin(0.5)
      .setDepth(12);

    bg.on('pointerover', () => {
      if (isPrimary && !this.allColorsChosen) return;
      bg.setFillStyle(bgHover);
      border.setFillStyle(UI.borderHover);
      text.setColor(UI.white);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(bgColor);
      border.setFillStyle(UI.border);
      text.setColor(UI.text);
    });
    bg.on('pointerup', () => {
      if (isPrimary && !this.allColorsChosen) return;
      this.tweens.add({
        targets: [bg, border, text],
        scaleX: 0.97,
        scaleY: 0.97,
        duration: 60,
        yoyo: true,
        ease: 'Sine.easeInOut',
        onComplete: onClick
      });
    });

    return { bg, border, label: text };
  }

  private makeSwatchGroup(slotIndex: number, x: number, y: number, radius: number): SwatchGroup {
    const gap = radius * 2 + 10;
    const totalW = PLAYER_COLORS.length * gap - 10;
    const startX = x - totalW / 2 + radius;

    const borders: GameObjects.Arc[] = [];
    const circles: GameObjects.Arc[] = [];

    PLAYER_COLORS.forEach((color, ci) => {
      const cx = startX + ci * gap;
      const borderCirc = this.add.circle(cx, y, radius + 3, UI.border).setDepth(10);
      const circ = this.add
        .circle(cx, y, radius, color.num)
        .setDepth(11)
        .setInteractive({ useHandCursor: true });

      circ.on('pointerup', () => this.onSwatchClick(slotIndex, color, circ, borderCirc));
      circ.on('pointerover', () => {
        if (!this.isColorTaken(color.hex, slotIndex)) {
          borderCirc.setFillStyle(UI.borderHover);
        }
      });
      circ.on('pointerout', () => {
        if (this.selectedColors[slotIndex] !== color.hex) {
          borderCirc.setFillStyle(UI.border);
        }
      });

      borders.push(borderCirc);
      circles.push(circ);
    });

    return { circles, borders, slotIndex };
  }

  private onSwatchClick(
    slotIndex: number,
    color: ColorEntry,
    _circ: GameObjects.Arc,
    _border: GameObjects.Arc
  ): void {
    if (this.isColorTaken(color.hex, slotIndex)) return;

    this.selectedColors[slotIndex] = color.hex;
    this.refreshSwatches();
    this.refreshStartButton();
  }

  // ── refresh ───────────────────────────────────────────────────────────────

  private refreshSwatches(): void {
    this.playerRows.forEach((row, slotIndex) => {
      if (slotIndex >= this.playerCount) return;
      const { circles, borders } = row.swatchGroup;
      PLAYER_COLORS.forEach((color, ci) => {
        const isSelected = this.selectedColors[slotIndex] === color.hex;
        const isTaken = this.isColorTaken(color.hex, slotIndex);
        circles[ci].setAlpha(isTaken ? 0.25 : 1);
        borders[ci].setFillStyle(isSelected ? UI.borderHover : UI.border);
        borders[ci].setAlpha(isTaken ? 0.25 : 1);
      });
    });
  }

  private refreshStartButton(): void {
    if (!this.btnStart) return;
    const ready = this.allColorsChosen;
    this.btnStart.bg.setFillStyle(ready ? UI.btnPrimary : UI.btnPrimaryDisabled);
    this.btnStart.label.setColor(ready ? UI.text : UI.textMuted);
  }

  private refreshCountLabel(): void {
    this.countLabel?.setText(String(this.playerCount));
  }

  private showRows(): void {
    this.playerRows.forEach((row, i) => {
      const visible = i < this.playerCount;
      row.label.setVisible(visible);
      row.swatchGroup.circles.forEach((c) => c.setVisible(visible));
      row.swatchGroup.borders.forEach((b) => b.setVisible(visible));

      // reset color for hidden slots
      if (!visible && this.selectedColors[i] !== null) {
        this.selectedColors[i] = null;
        this.refreshSwatches();
        this.refreshStartButton();
      }
    });
  }

  // ── layout (responsive) ──────────────────────────────────────────────────

  private layout(W: number, H: number): void {
    if (!this.fontsReady) return;

    this.backdrop?.setPosition(0, 0).setSize(W, H).setOrigin(0, 0);
    this.decorTop
      ?.setPosition(0, 0)
      .setSize(W, Math.max(4, H * 0.008))
      .setOrigin(0, 0);
    this.decorBot
      ?.setPosition(0, H)
      .setSize(W, Math.max(4, H * 0.008))
      .setOrigin(0, 1);

    const titleSize = Math.max(32, Math.min(72, Math.floor(W * 0.065)));
    this.titleText?.setPosition(W * 0.5, H * 0.1).setFontSize(titleSize);

    // player count selector
    const selectorY = H * 0.22;
    const stepSize = 40;
    const countFontSize = Math.max(22, Math.min(36, Math.floor(W * 0.03)));
    this.btnMinus?.bg.setPosition(W * 0.5 - 70, selectorY).setSize(stepSize, stepSize);
    this.btnMinus?.border.setPosition(W * 0.5 - 70, selectorY).setSize(stepSize + 4, stepSize + 4);
    this.btnMinus?.label.setPosition(W * 0.5 - 70, selectorY);
    this.btnPlus?.bg.setPosition(W * 0.5 + 70, selectorY).setSize(stepSize, stepSize);
    this.btnPlus?.border.setPosition(W * 0.5 + 70, selectorY).setSize(stepSize + 4, stepSize + 4);
    this.btnPlus?.label.setPosition(W * 0.5 + 70, selectorY);
    this.countLabel?.setPosition(W * 0.5, selectorY).setFontSize(countFontSize);

    // player rows
    const rowStartY = H * 0.33;
    const rowHeight = Math.max(46, Math.min(62, Math.floor(H * 0.09)));
    const swatchR = Math.max(12, Math.min(18, Math.floor(rowHeight * 0.28)));
    const labelX = W * 0.18;
    const swatchCenterX = W * 0.62;

    this.playerRows.forEach((row, i) => {
      const y = rowStartY + i * (rowHeight + 10);
      row.label
        .setPosition(labelX, y)
        .setFontSize(Math.max(18, Math.min(26, Math.floor(rowHeight * 0.42))));

      const gap = swatchR * 2 + 10;
      const totalW = PLAYER_COLORS.length * gap - 10;
      const startX = swatchCenterX - totalW / 2 + swatchR;

      row.swatchGroup.circles.forEach((c, ci) =>
        c.setPosition(startX + ci * gap, y).setRadius(swatchR)
      );
      row.swatchGroup.borders.forEach((b, ci) =>
        b.setPosition(startX + ci * gap, y).setRadius(swatchR + 3)
      );
    });

    // action buttons
    const btnW = Math.min(300, Math.floor(W * 0.3));
    const btnH = Math.max(42, Math.min(56, Math.floor(H * 0.07)));
    const btnY = H * 0.9;
    const gap = btnW + 20;

    this.btnBack?.bg.setPosition(W * 0.5 - gap / 2, btnY).setSize(btnW, btnH);
    this.btnBack?.border.setPosition(W * 0.5 - gap / 2, btnY).setSize(btnW + 4, btnH + 4);
    this.btnBack?.label.setPosition(W * 0.5 - gap / 2, btnY).setFontSize(Math.floor(btnH * 0.45));

    this.btnStart?.bg.setPosition(W * 0.5 + gap / 2, btnY).setSize(btnW, btnH);
    this.btnStart?.border.setPosition(W * 0.5 + gap / 2, btnY).setSize(btnW + 4, btnH + 4);
    this.btnStart?.label.setPosition(W * 0.5 + gap / 2, btnY).setFontSize(Math.floor(btnH * 0.45));
  }

  // ── lifecycle ─────────────────────────────────────────────────────────────

  protected onSceneCreate(): void {
    this.cameras.main.setBackgroundColor('#1a1a2e');
    this.playerCount = 2;
    this.selectedColors = nullArray(MAX_PLAYERS);

    // destroy previous display objects so re-entering the scene starts clean
    this.children.removeAll(true);
    this.playerRows = [];
    this.fontsReady = false;
    this.titleText = undefined;
    this.backdrop = undefined;
    this.decorTop = undefined;
    this.decorBot = undefined;
    this.countLabel = undefined;
    this.btnMinus = undefined;
    this.btnPlus = undefined;
    this.btnStart = undefined;
    this.btnBack = undefined;

    const W = this.scale.gameSize.width;
    const H = this.scale.gameSize.height;

    this.backdrop = this.add.rectangle(0, 0, W, H, UI.bg).setOrigin(0, 0).setDepth(0);
    this.decorTop = this.add.rectangle(0, 0, W, 6, UI.border).setOrigin(0, 0).setDepth(5);
    this.decorBot = this.add.rectangle(0, H, W, 6, UI.border).setOrigin(0, 1).setDepth(5);

    const fontLoads = [
      document.fonts.load('64px "Maverly Pixel"'),
      document.fonts.load('32px "Jersey 10"')
    ];

    void Promise.all(fontLoads).then(() => {
      this.fontsReady = true;
      const { width: cW, height: cH } = this.scale.gameSize;

      // title
      this.titleText = this.add
        .text(cW * 0.5, cH * 0.1, 'Configurar Partida', {
          fontFamily: '"Maverly Pixel", Arial Black, sans-serif',
          fontSize: 56,
          color: UI.title,
          stroke: UI.titleStroke,
          strokeThickness: 8,
          align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(20);

      // subtitle label for player count
      this.add
        .text(cW * 0.5, cH * 0.17, 'Número de Jogadores', {
          fontFamily: '"Jersey 10", monospace',
          fontSize: 22,
          color: UI.textMuted,
          align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(20);

      // count selector
      this.btnMinus = this.makeStepButton(cW * 0.5 - 70, cH * 0.22, '−', () => {
        if (this.playerCount <= MIN_PLAYERS) return;
        this.playerCount--;
        this.refreshCountLabel();
        this.showRows();
        this.refreshSwatches();
        this.refreshStartButton();
      });

      this.countLabel = this.add
        .text(cW * 0.5, cH * 0.22, String(this.playerCount), {
          fontFamily: '"Jersey 10", monospace',
          fontSize: 30,
          color: UI.text,
          align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(12);

      this.btnPlus = this.makeStepButton(cW * 0.5 + 70, cH * 0.22, '+', () => {
        if (this.playerCount >= MAX_PLAYERS) return;
        this.playerCount++;
        this.refreshCountLabel();
        this.showRows();
        this.refreshSwatches();
        this.refreshStartButton();
      });

      // player rows (all 6, shown/hidden per playerCount)
      this.playerRows = [];
      const rowStartY = cH * 0.33;
      const rowHeight = 54;
      const swatchR = 15;
      const swatchCenterX = cW * 0.62;

      for (let i = 0; i < MAX_PLAYERS; i++) {
        const y = rowStartY + i * (rowHeight + 10);

        const label = this.add
          .text(cW * 0.18, y, `Jogador ${i + 1}`, {
            fontFamily: '"Jersey 10", monospace',
            fontSize: 22,
            color: UI.text
          })
          .setOrigin(0, 0.5)
          .setDepth(20)
          .setVisible(i < this.playerCount);

        const swatchGroup = this.makeSwatchGroup(i, swatchCenterX, y, swatchR);
        swatchGroup.circles.forEach((c) => c.setVisible(i < this.playerCount));
        swatchGroup.borders.forEach((b) => b.setVisible(i < this.playerCount));

        this.playerRows.push({ label, swatchGroup });
      }

      // action buttons
      this.btnBack = this.makeActionButton(
        cW * 0.5 - 160,
        cH * 0.9,
        280,
        50,
        'Voltar',
        false,
        () => {
          this.scene.start(SceneKey.MainMenu);
        }
      );

      this.btnStart = this.makeActionButton(
        cW * 0.5 + 160,
        cH * 0.9,
        280,
        50,
        'Iniciar',
        true,
        () => {
          if (!this.allColorsChosen) return;
          const data: GameSetupData = {
            playerCount: this.playerCount,
            colors: this.selectedColors.slice(0, this.playerCount) as string[]
          };
          this.scene.start(SceneKey.Board, data);
        }
      );

      this.refreshStartButton();
      this.requestRelayout();
    });
  }

  protected onSceneResize(gameSize: SceneSize): void {
    this.layout(gameSize.width, gameSize.height);
  }
}
