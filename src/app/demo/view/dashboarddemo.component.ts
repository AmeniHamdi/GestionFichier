import {Component, OnInit} from '@angular/core';
import {EventService} from '../service/eventservice';
import {MenuItem} from 'primeng/api';
import {Product} from '../domain/product';
import {ProductService} from '../service/productservice';
import {BreadcrumbService} from '../../app.breadcrumb.service';

// @fullcalendar plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

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

    products: Product[];

    chartData: any;

    chartOptions: any;

    events: any[];

    items: MenuItem[];

    fullCalendarOptions: any;

    constructor(private productService: ProductService, private eventService: EventService, private breadcrumbService: BreadcrumbService) {
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

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Sales',
                    data: [12, 19, 3, 5, 2, 3, 9],
                    borderColor: [
                        '#7E57C2',
                    ],
                    borderWidth: 3,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 3,
                    tension: .4
                },
                {
                    label: 'Income',
                    data: [1, 2, 5, 3, 12, 7, 15],
                    backgroundColor: [
                        'rgba(187,222,251,0.2)',
                    ],
                    borderColor: [
                        '#42A5F5',
                    ],
                    borderWidth: 3,
                    fill: true,
                    tension: .4
                },
                {
                    label: 'Expenses',
                    data: [7, 12, 15, 5, 3, 13, 21],
                    borderColor: [
                        '#FFB300',
                    ],
                    borderWidth: 3,
                    fill: false,
                    pointRadius: [4, 6, 4, 12, 8, 0, 4],
                    tension: .4
                },
                {
                    label: 'New Users',
                    data: [3, 7, 2, 17, 15, 13, 19],
                    borderColor: [
                        '#66BB6A',
                    ],
                    borderWidth: 3,
                    fill: false,
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            responsive: true,
            hover: {
                mode: 'index'
            },
            scales: {
                x: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                },
                y: {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }
            }
        };

        this.items = [
            {label: 'Save', icon: 'pi pi-fw pi-check'},
            {label: 'Update', icon: 'pi pi-fw pi-refresh'},
            {label: 'Delete', icon: 'pi pi-fw pi-trash'}
        ];

        this.fullCalendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialDate: '2021-02-01',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
        };
    }
}
