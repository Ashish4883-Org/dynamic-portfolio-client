import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Template1Component } from "../Portfolio-Templates/template-1/template-1.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Template2Component } from "../Portfolio-Templates/template-2/template-2.component";
import { NzOptionComponent, NzSelectModule } from "ng-zorro-antd/select";
import { Template3Component } from "../Portfolio-Templates/template-3/template-3.component";
import { Template4Component } from "../Portfolio-Templates/template-4/template-4.component";

@Component({
  selector: 'app-view-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    Template1Component,
    Template2Component,
    NzOptionComponent,
    Template3Component,
    Template4Component
  ],
  templateUrl: './view-portfolio.component.html',
  styleUrls: ['./view-portfolio.component.scss'],
})
export class ViewPortfolioComponent implements OnInit {
  private readonly template4UserId = 'testu6526';
  selectedTemplate: string = 'template-3';
  isTemplate4User = false;
  showSelector: boolean = true;  // Controls visibility of the selector

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    this.isTemplate4User = userId === this.template4UserId;
    this.selectedTemplate = this.isTemplate4User ? 'template-4' : 'template-3';
  }

  onTemplateChange(): void {
    if (!this.isTemplate4User && this.selectedTemplate === 'template-4') {
      this.selectedTemplate = 'template-3';
    }
    console.log('Template changed to:', this.selectedTemplate);
  }

  // Updated to prevent toggle when clicking inside the selector
  @HostListener('click', ['$event'])
  toggleSelector(event: Event): void {
    // If the click is inside the selector div, don't toggle
    if (event.target && (event.target as HTMLElement).closest('.template-selector')) {
      return;
    }
    this.showSelector = !this.showSelector;
  }
}
