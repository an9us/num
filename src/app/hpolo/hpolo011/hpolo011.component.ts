import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-hpolo011',
  templateUrl: './hpolo011.component.html',
  styleUrls: ['./hpolo011.component.css'],
  animations: [
    trigger('fadeInUp', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(50px)'
      })),
      transition('void => *', [
        animate('800ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ])
    ]),
    trigger('textAnimation', [
      transition('* => *', [
        query('span', [
          style({ opacity: 0, transform: 'translateY(20px)' }), // 初期状態
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })) // 終了状態
          ])
        ])
      ])
    ])
  ]
})

export class Hpolo011Component implements OnInit, AfterViewInit, OnDestroy {
  public observable: Observable<boolean>;
  private observer: Observer<boolean>;
  public fadeInUpState = 'void';
  public textAnimationState = 'void';
  public isLoadingComplete = false; // 新增标志
  public config = {
    animation: 'slide', 
    format: 'd', 
    theme: 'minimal', 
    value: 0,
    auto: false
  };
  public splitText1: string[] = [];
  public splitText2: string[] = [];
  public splitText3: string[] = [];

  constructor() {
    this.observable = new Observable<boolean>((observer: any) => this.observer = observer).pipe(share());
  }

  // コンポーネントが初期化されるときに呼ばれる
  ngOnInit(): void {
    this.splitText1 = '第５１期協力会　安全スローガン'.split('');
    this.splitText2 = '高めよう　技術と心と安全意識'.split('');
    this.splitText3 = 'ルールを守り　安全作業'.split('');
  }

  // ビューが初期化された後に呼ばれる
  ngAfterViewInit(): void {
    this.loadResources();
  }

  // リソースを読み込み、ビデオの再生をチェックする
  loadResources() {
    const video = document.getElementById('background-video') as HTMLVideoElement;
    const fallbackImage = document.getElementById('fallback-image') as HTMLImageElement;

    if (video) {
      // ビデオが再生できない場合やエラーが発生した場合にフォールバック画像を表示する
      const showFallback = () => {
        if (video) video.style.display = 'none';
        if (fallbackImage) fallbackImage.style.display = 'block';
      };

      // ビデオのソースを設定する
      const setVideoSource = () => {
        if (video.canPlayType('video/webm')) {
          video.src = 'assets/hpolo/video/herobg-video.webm';
        } else if (video.canPlayType('video/mp4')) {
          video.src = 'assets/hpolo/video/herobg-video.mp4';
        } else {
          showFallback();
        }
      };

      // ビデオ再生のチェックとフォールバック処理
      const checkVideoPlayback = () => {
        setVideoSource();
        video.load();
        video.muted = true; // 静音
        video.play().catch((error) => {
          console.error('動画再生時失敗:', error);
          showFallback();
        });
      };

      // ビデオの再生を確認し、フォールバック処理を実行する
      checkVideoPlayback();
      
      // video.addEventListener('ended', () => {
      //   video.play();
      // });
  
      // ビデオが一時停止またはエラーが発生した場合にフォールバック処理を実行する
      video.addEventListener('pause', showFallback);
      video.addEventListener('error', showFallback);

      // すべてのリソースがロードされた後にローディング画面を非表示にする
      window.addEventListener('load', this.hideLoadingScreen.bind(this));
    } else {
      console.error('Video element not found');
    }
  }

  // ローディング画面を非表示にする
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
        this.isLoadingComplete = true; // 设置加载完成标志
        this.triggerTextAnimation(); // 触发文本动画
      }, 2000); // アニメーションが完了した後に非表示にする
    }
  }
  // テキストアニメーションをトリガーする
  triggerTextAnimation() {
    if (this.isLoadingComplete) {
      this.textAnimationState = '*';
    }
  }

  // フォールバック画像を表示する
  showFallback() {
    const video = document.getElementById('background-video') as HTMLVideoElement;
    const fallbackImage = document.getElementById('fallback-image') as HTMLImageElement;

    if (video) {
      video.style.display = 'none';
    }
    if (fallbackImage) {
      fallbackImage.style.display = 'block';
    }
  }

  // ビジュアライゼーションが表示されたときにアニメーションをトリガーする
  onVisibilityChange(isVisible: boolean) {
    if (isVisible) {
      this.fadeInUpState = '*';
      this.observer.next(true);
    }
  }

  // コンポーネントが破棄されるときにイベントリスナーをクリーンアップする
  ngOnDestroy() {
    // イベントリスナーのクリーンアップ
    const video = document.getElementById('background-video') as HTMLVideoElement;
    if (video) {
      video.removeEventListener('error', this.showFallback.bind(this));
      video.removeEventListener('pause', this.showFallback.bind(this));
    }
    window.removeEventListener('load', this.hideLoadingScreen.bind(this));
  }
}
