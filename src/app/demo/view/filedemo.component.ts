import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { BreadcrumbService } from "../../app.breadcrumb.service";
import { UploadFileService } from "../../services/upload-file.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { RxStompService } from "src/app/services/rx-stomp.service";
import { tap } from "rxjs";

const REDIRECTION_TIMEOUT = 3000;
@Component({
    templateUrl: "./filedemo.component.html",
    providers: [MessageService],
})
export class FileDemoComponent implements OnInit {
    public redirecting = false
    public isWaiting = false;
    
    form = new FormGroup({
        document: new FormControl("", Validators.required),
    });

    selectedFiles: FileList | undefined;
    currentFile!: File | undefined | null;
    progress = 0;
    message = "";
    uploadedFiles: any[] = [];

    extractedData = null;
    products = [];
    headers = [];

    constructor(
        private messageService: MessageService,
        private breadcrumbService: BreadcrumbService,
        private uploadService: UploadFileService,
        private socket: RxStompService,
        private router: Router,
        
    ) {
        this.breadcrumbService.setItems([
            { label: "UI Kit" },
            { label: "File" },
        ]);
    }

    ngOnInit() {
        this.socket.watch("/kafka/response").pipe(tap(data => {
            this.isWaiting = false;
            this.extractedData = JSON.parse(data.body);
            this.headers = Object.keys(this.extractedData.content);
            this.products = [this.extractedData.content] 

        })).subscribe();
    }
    // select a csv file
    selectFile(event: any) {
        this.selectedFiles = event.target.files;
    }

    onUpload(event: any) {
        const fileType = this.form.get("document")?.value;
        this.progress = 0;
        this.currentFile = event.files?.[0];
        if (this.currentFile) {
            this.isWaiting = false;
            this.extractedData = "";
            this.uploadService.upload(this.currentFile).subscribe(
                async (event) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(
                            (100 * event.loaded) / (event.total ?? 100)
                        );
                    } else if (event instanceof HttpResponse) {
                        this.message = event.body.message;
                        this.isWaiting = true;
                        // show redirection message
                        // this.redirecting = true;

                        // redirect to view page after REDIRECTION_TIMEOUT ms passes
                        // setTimeout(
                        //     () =>
                        //         this.router.navigateByUrl(
                        //             `uikit/table/${fileType}`
                        //         ),
                        //     REDIRECTION_TIMEOUT
                        // );
                    }
                },
                (err) => {
                    this.progress = 0;
                    this.message = "Could not upload the file!";
                    this.currentFile = undefined;
                }
            );
        }
        this.selectedFiles = undefined;

        // this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    onBasicUpload(event) {
        this.messageService.add({
            severity: "info",
            summary: "Success",
            detail: "File Uploaded with Basic Mode",
        });
    }
}
