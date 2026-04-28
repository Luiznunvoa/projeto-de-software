import { type GameObjects } from 'phaser';

import { ResponsiveScene, type SceneSize } from './base/ResponsiveScene';
import { SceneKey } from './SceneKeys';

interface MenuButton {
  bg: GameObjects.Rectangle;
  label: GameObjects.Text;
  border: GameObjects.Rectangle;
}

const COLORS = {
  bg: 0x1a1a2e,
  panel: 0x16213e,
  btnPrimary: 0x2d5a27,
  btnPrimaryHover: 0x3d7a35,
  btnSecondary: 0x2a2a3e,
  btnSecondaryHover: 0x3a3a5e,
  btnBorder: 0x8b7355,
  btnBorderHover: 0xd4a855,
  title: '#d4a855',
  titleStroke: '#1a0a00',
  tagline: '#b0c4de',
  btnText: '#f5deb3',
  btnTextHover: '#ffffff'
} as const;

export class Game extends ResponsiveScene {
  private titleText?: GameObjects.Text;
  private taglineText?: GameObjects.Text;
  private backdrop?: GameObjects.Rectangle;
  private decorTop?: GameObjects.Rectangle;
  private decorBot?: GameObjects.Rectangle;
  private btnPlay?: MenuButton;
  private btnSettings?: MenuButton;
  private btnAbout?: MenuButton;
  private fontsReady = false;

  constructor() {
    super(SceneKey.MainMenu);
  }

  preload() {
    this.load.setPath('assets');
  }

  private createButton(
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    isPrimary: boolean,
    onClick: () => void
  ): MenuButton {
    const bgColor = isPrimary ? COLORS.btnPrimary : COLORS.btnSecondary;
    const bgHover = isPrimary ? COLORS.btnPrimaryHover : COLORS.btnSecondaryHover;

    const border = this.add.rectangle(x, y, w + 4, h + 4, COLORS.btnBorder).setDepth(10);
    const bg = this.add
      .rectangle(x, y, w, h, bgColor)
      .setDepth(11)
      .setInteractive({ useHandCursor: true });
    const text = this.add
      .text(x, y, label, {
        fontFamily: '"Jersey 10", monospace',
        fontSize: Math.floor(h * 0.45),
        color: COLORS.btnText,
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(12);

    bg.on('pointerover', () => {
      bg.setFillStyle(bgHover);
      border.setFillStyle(COLORS.btnBorderHover);
      text.setColor(COLORS.btnTextHover);
      this.tweens.add({
        targets: [bg, border, text],
        scaleX: 1.03,
        scaleY: 1.05,
        duration: 80,
        ease: 'Sine.easeOut'
      });
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(bgColor);
      border.setFillStyle(COLORS.btnBorder);
      text.setColor(COLORS.btnText);
      this.tweens.add({
        targets: [bg, border, text],
        scaleX: 1,
        scaleY: 1,
        duration: 80,
        ease: 'Sine.easeOut'
      });
    });

    bg.on('pointerup', () => {
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

    return { bg, label: text, border };
  }

  private positionButton(btn: MenuButton, x: number, y: number, w: number, h: number): void {
    btn.border.setPosition(x, y).setSize(w + 4, h + 4);
    btn.bg.setPosition(x, y).setSize(w, h);
    btn.label.setPosition(x, y).setFontSize(Math.floor(h * 0.45));
  }

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

    const titleSize = Math.max(42, Math.min(96, Math.floor(W * 0.085)));
    this.titleText?.setPosition(W * 0.5, H * 0.22).setFontSize(titleSize);

    const tagSize = Math.max(18, Math.min(32, Math.floor(W * 0.028)));
    this.taglineText?.setPosition(W * 0.5, H * 0.22 + titleSize * 0.9).setFontSize(tagSize);

    const btnW = Math.min(360, Math.floor(W * 0.38));
    const btnH = Math.max(42, Math.min(64, Math.floor(H * 0.075)));
    const gap = btnH + Math.max(14, Math.floor(H * 0.025));
    const startY = H * 0.55;

    if (this.btnPlay) this.positionButton(this.btnPlay, W * 0.5, startY, btnW, btnH);
    if (this.btnSettings) this.positionButton(this.btnSettings, W * 0.5, startY + gap, btnW, btnH);
    if (this.btnAbout) this.positionButton(this.btnAbout, W * 0.5, startY + gap * 2, btnW, btnH);
  }

  protected onSceneCreate(): void {
    this.cameras.main.setBackgroundColor('#1a1a2e');

    const W = this.scale.gameSize.width;
    const H = this.scale.gameSize.height;

    this.backdrop = this.add.rectangle(0, 0, W, H, COLORS.bg).setOrigin(0, 0).setDepth(0);
    this.decorTop = this.add.rectangle(0, 0, W, 6, COLORS.btnBorder).setOrigin(0, 0).setDepth(5);
    this.decorBot = this.add.rectangle(0, H, W, 6, COLORS.btnBorder).setOrigin(0, 1).setDepth(5);

    const fontLoads = [
      document.fonts.load('64px "Maverly Pixel"'),
      document.fonts.load('32px "Jersey 10"')
    ];

    void Promise.all(fontLoads).then(() => {
      this.fontsReady = true;

      const { width: cW, height: cH } = this.scale.gameSize;

      this.titleText = this.add
        .text(cW * 0.5, cH * 0.22, 'HyperEthnos', {
          fontFamily: '"Maverly Pixel", Arial Black, sans-serif',
          fontSize: 80,
          color: COLORS.title,
          stroke: COLORS.titleStroke,
          strokeThickness: 10,
          align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(20);

      this.taglineText = this.add
        .text(cW * 0.5, cH * 0.34, 'A lenda dos bandos começa aqui', {
          fontFamily: '"Jersey 10", monospace',
          fontSize: 26,
          color: COLORS.tagline,
          align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(20);

      this.btnPlay = this.createButton(cW * 0.5, cH * 0.55, 360, 58, 'Jogar', true, () => {
        this.scene.start(SceneKey.GameSetup);
      });

      this.btnSettings = this.createButton(
        cW * 0.5,
        cH * 0.55 + 74,
        360,
        58,
        'Configurações',
        false,
        () => {
          console.log('Configurações');
        }
      );

      this.btnAbout = this.createButton(cW * 0.5, cH * 0.55 + 148, 360, 58, 'Sobre', false, () => {
        console.log('Sobre');
      });

      this.requestRelayout();
    });
  }

  protected onSceneResize(gameSize: SceneSize): void {
    this.layout(gameSize.width, gameSize.height);
  }
}
