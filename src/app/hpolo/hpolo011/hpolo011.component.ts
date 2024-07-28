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
    // trigger('textAnimation', [
    //   transition('* => *', [
    //     query('span', [
    //       style({ opacity: 0, transform: 'translateY(20px)' }), // 初期状態
    //       stagger(100, [
    //         animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })) // 終了状態
    //       ])
    //     ])
    //   ])
    // ])
    trigger('textAnimation', [
      transition(':enter', [
        query('span', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
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
  this.hideLoadingScreen().then(() => {
    // hideLoadingScreen 完成後觸發 textAnimation
    this.triggerTextAnimation();
  });
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

  hideLoadingScreen(): Promise<void> {
    return new Promise((resolve) => {
      const loadingScreen = document.getElementById('loading-screen');
      const mainContent = document.getElementById('main-content');
      const textContainer = document.querySelector('.text-container') as HTMLElement;
      
      if (loadingScreen && mainContent) {
        // 開始淡出加載屏幕
        loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
          // 隱藏加載屏幕
          if (loadingScreen) {
            loadingScreen.style.display = 'none';
          }
          
          // 設置主內容為可見，但仍然透明
          mainContent.style.visibility = 'visible';
          mainContent.style.opacity = '0';
          
          // 確保文字容器初始狀態是不可見的
          if (textContainer) {
            textContainer.style.visibility = 'hidden';
            textContainer.style.opacity = '0';
          }
          
          // 使用 requestAnimationFrame 來確保 DOM 更新
          requestAnimationFrame(() => {
            // 淡入主內容
            mainContent.style.transition = 'opacity 0.5s ease-in';
            mainContent.style.opacity = '1';
            
            // 等待主內容淡入完成後再解析 Promise
            setTimeout(() => {
              this.isLoadingComplete = true;
              
              // 再次使用 requestAnimationFrame 以確保所有樣式更新已應用
              requestAnimationFrame(() => {
                resolve();
              });
            }, 500); // 與主內容的淡入時間相匹配
          });
        }, 1500); // 等待加載屏幕淡出動畫完成
      } else {
        // 如果元素不存在，立即解決 Promise
        console.warn('Loading screen or main content element not found');
        resolve();
      }
    });
  }

  // テキストアニメーションをトリガーする
  triggerTextAnimation() {
    this.textAnimationState = '*';
    const textContainer = document.querySelector('.text-container') as HTMLElement;
    if (textContainer) {
      textContainer.style.visibility = 'visible';
      textContainer.style.opacity = '1';
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
