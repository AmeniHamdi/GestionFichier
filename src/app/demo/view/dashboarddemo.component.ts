import {Component, OnInit} from '@angular/core';
import {EventService} from '../service/eventservice';
import {MenuItem} from 'primeng/api';
import {Product} from '../domain/product';
import {ProductService} from '../service/productservice';
import {BreadcrumbService} from '../../app.breadcrumb.service';
import { ChartModule } from 'primeng/chart';

// @fullcalendar plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { dashboardservice } from './dashboard.service';
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/demo/badges.scss'],
    styles: [`
        @media screen and (max-width: 960px) {
            :host ::ng-deep .fc-header-toolbar {
                display: flex;
                flex-wrap: wrap;

                .fc-dayGridMonth-button {
                    margin-top: 1rem;
                }
                .fc-timeGridWeek-button{
                    margin-top: 1rem;
                }
                .fc-timeGridDay-button{
                    margin-top: 1rem;
                }
            }
        }
        
        :host ::ng-deep {
            .fc.fc-theme-standard .fc-highlight {
                color: #ffffff;
                background: var(--fc-highlight-color, rgba(63, 81, 181, 0.12));
            }
        }
    `]
})
export class DashboardDemoComponent implements OnInit {
    data: any;

    options: any;


    products: Product[];

    chartData: any;

    chartOptions: any;

    events: any[];

    items: MenuItem[];

    fullCalendarOptions: any;

    tiers: any[] = [];
    basicData: any;

    basicOptions: any;

    countContract : any;
    countDossier : any;
    countTier : any ;
    countUser : any ;
    constructor(private productService: ProductService, private dashboardservice: dashboardservice, private eventService: EventService, private breadcrumbService: BreadcrumbService) {
        this.breadcrumbService.setItems([
            {label: 'Dashboard', routerLink: ['']}
        ]);
    }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);
        this.eventService.getEvents().then(events => {
            this.events = events;
            this.fullCalendarOptions = {...this.fullCalendarOptions, ...{events: events}};
            
          
          
        });

        this.dashboardservice.getDosssierCount().subscribe((dossierResponse: any) => {
            console.log(dossierResponse);
            this.countDossier = dossierResponse;
            
            this.dashboardservice.getContractCount().subscribe((contractResponse: any) => {
              console.log(contractResponse);
              this.countContract = contractResponse;
              this.dashboardservice.getTierCount().subscribe((TierResponse: any) => {
                console.log(TierResponse);
                this.countTier = TierResponse;
              
              this.data = {
                labels: ['Contract', 'Dossier', 'Tier'],
                datasets: [
                  {
                    data: [this.countContract, this.countDossier, this.countTier],
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                  }
                ]
              };
          
              this.options = {
                plugins: {
                  legend: {
                    labels: {
                      usePointStyle: true,
                      color: textColor
                    }
                  }
                }
              };
            });
          });
        });
        this.dashboardservice.getUsersCount().subscribe((UserResponse: any) => {
            console.log(UserResponse);
            this.countUser = UserResponse;

        });

        this.dashboardservice.getTiersCountByNumero().subscribe((tiers: any[]) => {
          this.tiers = tiers;
          console.log("here",tiers);

         const numeros=  tiers.map(tier => tier.numero);
         console.log("num",numeros);
         const count = tiers.map(tier => tier.count);
         console.log("count",count);

         const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.basicData = {
            labels: numeros,
            datasets: [
                {
                    label: 'count',
                    data: count,
                    backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    borderWidth: 1
                }
            ]
        };
        this.basicOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      color: textColorSecondary
                      
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };

        });
        
             
        
        // this.chartData = {
        //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //     datasets: [
        //         {
        //             label: 'Uploads',
        //             data: [12, 19, 3, 5, 2, 3, 9],
        //             borderColor: [
        //                 '#7E57C2',
        //             ],
        //             borderWidth: 3,
        //             borderDash: [5, 5],
        //             fill: false,
        //             pointRadius: 3,
        //             tension: .4
        //         },
        //         {
        //             label: 'Contrat',
        //             data: [12, 19, 3, 5, 2, 3, 9],
        //             borderColor: [
        //                 '#7E57C2',
        //             ],
        //             borderWidth: 3,
        //             borderDash: [5, 5],
        //             fill: false,
        //             pointRadius: 3,
        //             tension: .4
        //         },
        //         {
        //             label: 'Tiers',
        //             data: [1, 2, 5, 3, 12, 7, 15],
        //             backgroundColor: [
        //                 'rgba(187,222,251,0.2)',
        //             ],
        //             borderColor: [
        //                 '#42A5F5',
        //             ],
        //             borderWidth: 3,
        //             fill: true,
        //             tension: .4
        //         },
        //         {
        //             label: 'Dossiers',
        //             data: [7, 12, 15, 5, 3, 13, 21],
        //             borderColor: [
        //                 '#FFB300',
        //             ],
        //             borderWidth: 3,
        //             fill: false,
        //             pointRadius: [4, 6, 4, 12, 8, 0, 4],
        //             tension: .4
        //         },
        //         {
        //             label: 'New Users',
        //             data: [3, 7, 2, 17, 15, 13, 19],
        //             borderColor: [
        //                 '#66BB6A',
        //             ],
        //             borderWidth: 3,
        //             fill: false,
        //             tension: .4
        //         }
        //     ]
        // };

        // this.chartOptions = {
        //     responsive: true,
        //     hover: {
        //         mode: 'index'
        //     },
        //     scales: {
        //         x: {
        //             display: true,
        //             scaleLabel: {
        //                 display: true,
        //                 labelString: 'Month'
        //             }
        //         },
        //         y: {
        //             display: true,
        //             scaleLabel: {
        //                 display: true,
        //                 labelString: 'Value'
        //             }
        //         }
        //     }
        // };

        // this.items = [
        //     {label: 'Save', icon: 'pi pi-fw pi-check'},
        //     {label: 'Update', icon: 'pi pi-fw pi-refresh'},
        //     {label: 'Delete', icon: 'pi pi-fw pi-trash'}
        // ];

        // this.fullCalendarOptions = {
        //     plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        //     initialDate: '2023-03-09',
        //     headerToolbar: {
        //         left: 'prev,next today',
        //         center: 'title',
        //         right: 'dayGridMonth,timeGridWeek,timeGridDay'
        //     },
        //     editable: true,
        //     selectable: true,
        //     selectMirror: true,
        //     dayMaxEvents: true,
        // };

        

        
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

       
    }
}
