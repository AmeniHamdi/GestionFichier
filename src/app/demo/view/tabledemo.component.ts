import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Customer, Representative } from "../domain/customer";
import { CustomerService } from "../service/customerservice";
import { Product } from "../domain/product";
import { ProductService } from "../service/productservice";
import { Table } from "primeng/table";
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
                this.page
            )
        );
        this.fileContent = rows;
        this.totalRecords = count;
    }

    onLazyLoad(event: LazyLoadEvent) {
        //console.log(event);
        this.size = event.rows;
        this.page = Math.ceil(event.first / event.rows);
        this.reloadContent();
    }

    sortFunction(event: SortEvent) {
        console.log(event);
        event.data.sort((data1, data2) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;
            console.log("result", result);
            console.log("value1", value1);
            console.log("value2", value2);

            if (value1 == null && value2 != null) result = -1;
            else if (value1 != null && value2 == null) result = 1;
            else if (value1 == null && value2 == null) result = 0;
            else if (typeof value1 === "string" && typeof value2 === "string")
                result = value1.localeCompare(value2);
            else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

            return event.order * result;
        });
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

            // load content for the first time
            return this.reloadContent();
        });
    }
     data1 = this.fileContent;
     data2 = this.fileContent;
}
