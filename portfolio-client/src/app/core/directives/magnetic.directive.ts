import { Directive, ElementRef, HostListener, inject } from '@angular/core';

// Pulls the host element slightly toward the cursor on hover, snapping back on leave.
@Directive({
 selector: '[appMagnetic]',
 standalone: true,
})
export class MagneticDirective {
 private el = inject(ElementRef<HTMLElement>);
 private readonly strength = 0.35;

 @HostListener('mousemove', ['$event'])
 onMouseMove(event: MouseEvent): void {
 if (window.matchMedia('(pointer: coarse)').matches) return;
 const host = this.el.nativeElement;
 const rect = host.getBoundingClientRect();
 const x = (event.clientX - rect.left - rect.width / 2) * this.strength;
 const y = (event.clientY - rect.top - rect.height / 2) * this.strength;
 host.style.transform = `translate(${x}px, ${y}px)`;
 }

 @HostListener('mouseleave')
 onMouseLeave(): void {
 this.el.nativeElement.style.transform = '';
 }
}
