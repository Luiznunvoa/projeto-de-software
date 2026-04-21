import { Scene } from 'phaser';

export interface SceneSize {
  width: number;
  height: number;
}

export abstract class ResponsiveScene extends Scene {
  private readonly resizeListener = (gameSize: SceneSize) => {
    this.onSceneResize(gameSize);
  };

  protected abstract onSceneCreate(data?: object): void;

  protected abstract onSceneResize(gameSize: SceneSize): void;

  protected getSceneSize(): SceneSize {
    return {
      width: this.scale.gameSize.width,
      height: this.scale.gameSize.height
    };
  }

  protected requestRelayout(): void {
    this.onSceneResize(this.getSceneSize());
  }

  create(data?: object): void {
    this.onSceneCreate(data);
    this.onSceneResize(this.getSceneSize());

    this.scale.on('resize', this.resizeListener);

    this.events.once('shutdown', () => {
      this.scale.off('resize', this.resizeListener);
    });
  }
}
