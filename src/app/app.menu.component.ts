import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-menu',
  template: `
    <ul class="layout-menu">
      <li
        app-menuitem
        *ngFor="let item of model; let i = index;"
        [item]="item"
        [index]="i"
        [visible]="true"
        [root]="true"
      ></li>
    </ul>
  `,
})
export class AppMenuComponent implements OnInit {
  model: any[];

  ngOnInit() {
    this.model = [
      {
        label: 'File Section',
        icon: 'pi pi-fw pi-star-fill',
        routerLink: ['/uikit'],
        items: [
          { label: 'Csv', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/csv'] },
          { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
          { label: 'Tiers', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table/tier'] },
          { label: 'Dossier', icon: 'pi pi-fw pi-folder', routerLink: ['/uikit/table/dossier'] },
          { label: 'Contrat', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/table/contrat'] },
        ],
      },
    ];

    const { authorities } = jwt_decode(sessionStorage.getItem('token')) as any;
    if (authorities.authority === 'ADMIN') {
      this.model.unshift({
        label: 'Admin Section',
        icon: 'pi pi-fw pi-users',
        items: [
          { label: 'Admin Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/admin'] },
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/uikit/dashboard'] },
        ],
      });
    }

    console.log(jwt_decode(sessionStorage.getItem('token')));
  }
}
