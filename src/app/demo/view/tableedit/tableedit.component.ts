import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { MessageService, LazyLoadEvent, SortEvent } from "primeng/api";
import { firstValueFrom, take } from "rxjs";
import { UploadFileService } from "src/app/services/upload-file.service";

@Component({
    selector: "app-tableedit",
    templateUrl: "./tableedit.component.html",
    styles: [
        `
            :host ::ng-deep .p-cell-editing {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
            }
        `,
    ],
})
export class TableeditComponent implements OnChanges {
    @Input() fileType: string = "";
    @Input() products: any;

    @Input() totalRecords: number;

    @Output() onDelete = new EventEmitter();
    @Output() onEdit = new EventEmitter();

    @Output() onLazyLoad = new EventEmitter<LazyLoadEvent>();
    @Output() sortFunction = new EventEmitter<SortEvent>();

    @Output() onSave = new EventEmitter();
    productDialog: boolean;
    product: any;
    submitted: boolean;
    public headers: string[] = [];
    public data: string[] = [];
    clonedProducts: { [s: string]: any } = {};
    addForm: FormGroup;
    globalFilter: true;

    constructor(
        private http: HttpClient,
        private uploadFileService: UploadFileService,
        private messageService: MessageService
    ) {}

    //oninit is no longer available here
    ngOnChanges(changes: SimpleChanges) {
        if (!changes["products"]) return;
        this.headers = Object.keys(this.products[0]);
        this.productDialog = false;
        this.addForm = new FormGroup(
            this.headers.reduce((acc, header) => {
                if (header !== "id") {
                    acc[header] = new FormControl("", Validators.required);
                }
                return acc;
            }, {})
        );
    }

    onRowEditInit(product: any) {
        this.clonedProducts[product.id] = { ...product };
    }

    paramUpdate(event: LazyLoadEvent) {
        this.onLazyLoad.emit(event);
    }

    customSort(event: SortEvent) {
        this.sortFunction.emit(event);
    }

    async onRowDelete(product: any) {
        try {
            await firstValueFrom(
                this.uploadFileService.delete(this.fileType, product.id)
            );
            this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: `${this.fileType} is deleted`,
            });
            //Here we inform the parent about the changes
            this.onDelete.emit();
        } catch (error: unknown) {
            this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: `Error while deleting ${this.fileType}`,
            });
        }
    }
    async onRowEditSave(product: any) {
        try {
            await firstValueFrom(
                this.uploadFileService.edit(this.fileType, product)
            );
            this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: `${this.fileType} is updated.`,
            });
            this.onEdit.emit();
        } catch (error: unknown) {
            this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: `Error while updating ${this.fileType}`,
            });
        }
    }

    async saveProduct() {
        if (this.addForm.invalid) return;
        const product = this.headers.reduce((acc, header) => {
            if (header !== "id") {
                acc[header] = this.addForm.get(header).value;
                // console.log(header);
                //console.log(acc)
            }
            return acc;
        }, {});

        console.log(product);
        try {
            await firstValueFrom(
                this.uploadFileService.save(this.fileType, product)
            );
            this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: `A new ${this.fileType} is added.`,
            });

            this.hideDialog();
            this.submitted = true;
            this.onSave.emit();
        } catch (error: unknown) {
            this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: `Error while adding new ${this.fileType}`,
            });
        }
    }
    onRowEditCancel(product: any, index: number) {}
    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
        // reset the form
        this.addForm.reset();
    }
}
