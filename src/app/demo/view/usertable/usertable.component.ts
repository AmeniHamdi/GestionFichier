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
import { AdminService, User } from "src/app/services/admin.service";

// throttle time between input and emitting search
const INPUT_THROTTLE_MS = 1000;

@Component({
    selector: "app-usertable",
    templateUrl: "./usertable.component.html",
    styles: [
        `
            :host ::ng-deep .p-cell-editing {
                padding-top: 0 !important;
                padding-bottom: 0 !important;
            }
        `,
    ],
})
export class UsertableComponent implements OnChanges, OnInit {
    @Input() users: any;

    @Input() totalRecords: number;

    @Output() onDelete = new EventEmitter();
    @Output() onEdit = new EventEmitter();

    @Output() onLazyLoad = new EventEmitter<LazyLoadEvent>();
    @Output() sortFunction = new EventEmitter<SortEvent>();
    @Output() onSave = new EventEmitter();
    @Output() onInputUpdated = new EventEmitter<string>();

    userDialog: boolean;
    product: any;
    submitted: boolean;
    public headers: string[] = [];
    public data: string[] = [];
    clonedUsers: { [s: string]: any } = {};
    addForm: FormGroup;
    globalFilter: true;
    throttledInput = new BehaviorSubject("");

    constructor(
        private http: HttpClient,
        private adminService: AdminService,
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
        if (!changes || !changes["users"] || !this.users?.length) return;
        this.headers = Object.keys(this.users[0]).filter(header => header !== "password");
        this.userDialog = false;
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
        this.clonedUsers[product.id] = { ...product };
    }

    paramUpdate(event: LazyLoadEvent) {
        this.onLazyLoad.emit(event);
    }

    customSort(event: SortEvent) {
        this.sortFunction.emit(event);
    }

    async onRowDelete(user: User) {
        try {
           const deleted = await firstValueFrom(
                this.adminService.deleteUser(user.id)
            );
            if (deleted) {
                this.messageService.add({
                    severity: "success",
                    summary: "Success",
                    detail: `User: ${user.email} is deleted`,
                });
            } else {
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: `Error while deleting ${user.email}`,
                });
            }
            
            //Here we inform the parent about the changes
            this.onDelete.emit();
        } catch (error: unknown) {
            this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: `Error while deleting ${user.email}`,
            });
        }
    }
    async onRowEditSave(user: User) {

        user.role.id = user.role.role === "ADMIN" ? 0 : 1;
        try {
            await firstValueFrom(
                this.adminService.updateUser(user)
            );
            this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: `${user.email} is updated.`,
            });
            this.onEdit.emit();
        } catch (error: unknown) {
            this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: `Error while updating ${user.email}`,
            });
        }
    }

    onRowEditCancel(product: any, index: number) {}

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
        // reset the form
        this.addForm.reset();
    }
}
