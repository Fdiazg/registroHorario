import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ScannerComponent } from './scanner.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from 'src/app/explore-container/explore-container.module';

const routes: Routes = [
  {
    path: '',
    component: ScannerComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    
  ]
})
export class ScannerRoutingModule { }
