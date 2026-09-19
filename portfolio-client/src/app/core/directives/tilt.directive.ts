import { Directive, ElementRef, HostListener, inject } from '@angular/core';

// Adds a subtle 3D tilt-on-hover effect to the host element, following the cursor.
@Directive({
 selector: '[appTilt]',
 standalone: true,
})
export class TiltDirective {
 private el = inject(ElementRef<HTMLElement>);
 private readonly maxTilt = 8;

 @HostListener('mousemove', ['$event'])
 onMouseMove(event: MouseEvent): void {
 if (window.matchMedia('(pointer: coarse)').matches) return;
 const host = this.el.nativeElement;
 const rect = host.getBoundingClientRect();
 const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
 const yRatio = (event.clientY - rect.top) / rect.height - 0.5;

 const rotateY = xRatio * this.maxTilt * 2;
 const rotateX = -yRatio * this.maxTilt * 2;
 host.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
 }

 @HostListener('mouseleave')
 onMouseLeave(): void {
 this.el.nativeElement.style.transform = '';
 }
}
