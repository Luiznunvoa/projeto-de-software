import { type GameObjects } from 'phaser';

import { GameState, type IGameConfig } from '@/game/state/game';
import { GameFlagId } from '@/types/flags';
import { RegionId } from '@/types/region';

import { ResponsiveScene, type SceneSize } from './base/ResponsiveScene';
import { type GameSetupData } from './GameSetup';
import { SceneKey } from './SceneKeys';

import type { ICard } from '@/types/card';
import type { FlagsDefinitions } from '@/types/flags';
import type { RegionsDefinitions } from '@/types/region';

// ─── Region layout (center positions, normalized 0..1) ───────────────────────

const REGION_LAYOUT: Record<RegionId, { nx: number; ny: number; color: number; label: string }> = {
  [RegionId.Forest]: { nx: 0.28, ny: 0.28, color: 0x2d6a2d, label: 'Floresta' },
  [RegionId.Mountain]: { nx: 0.5, ny: 0.15, color: 0x6b6b6b, label: 'Montanha' },
  [RegionId.Desert]: { nx: 0.72, ny: 0.28, color: 0xc8a84b, label: 'Deserto' },
  [RegionId.Swamp]: { nx: 0.28, ny: 0.62, color: 0x4a6741, label: 'Pântano' },
  [RegionId.Plains]: { nx: 0.5, ny: 0.72, color: 0x8fbc45, label: 'Planícies' },
  [RegionId.Sea]: { nx: 0.72, ny: 0.62, color: 0x1a5f8a, label: 'Mar' }
};

// ─── Static game data ─────────────────────────────────────────────────────────

const REGIONS_DEFINITION: RegionsDefinitions = {
  [RegionId.Forest]: {
    id: RegionId.Forest,
    adjacentRegions: [RegionId.Mountain, RegionId.Swamp, RegionId.Plains],
    controlTokens: [],
    tokenLimit: 3,
    bandSize: 3
  },
  [RegionId.Mountain]: {
    id: RegionId.Mountain,
    adjacentRegions: [RegionId.Forest, RegionId.Desert, RegionId.Plains],
    controlTokens: [],
    tokenLimit: 3,
    bandSize: 4
  },
  [RegionId.Desert]: {
    id: RegionId.Desert,
    adjacentRegions: [RegionId.Mountain, RegionId.Sea, RegionId.Plains],
    controlTokens: [],
    tokenLimit: 3,
    bandSize: 3
  },
  [RegionId.Swamp]: {
    id: RegionId.Swamp,
    adjacentRegions: [RegionId.Forest, RegionId.Plains, RegionId.Sea],
    controlTokens: [],
    tokenLimit: 2,
    bandSize: 2
  },
  [RegionId.Plains]: {
    id: RegionId.Plains,
    adjacentRegions: [
      RegionId.Forest,
      RegionId.Mountain,
      RegionId.Desert,
      RegionId.Swamp,
      RegionId.Sea
    ],
    controlTokens: [],
    tokenLimit: 4,
    bandSize: 2
  },
  [RegionId.Sea]: {
    id: RegionId.Sea,
    adjacentRegions: [RegionId.Desert, RegionId.Swamp, RegionId.Plains],
    controlTokens: [],
    tokenLimit: 2,
    bandSize: 3
  }
};

const FLAG_DEFINITIONS: FlagsDefinitions = {
  [GameFlagId.DragonFury]: {
    id: GameFlagId.DragonFury,
    name: 'Dragon Fury',
    description: 'The dragon rages across the land.'
  },
  [GameFlagId.ScorchedLand]: {
    id: GameFlagId.ScorchedLand,
    name: 'Scorched Land',
    description: 'The earth is left barren.'
  },
  [GameFlagId.ArcaneStorm]: {
    id: GameFlagId.ArcaneStorm,
    name: 'Arcane Storm',
    description: 'Magic surges unpredictably.'
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegionGraphic {
  hex: GameObjects.Graphics;
  nameLabel: GameObjects.Text;
  sizeLabel: GameObjects.Text;
  regionId: RegionId;
}

interface PlayerPanel {
  bg: GameObjects.Rectangle;
  colorSwatch: GameObjects.Rectangle;
  nameLabel: GameObjects.Text;
  handLabel: GameObjects.Text;
}

const UI = {
  bg: 0x1a1a2e,
  boardBg: 0x12122a,
  border: 0x8b7355,
  borderHover: 0xd4a855,
  panelBg: 0x16213e,
  hexStroke: 0xd4a855,
  hexStrokeWidth: 2,
  deckBg: 0x1e2a1e,
  deckBorder: 0x8b7355,
  title: '#d4a855',
  text: '#f5deb3',
  textMuted: '#7a8a6a',
  turnActive: '#2ecc71',
  white: '#ffffff'
} as const;

// ─── Scene ────────────────────────────────────────────────────────────────────

export class GameBoard extends ResponsiveScene {
  private gameState?: GameState;
  private setupData?: GameSetupData;

  // ui
  private backdrop?: GameObjects.Rectangle;
  private boardArea?: GameObjects.Rectangle;
  private regionGraphics: RegionGraphic[] = [];
  private playerPanels: PlayerPanel[] = [];
  private deckBg?: GameObjects.Rectangle;
  private deckBorder?: GameObjects.Rectangle;
  private deckLabel?: GameObjects.Text;
  private deckCount?: GameObjects.Text;
  private turnLabel?: GameObjects.Text;
  private phaseLabel?: GameObjects.Text;
  private btnBack?: {
    bg: GameObjects.Rectangle;
    border: GameObjects.Rectangle;
    label: GameObjects.Text;
  };

  private fontsReady = false;

  constructor() {
    super(SceneKey.Board);
  }

  preload(): void {
    this.load.setPath('assets');
    this.load.json('cards', 'cards.json');
  }

  // ── hex drawing ───────────────────────────────────────────────────────────

  private drawHex(
    gfx: GameObjects.Graphics,
    cx: number,
    cy: number,
    r: number,
    fillColor: number
  ): void {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    gfx.clear();
    gfx.fillStyle(fillColor, 1);
    gfx.beginPath();
    gfx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) gfx.lineTo(pts[i].x, pts[i].y);
    gfx.closePath();
    gfx.fillPath();
    gfx.lineStyle(UI.hexStrokeWidth, UI.hexStroke, 1);
    gfx.strokePath();
  }

  // ── layout helpers ────────────────────────────────────────────────────────

  private boardRect(W: number, H: number) {
    const panelW = Math.min(220, W * 0.22);
    return { x: 0, y: 50, w: W - panelW, h: H - 50, panelW };
  }

  private layout(W: number, H: number): void {
    if (!this.fontsReady || !this.gameState) return;

    this.backdrop?.setPosition(0, 0).setSize(W, H).setOrigin(0, 0);

    const { x: bx, y: by, w: bw, h: bh, panelW } = this.boardRect(W, H);
    this.boardArea?.setPosition(bx, by).setSize(bw, bh).setOrigin(0, 0);

    // turn / phase header
    const headerH = 50;
    this.turnLabel?.setPosition(bw * 0.35, headerH / 2);
    this.phaseLabel?.setPosition(bw * 0.65, headerH / 2);

    // hexagon regions
    const hexR = Math.min(bw, bh) * 0.13;
    for (const rg of this.regionGraphics) {
      const layout = REGION_LAYOUT[rg.regionId];
      const cx = bx + layout.nx * bw;
      const cy = by + layout.ny * bh;
      const region = REGIONS_DEFINITION[rg.regionId];
      this.drawHex(rg.hex, cx, cy, hexR, REGION_LAYOUT[rg.regionId].color);
      rg.nameLabel
        .setPosition(cx, cy - hexR * 0.15)
        .setFontSize(Math.max(12, Math.floor(hexR * 0.28)));
      rg.sizeLabel
        .setPosition(cx, cy + hexR * 0.35)
        .setFontSize(Math.max(10, Math.floor(hexR * 0.22)))
        .setText(`min: ${region.bandSize}`);
    }

    // player panels (right column)
    const panelX = W - panelW;
    const panelSlotH = (H - 50) / Math.max(1, this.playerPanels.length);
    this.playerPanels.forEach((p, i) => {
      const py = 50 + i * panelSlotH;
      p.bg.setPosition(panelX, py).setSize(panelW, panelSlotH).setOrigin(0, 0);
      p.colorSwatch.setPosition(panelX + 14, py + panelSlotH / 2).setSize(18, 18);
      p.nameLabel
        .setPosition(panelX + 38, py + panelSlotH * 0.35)
        .setFontSize(Math.max(13, Math.floor(panelW * 0.11)));
      p.handLabel
        .setPosition(panelX + 38, py + panelSlotH * 0.65)
        .setFontSize(Math.max(11, Math.floor(panelW * 0.09)));
    });

    // deck widget (bottom-left of board area)
    const dw = 90;
    const dh = 110;
    const dx = bx + 18;
    const dy = by + bh - dh - 14;
    this.deckBorder
      ?.setPosition(dx - 2, dy - 2)
      .setSize(dw + 4, dh + 4)
      .setOrigin(0, 0);
    this.deckBg?.setPosition(dx, dy).setSize(dw, dh).setOrigin(0, 0);
    this.deckLabel?.setPosition(dx + dw / 2, dy + dh * 0.3).setFontSize(12);
    this.deckCount?.setPosition(dx + dw / 2, dy + dh * 0.65).setFontSize(28);

    // back button
    this.btnBack?.border.setPosition(bw - 70, 25).setSize(124, 34);
    this.btnBack?.bg.setPosition(bw - 70, 25).setSize(120, 30);
    this.btnBack?.label.setPosition(bw - 70, 25).setFontSize(16);
  }

  // ── build scene ───────────────────────────────────────────────────────────

  private buildScene(W: number, H: number): void {
    const state = this.gameState!;

    // backdrop
    this.backdrop = this.add.rectangle(0, 0, W, H, UI.bg).setOrigin(0, 0).setDepth(0);
    const { w: bw, panelW } = this.boardRect(W, H);
    this.boardArea = this.add
      .rectangle(0, 50, W - panelW, H - 50, UI.boardBg)
      .setOrigin(0, 0)
      .setDepth(1);

    // header: turn + phase
    const currentPlayer = state.players[state.currentTurn.playerId];
    this.turnLabel = this.add
      .text(bw * 0.35, 25, `Vez de: ${currentPlayer.name}`, {
        fontFamily: '"Jersey 10", monospace',
        fontSize: 20,
        color: UI.turnActive
      })
      .setOrigin(0.5)
      .setDepth(30);

    this.phaseLabel = this.add
      .text(bw * 0.65, 25, `Fase: ${state.currentTurn.phase}`, {
        fontFamily: '"Jersey 10", monospace',
        fontSize: 18,
        color: UI.text
      })
      .setOrigin(0.5)
      .setDepth(30);

    // region hexagons
    this.regionGraphics = [];
    for (const regionId of Object.values(RegionId)) {
      const gfx = this.add.graphics().setDepth(10);
      const nameLabel = this.add
        .text(0, 0, REGION_LAYOUT[regionId].label, {
          fontFamily: '"Jersey 10", monospace',
          fontSize: 14,
          color: UI.white,
          align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(11);
      const sizeLabel = this.add
        .text(0, 0, '', {
          fontFamily: '"Jersey 10", monospace',
          fontSize: 11,
          color: UI.text,
          align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(11);
      this.regionGraphics.push({ hex: gfx, nameLabel, sizeLabel, regionId });
    }

    // player panels
    this.playerPanels = [];
    for (const player of state.players) {
      const hexColor = parseInt(player.color.replace('#', ''), 16);
      const bg = this.add
        .rectangle(W - 200, 50, 200, 80, UI.panelBg)
        .setOrigin(0, 0)
        .setDepth(20);
      const colorSwatch = this.add.rectangle(0, 0, 18, 18, hexColor).setDepth(21);
      const nameLabel = this.add
        .text(0, 0, player.name, {
          fontFamily: '"Jersey 10", monospace',
          fontSize: 16,
          color: UI.text
        })
        .setOrigin(0, 0.5)
        .setDepth(21);
      const handLabel = this.add
        .text(0, 0, `Mão: ${player.hand.length}`, {
          fontFamily: '"Jersey 10", monospace',
          fontSize: 13,
          color: UI.textMuted
        })
        .setOrigin(0, 0.5)
        .setDepth(21);
      this.playerPanels.push({ bg, colorSwatch, nameLabel, handLabel });
    }

    // deck widget
    this.deckBorder = this.add.rectangle(0, 0, 94, 114, UI.deckBorder).setOrigin(0, 0).setDepth(20);
    this.deckBg = this.add.rectangle(0, 0, 90, 110, UI.deckBg).setOrigin(0, 0).setDepth(21);
    this.deckLabel = this.add
      .text(0, 0, 'DECK', {
        fontFamily: '"Jersey 10", monospace',
        fontSize: 12,
        color: UI.textMuted,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(22);
    this.deckCount = this.add
      .text(0, 0, String(state.table.deck.length), {
        fontFamily: '"Jersey 10", monospace',
        fontSize: 28,
        color: UI.title,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(22);

    // back button
    const bbBorder = this.add.rectangle(0, 0, 124, 34, UI.border).setDepth(30);
    const bbBg = this.add
      .rectangle(0, 0, 120, 30, 0x2a2a3e)
      .setDepth(31)
      .setInteractive({ useHandCursor: true });
    const bbLabel = this.add
      .text(0, 0, 'Voltar', {
        fontFamily: '"Jersey 10", monospace',
        fontSize: 16,
        color: UI.text
      })
      .setOrigin(0.5)
      .setDepth(32);

    bbBg.on('pointerover', () => {
      bbBg.setFillStyle(0x3a3a5e);
      bbBorder.setFillStyle(UI.borderHover);
    });
    bbBg.on('pointerout', () => {
      bbBg.setFillStyle(0x2a2a3e);
      bbBorder.setFillStyle(UI.border);
    });
    bbBg.on('pointerup', () => {
      this.scene.start(SceneKey.GameSetup);
    });

    this.btnBack = { bg: bbBg, border: bbBorder, label: bbLabel };
  }

  // ── lifecycle ─────────────────────────────────────────────────────────────

  protected onSceneCreate(data?: object): void {
    // cleanup on re-entry
    this.children.removeAll(true);
    this.regionGraphics = [];
    this.playerPanels = [];
    this.fontsReady = false;
    this.gameState = undefined;
    this.backdrop = undefined;
    this.boardArea = undefined;
    this.deckBg = undefined;
    this.deckBorder = undefined;
    this.deckLabel = undefined;
    this.deckCount = undefined;
    this.turnLabel = undefined;
    this.phaseLabel = undefined;
    this.btnBack = undefined;

    this.cameras.main.setBackgroundColor('#1a1a2e');
    this.setupData = data as GameSetupData;

    const fontLoads = [
      document.fonts.load('32px "Maverly Pixel"'),
      document.fonts.load('24px "Jersey 10"')
    ];

    void Promise.all(fontLoads).then(() => {
      this.fontsReady = true;

      const cards = this.cache.json.get('cards') as ICard[];
      const { playerCount, colors } = this.setupData!;

      const colorMap: Record<number, string> = {};
      const nameMap: Record<number, string> = {};
      for (let i = 0; i < playerCount; i++) {
        colorMap[i] = colors[i];
        nameMap[i] = `Jogador ${i + 1}`;
      }

      const gameConfig: IGameConfig = {
        playerCount,
        cards,
        colors: colorMap,
        names: nameMap,
        flagDefinitions: FLAG_DEFINITIONS,
        regions: REGIONS_DEFINITION
      };

      this.gameState = new GameState(gameConfig);

      const { width: W, height: H } = this.scale.gameSize;
      this.buildScene(W, H);
      this.requestRelayout();
    });
  }

  protected onSceneResize(gameSize: SceneSize): void {
    this.layout(gameSize.width, gameSize.height);
  }
}
