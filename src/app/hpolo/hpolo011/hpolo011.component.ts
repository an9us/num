import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';
import { trigger, state, style, transition, animate , query, stagger} from '@angular/animations';


@Component({
  selector: 'app-hpolo011',
  templateUrl: './hpolo011.component.html',
  styleUrls: ['./hpolo011.component.css'],
  animations: [
    trigger('fadeInUp', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(100px)'
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
          style({ opacity: 0, transform: 'translateY(20px)' }), // 初始状态
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })) // 结束状态
          ])
        ])
      ])
    ])
  ]
})

export class Hpolo011Component implements OnInit {
  public observable: Observable<boolean>;
  private observer: Observer<boolean>;
  public fadeInUpState = 'void';
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

  ngOnInit(): void {
    this.splitText1 = '第５１期協力会　安全スローガン'.split('');
    this.splitText2 = '高めよう　技術と心と安全意識'.split('');
    this.splitText3 = 'ルールを守り　安全作業'.split('');
  }
  
  //画面に表示されたら数字アニメをプレイする
  onVisibilityChange(isVisible: boolean) {
    if (isVisible) {
      this.fadeInUpState = '*';
      this.observer.next(true);
    }
  }

  ngAfterViewInit(): void {
    const video = document.getElementById('background-video') as HTMLVideoElement;
    const fallbackImage = document.getElementById('fallback-image') as HTMLImageElement;

    const showFallback = () => {
      video.style.display = 'none';
      fallbackImage.style.display = 'block';
    };

    const setVideoSource = () => {
      if (video.canPlayType('video/webm')) {
        video.src = 'assets/hpolo/video/herobg-video.webm';
      } else if (video.canPlayType('video/mp4')) {
        video.src = 'assets/hpolo/video/herobg-video.mp4';
      } else {
        showFallback();
      }
    };

    const checkVideoPlayback = () => {
      setVideoSource();
      video.load();
      video.play().catch(() => {
        showFallback();
      });
    };

    // Check video playback and handle fallback
    checkVideoPlayback();

    // Handle fallback if video is paused or errors
    video.addEventListener('pause', showFallback);
    video.addEventListener('error', showFallback);
  
  }
}
