import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, SidebarComponent],  
  template: `<app-sidebar></app-sidebar>     
            <div>
                <router-outlet ></router-outlet> 
            </div>`
})
export class OverlayComponent {
  

  }