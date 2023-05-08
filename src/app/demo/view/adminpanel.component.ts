import { Component, OnInit } from "@angular/core";
import { BreadcrumbService } from "../../app.breadcrumb.service";
import {
    MessageService,
    ConfirmationService,
    LazyLoadEvent,
    SortEvent,
} from "primeng/api";
import { firstValueFrom, Observable } from "rxjs";
import { AdminService } from "src/app/services/admin.service";
@Component({
    templateUrl: "./adminpanel.component.html",
    providers: [MessageService, ConfirmationService],
    styleUrls: ["../../../assets/demo/badges.scss"],
    styles: [
        `
            :host ::ng-deep .p-frozen-column {
                font-weight: bold;
            }

            :host ::ng-deep .p-datatable-frozen-tbody {
                font-weight: bold;
            }

            :host ::ng-deep .p-progressbar {
                height: 0.5rem;
            }
        `,
    ],
})
export class AdminPanelComponent implements OnInit {
    userList!: Observable<any>;
    totalRecords: number;
    private size: number;
    private page: number;
    private sortField: string;
    private asc: boolean;
    private searchTerm: string;

    loading = true;

    constructor(
        private adminService: AdminService,
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.setItems([
            { label: "UI Kit" },
            { label: "Table" },
        ]);
    }
    // Reload content after delete or edit
    async reloadContent() {
        const { count, rows } = await firstValueFrom(
            this.adminService.listUsers(
                this.size,
                this.page,
                this.sortField,
                this.asc,
                this.searchTerm
            )
        );
        this.userList = rows;
        this.totalRecords = count;
    }

    onLazyLoad(event: LazyLoadEvent) {
        console.log(event);
        this.sortField = event.sortField;
        this.asc = event.sortOrder === 1;
        this.size = event.rows;
        this.page = Math.ceil(event.first / event.rows);
        this.reloadContent();
    }

    onSearchTerm(event: string) {
        this.searchTerm = event;
        this.reloadContent();
    }

    async ngOnInit() {
        this.sortField = "id";
        this.asc = true;

        // load content for the first time
        return this.reloadContent();
    }
}
