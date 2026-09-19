import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

// Animates a numeric counter from 0 to [appCountUp] once the host scrolls into view.
@Directive({
 selector: '[appCountUp]',
 standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
 @Input('appCountUp') target = 0;
 @Input() countUpDuration = 1200;
 @Input() countUpSuffix = '';

 private el = inject(ElementRef<HTMLElement>);
 private observer?: IntersectionObserver;

 ngOnInit(): void {
 const host = this.el.nativeElement;
 const prefersReducedMotion = typeof matchMedia !== 'undefined'
 && matchMedia('(prefers-reduced-motion: reduce)').matches;

 if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion) {
 host.textContent = `${this.target}${this.countUpSuffix}`;
 return;
 }

 this.observer = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 this.animate(host);
 this.observer?.unobserve(host);
 }
 });
 },
 { threshold: 0.4 }
 );
 this.observer.observe(host);
 }

 private animate(host: HTMLElement): void {
 const start = performance.now();
 const step = (now: number) => {
 const progress = Math.min((now - start) / this.countUpDuration, 1);
 const eased = 1 - Math.pow(1 - progress, 3);
 const value = Math.round(this.target * eased);
 host.textContent = `${value}${this.countUpSuffix}`;
 if (progress < 1) {
 requestAnimationFrame(step);
 }
 };
 requestAnimationFrame(step);
 }

 ngOnDestroy(): void {
 this.observer?.disconnect();
 }
}
