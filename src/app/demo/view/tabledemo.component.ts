import { Component, OnInit } from "@angular/core";
import { CustomerService } from "../service/customerservice";
import { ProductService } from "../service/productservice";
import { BreadcrumbService } from "../../app.breadcrumb.service";
import {
    MessageService,
    ConfirmationService,
    LazyLoadEvent,
    SortEvent,
} from "primeng/api";
import { firstValueFrom, Observable } from "rxjs";
import { UploadFileService } from "src/app/services/upload-file.service";
import { ActivatedRoute, Router } from "@angular/router";
const ALLOWED_TYPES = ["tier", "dossier", "contrat"];
@Component({
    templateUrl: "./tabledemo.component.html",
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
export class TableDemoComponent implements OnInit {
    fileContent!: Observable<any>;
    totalRecords: number;
    fileType = "";
    private size: number;
    private page: number;
    private sortField: string;
    private asc: boolean;
    private searchTerm: string;

    loading = true;

    constructor(
        private router: Router,
        private uploadService: UploadFileService,
        private activatedRoute: ActivatedRoute,
        customerService: CustomerService,
        private productService: ProductService,
        private breadcrumbService: BreadcrumbService,
        private messageService: MessageService,
        private confirmService: ConfirmationService
    ) {
        this.breadcrumbService.setItems([
            { label: "UI Kit" },
            { label: "Table" },
        ]);
    }
    // Reload content after delete or edit
    async reloadContent() {
        if (!this.fileType) return;
        const { count, rows } = await firstValueFrom(
            this.uploadService.getAllObjects(
                this.fileType,
                this.size,
                this.page,
                this.sortField,
                this.asc,
                this.searchTerm
            )
        );
        this.fileContent = rows;
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
        //const params = await firstValueFrom(this.activatedRoute.params)
        this.activatedRoute.params.subscribe((params) => {
            if (
                !params["fileType"] ||
                !ALLOWED_TYPES.includes(params["fileType"])
            ) {
                //if fileType is not passed as param redirect to /upload
                return this.router.navigateByUrl("uikit/file");
            }
            this.fileType = params["fileType"];

            this.sortField = "id";
            this.asc = true;

            // load content for the first time
            return this.reloadContent();
        });
    }
}
