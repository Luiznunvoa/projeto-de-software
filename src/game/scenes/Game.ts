import { type GameObjects } from 'phaser';

import { ResponsiveScene, type SceneSize } from './base/ResponsiveScene';

export class Game extends ResponsiveScene {
  private titleText?: GameObjects.Text;

  constructor() {
    super('Game');
  }

  preload() {
    this.load.setPath('assets');
  }

  private layout(gameWidth: number, gameHeight: number) {
    if (!this.titleText) {
      return;
    }

    const fontSize = Math.max(42, Math.min(92, Math.floor(gameWidth * 0.09)));

    this.titleText.setPosition(gameWidth * 0.5, gameHeight * 0.2).setFontSize(fontSize);
  }

  protected onSceneCreate(): void {
    this.cameras.main.setBackgroundColor('#ffffff');

    void document.fonts.load('38px "Maverly Pixel"').then(() => {
      this.titleText = this.add
        .text(512, 150, 'HyperEthnos', {
          fontFamily: '"Maverly Pixel", Arial Black, sans-serif',
          fontSize: 92,
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 8,
          align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(100);

      this.requestRelayout();
    });
  }

  protected onSceneResize(gameSize: SceneSize): void {
    this.layout(gameSize.width, gameSize.height);
  }
}
