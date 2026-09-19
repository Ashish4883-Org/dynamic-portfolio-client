import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

// Adds a 'revealed' class to the host once it scrolls into the viewport, for CSS-driven entrance animations.
@Directive({
 selector: '[appReveal]',
 standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
 private el = inject(ElementRef<HTMLElement>);
 private observer?: IntersectionObserver;

 ngOnInit(): void {
 const host = this.el.nativeElement;
 host.classList.add('reveal');

 const prefersReducedMotion = typeof matchMedia !== 'undefined'
 && matchMedia('(prefers-reduced-motion: reduce)').matches;

 if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion) {
 host.classList.add('revealed');
 return;
 }

 this.observer = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 host.classList.add('revealed');
 this.observer?.unobserve(host);
 }
 });
 },
 { threshold: 0.15 }
 );
 this.observer.observe(host);
 }

 ngOnDestroy(): void {
 this.observer?.disconnect();
 }
}
