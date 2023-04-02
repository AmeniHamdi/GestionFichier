import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { MessageService, LazyLoadEvent, SortEvent } from "primeng/api";
import { BehaviorSubject, firstValueFrom, take, throttleTime } from "rxjs";
import { UploadFileService } from "src/app/services/upload-file.service";

// throttle time between input and emitting search
const INPUT_THROTTLE_MS = 1000;

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
export class TableeditComponent implements OnChanges, OnInit {
    @Input() fileType: string = "";
    @Input() products: any;

    @Input() totalRecords: number;

    @Output() onDelete = new EventEmitter();
    @Output() onEdit = new EventEmitter();

    @Output() onLazyLoad = new EventEmitter<LazyLoadEvent>();
    @Output() sortFunction = new EventEmitter<SortEvent>();
    @Output() onSave = new EventEmitter();
    @Output() onInputUpdated = new EventEmitter<string>();

    productDialog: boolean;
    product: any;
    submitted: boolean;
    public headers: string[] = [];
    public data: string[] = [];
    clonedProducts: { [s: string]: any } = {};
    addForm: FormGroup;
    globalFilter: true;
    throttledInput = new BehaviorSubject("");

    constructor(
        private http: HttpClient,
        private uploadFileService: UploadFileService,
        private messageService: MessageService
    ) {}

    handleInput(searchTerm: string) {
        this.throttledInput.next(searchTerm);
    }

    throttledInputSubscription() {
        this.throttledInput.pipe(throttleTime(INPUT_THROTTLE_MS, null, {leading: false, trailing: true}))
        .subscribe(input => this.onInputUpdated.emit(input));
    }

    ngOnInit(): void {
        this.throttledInputSubscription()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes || !changes["products"] || !this.products?.length) return;
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
