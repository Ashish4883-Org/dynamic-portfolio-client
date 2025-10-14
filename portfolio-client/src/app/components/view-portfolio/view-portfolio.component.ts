import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-portfolio',
  imports: [],
  templateUrl: './view-portfolio.component.html',
  styleUrl: './view-portfolio.component.scss',
})
export class ViewPortfolioComponent {
  mstrid!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Option 1: If route params do not change after load
    this.mstrid = this.route.snapshot.paramMap.get('userId')!;
    console.log('Extracted mstrid:', this.mstrid);

    // Option 2 (optional): If route params might change while staying on same component
    // this.route.paramMap.subscribe((params) => {
    //   this.mstrid = params.get('userId')!;
    //   console.log('Updated mstrid:', this.mstrid);
    // });
  }
}
