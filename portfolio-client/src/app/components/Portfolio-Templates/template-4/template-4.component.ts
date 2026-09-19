import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../core/directives/reveal-on-scroll.directive';
import { CountUpDirective } from '../../../core/directives/count-up.directive';
import { TiltDirective } from '../../../core/directives/tilt.directive';
import { MagneticDirective } from '../../../core/directives/magnetic.directive';
interface StatEntry {
 value: number;
 suffix: string;
 label: string;
}

interface ExperienceEntry {
 company: string;
 location: string;
 role: string;
 period: string;
 bullets: string[];
}

interface EducationEntry {
 school: string;
 degree: string;
 location: string;
 period: string;
 detail: string;
}

const THEME_KEY = 'umang-resume-theme';

@Component({
 selector: 'app-template-4',
 standalone: true,
 imports: [CommonModule, RevealOnScrollDirective, CountUpDirective, TiltDirective, MagneticDirective],
 templateUrl: './template-4.component.html',
 styleUrl: './template-4.component.scss',
})
export class Template4Component implements OnInit, AfterViewInit, OnDestroy {
 private hostEl = inject(ElementRef<HTMLElement>);
 @ViewChild('particleCanvas') particleCanvasRef?: ElementRef<HTMLCanvasElement>;

 isLight = typeof localStorage !== 'undefined' && localStorage.getItem(THEME_KEY) === 'light';
 menuOpen = false;
 scrollProgress = 0;
 activeSection = 'home';
 cursorX = 0;
 cursorY = 0;
 showCursor = false;
 typedTagline = '';
 showBackToTop = false;
 readonly currentYear = new Date().getFullYear();
 readonly achievementIcons = ['🏆', '🚀', '🤝'];

 private sectionObserver?: IntersectionObserver;
 private readonly sectionIds = ['home', 'about', 'skills', 'experience', 'education', 'achievements', 'contact'];
 private particleAnimationFrame?: number;
 private particleResizeHandler = () => this.setupParticleCanvas();
 private typewriterTimeout?: ReturnType<typeof setTimeout>;
 private readonly prefersReducedMotion = typeof matchMedia !== 'undefined'
 && matchMedia('(prefers-reduced-motion: reduce)').matches;

 readonly taglines = [
 'I build fast, scalable Angular frontends.',
 'I design real-time systems with Node.js & Socket.IO.',
 'I mentor teams and ship better code, faster.',
 ];

 readonly stats: StatEntry[] = [
 { value: 3, suffix: '+', label: 'Years of Experience' },
 { value: 500, suffix: 'k+', label: 'Users Impacted (Nados.io)' },
 { value: 5, suffix: '', label: 'Awards & Recognitions' },
 { value: 2, suffix: '', label: 'Legacy Apps Modernized' },
 ];

 readonly profile = {
 name: 'Umang Aggarwal',
 title: 'Software Engineer · Angular & Node.js Specialist',
 phone: '+91-9891692332',
 email: 'umang.aggarwal.142@gmail.com',
 tagline:
 'I build fast, scalable frontend & backend systems - and mentor teams to ship better code, faster.',
 };

 readonly skillGroups = [
 { label: 'Frontend', skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'HTML5', 'CSS3', 'Kendo UI', 'NG-ZORRO'] },
 { label: 'Backend & API', skills: ['Node.js', 'AdonisJS', 'REST APIs', 'Socket.IO'] },
 { label: 'Testing & API Tools', skills: ['Postman', 'Jasmine', 'Karma', 'xUnit', 'Unit Testing', 'Integration Testing'] },
 { label: 'Database & Caching', skills: ['MongoDB', 'Redis'] },
 { label: 'DevOps, Cloud & Deployment', skills: ['Git', 'JIRA', 'Render', 'Netlify'] },
 ];

// Flattened + duplicated once for a seamless infinite marquee loop.
 readonly marqueeSkills = [...new Set(this.skillGroups.flatMap((g) => g.skills))];

 readonly experience: ExperienceEntry[] = [
 {
 company: 'DXC Technology',
 location: 'Delhi, India',
 role: 'Analyst 1 Software Engineer',
 period: 'Oct 2025 – Present',
 bullets: [
 'Optimized API calls using RxJS and state-driven triggers, reducing redundant network requests by 30%',
 'Mentored junior developers and assisted in feature development, improving team efficiency and code quality',
 'Reviewed and refactored existing code modules, improving maintainability and accelerating feature delivery',
 ],
 },
 {
 company: 'DXC Technology',
 location: 'Delhi, India',
 role: 'Analyst 2 Software Engineer',
 period: 'Nov 2023 – Sep 2025',
 bullets: [
 'Upgraded 2 legacy Angular apps with NgRx (Actions, Reducers, Effects), improving user engagement by 20%',
 'Leveraged AI tools (Copilot, Claude) to accelerate feature delivery and improve code quality',
 'Built REST APIs in AdonisJS, designed MongoDB schemas, and implemented Redis caching',
 ],
 },
 {
 company: 'DXC Technology',
 location: 'Delhi, India',
 role: 'Product Developer',
 period: 'Jun 2022 – Oct 2023',
 bullets: [
 'Applied Agile methodologies to streamline development workflows, boosting team productivity by 30%',
 'Wrote and maintained unit and integration tests (Jasmine, Karma, xUnit) to ensure code quality and reliability',
 'Designed and implemented reusable UI components, reducing development time for future projects by 25%',
 ],
 },
 {
 company: 'Freelance',
 location: 'Remote',
 role: 'Full-Stack Developer (Part-time, During B.Tech)',
 period: 'May 2021 – May 2022',
 bullets: [
 'Developed a real-time chat system with Socket.IO, including online user tracking and admin dashboard notifications',
 'Built secure APIs with custom middleware, HTTP interceptors, and JWT authentication',
 'Implemented load balancing using Nginx to optimize traffic distribution and application performance',
 ],
 },
 {
 company: 'Pepcoding',
 location: 'Delhi, India',
 role: 'Software Development Trainee (Internship)',
 period: 'Nov 2020 – Apr 2021',
 bullets: ['Contributed to Nados.io (500k+ users), implementing scalable features and enabling tech enthusiasts to compete'],
 },
 ];

 readonly education: EducationEntry[] = [
 {
 school: 'Maharaja Agrasen Institute Of Technology',
 degree: 'Bachelor of Technology in Information Technology',
 location: 'Delhi, India',
 period: 'Jul 2019 – May 2022',
 detail: 'Among the top 5% of the batch with a GPA of 8.76/10.0',
 },
 ];

 readonly achievements = [
 'DXC Exceptional Contribution Award, recognized by VP Jim Restivo, for enhancing platform stability',
 'DXC Champ Award for leading a high-impact project that optimized backend performance by 50%',
 'DXC Collaboration Awards (2x) for exceptional teamwork and problem-solving in high-impact projects',
 ];

 toggleTheme() {
 this.isLight = !this.isLight;
 localStorage.setItem(THEME_KEY, this.isLight ? 'light' : 'dark');
 }

 toggleMenu() {
 this.menuOpen = !this.menuOpen;
 document.body.style.overflow = this.menuOpen ? 'hidden' : '';
 }

 closeMenu() {
 this.menuOpen = false;
 document.body.style.overflow = '';
 }

 ngOnInit(): void {
 this.setupSectionObserver();
 this.startTypewriter();
 }

 ngAfterViewInit(): void {
 this.setupParticleCanvas();
 window.addEventListener('resize', this.particleResizeHandler);
 }

 ngOnDestroy(): void {
 this.sectionObserver?.disconnect();
 document.body.style.overflow = '';
 if (this.particleAnimationFrame) cancelAnimationFrame(this.particleAnimationFrame);
 if (this.typewriterTimeout) clearTimeout(this.typewriterTimeout);
 window.removeEventListener('resize', this.particleResizeHandler);
 }

 @HostListener('window:scroll')
 onWindowScroll(): void {
 const scrollTop = window.scrollY;
 const docHeight = document.documentElement.scrollHeight - window.innerHeight;
 this.scrollProgress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
 this.showBackToTop = scrollTop > 600;
 }

 scrollToTop(): void {
 window.scrollTo({ top: 0, behavior: this.prefersReducedMotion ? 'auto' : 'smooth' });
 }

// Close the mobile menu when a click lands outside it or the toggle button.
 @HostListener('document:click', ['$event'])
 onDocumentClick(event: MouseEvent): void {
 if (!this.menuOpen) return;
 const target = event.target as HTMLElement;
 if (!target.closest('.nav-links') && !target.closest('.hamburger')) {
 this.closeMenu();
 }
 }

 @HostListener('document:keydown.escape')
 onEscape(): void {
 if (this.menuOpen) this.closeMenu();
 }

// Subtle cursor-driven parallax on the hero background orbs (desktop only), plus the custom cursor glow.
 @HostListener('mousemove', ['$event'])
 onMouseMove(event: MouseEvent): void {
 if (window.matchMedia('(pointer: coarse)').matches) return;

 this.showCursor = true;
 this.cursorX = event.clientX;
 this.cursorY = event.clientY;

 const heroEl = this.hostEl.nativeElement.querySelector('.hero') as HTMLElement | null;
 if (!heroEl) return;
 const rect = heroEl.getBoundingClientRect();
 if (event.clientY < rect.top || event.clientY > rect.bottom) return;

 const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
 const yRatio = (event.clientY - rect.top) / rect.height - 0.5;
 const orbs = heroEl.querySelectorAll<HTMLElement>('.orb');
 orbs.forEach((orb, i) => {
 const strength = (i + 1) * 12;
 orb.style.transform = `translate(${xRatio * strength}px, ${yRatio * strength}px)`;
 });
 }

 @HostListener('mouseleave')
 onHostMouseLeave(): void {
 this.showCursor = false;
 }

 private startTypewriter(): void {
 if (this.prefersReducedMotion) {
 this.typedTagline = this.taglines[0];
 return;
 }

 let taglineIndex = 0;
 let charIndex = 0;
 let deleting = false;

 const tick = () => {
 const current = this.taglines[taglineIndex];
 this.typedTagline = deleting ? current.slice(0, charIndex - 1) : current.slice(0, charIndex + 1);
 charIndex += deleting ? -1 : 1;

 let delay = deleting ? 30 : 55;
 if (!deleting && charIndex === current.length) {
 deleting = true;
 delay = 1800;
 } else if (deleting && charIndex === 0) {
 deleting = false;
 taglineIndex = (taglineIndex + 1) % this.taglines.length;
 delay = 300;
 }

 this.typewriterTimeout = setTimeout(tick, delay);
 };

 tick();
 }

 private setupParticleCanvas(): void {
 const canvas = this.particleCanvasRef?.nativeElement;
 if (!canvas || this.prefersReducedMotion) return;

 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 if (this.particleAnimationFrame) cancelAnimationFrame(this.particleAnimationFrame);

 const dpr = window.devicePixelRatio || 1;
 const parent = canvas.parentElement as HTMLElement;
 const width = parent.clientWidth;
 const height = parent.clientHeight;
 canvas.width = width * dpr;
 canvas.height = height * dpr;
 canvas.style.width = width + 'px';
 canvas.style.height = height + 'px';
 ctx.scale(dpr, dpr);

 const particleCount = width < 640 ? 32 : 60;
 const particles = Array.from({ length: particleCount }, () => ({
 x: Math.random() * width,
 y: Math.random() * height,
 vx: (Math.random() - 0.5) * 0.4,
 vy: (Math.random() - 0.5) * 0.4,
 }));

 const accentColor = this.isLight ? '15, 23, 42' : '244, 244, 245';
 const linkDistance = 130;

 const draw = () => {
 ctx.clearRect(0, 0, width, height);

 particles.forEach((p) => {
 p.x += p.vx;
 p.y += p.vy;
 if (p.x < 0 || p.x > width) p.vx *= -1;
 if (p.y < 0 || p.y > height) p.vy *= -1;
 });

 for (let i = 0; i < particles.length; i++) {
 for (let j = i + 1; j < particles.length; j++) {
 const dx = particles[i].x - particles[j].x;
 const dy = particles[i].y - particles[j].y;
 const dist = Math.sqrt(dx * dx + dy * dy);
 if (dist < linkDistance) {
 ctx.strokeStyle = 'rgba(' + accentColor + ', ' + (0.15 * (1 - dist / linkDistance)) + ')';
 ctx.lineWidth = 1;
 ctx.beginPath();
 ctx.moveTo(particles[i].x, particles[i].y);
 ctx.lineTo(particles[j].x, particles[j].y);
 ctx.stroke();
 }
 }
 ctx.fillStyle = 'rgba(' + accentColor + ', 0.5)';
 ctx.beginPath();
 ctx.arc(particles[i].x, particles[i].y, 1.6, 0, Math.PI * 2);
 ctx.fill();
 }

 this.particleAnimationFrame = requestAnimationFrame(draw);
 };

 draw();
 }

 private setupSectionObserver(): void {
 if (typeof IntersectionObserver === 'undefined') return;

 this.sectionObserver = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 this.activeSection = entry.target.id;
 }
 });
 },
 { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
 );

 this.sectionIds.forEach((id) => {
 const el = document.getElementById(id);
 if (el) this.sectionObserver?.observe(el);
 });
 }
}

