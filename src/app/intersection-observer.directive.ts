import { Directive, ElementRef, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]'
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Output() visibilityChange = new EventEmitter<boolean>();

  private observer: IntersectionObserver;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      threshold: 0.1 // 當目標元素的 10% 進入視窗時觸發
    });

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private handleIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      this.visibilityChange.emit(entry.isIntersecting);
    });
  }
}