import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { BreadcrumbService } from "../../app.breadcrumb.service";
import { UploadFileService } from "../../services/upload-file.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";

const REDIRECTION_TIMEOUT = 3000;
@Component({
    templateUrl: "./filedemo.component.html",
    providers: [MessageService],
})
export class FileDemoComponent {
    public redirecting = false;
    form = new FormGroup({
        document: new FormControl("", Validators.required),
    });

    selectedFiles: FileList | undefined;
    currentFile!: File | undefined | null;
    progress = 0;
    message = "";
    uploadedFiles: any[] = [];

    constructor(
        private messageService: MessageService,
        private breadcrumbService: BreadcrumbService,
        private uploadService: UploadFileService,
        private router: Router
    ) {
        this.breadcrumbService.setItems([
            { label: "UI Kit" },
            { label: "File" },
        ]);
    }
    // select a csv file
    selectFile(event: any) {
        this.selectedFiles = event.target.files;
    }

    onUpload(event: any) {
        console.log("INSIDE onUpload")
        const fileType = this.form.get("document")?.value;
        this.progress = 0;
        this.currentFile = event.files?.[0];
        console.log("INSIDE onUpload", event)
        if (this.currentFile) {
            this.uploadService.upload(this.currentFile, fileType).subscribe(
                async (event) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(
                            (100 * event.loaded) / (event.total ?? 100)
                        );
                    } else if (event instanceof HttpResponse) {
                        this.message = event.body.message;
                        // show redirection message
                        this.redirecting = true;

                        // redirect to view page after REDIRECTION_TIMEOUT ms passes
                        setTimeout(
                            () =>
                                this.router.navigateByUrl(
                                    `uikit/table/${fileType}`
                                ),
                            REDIRECTION_TIMEOUT
                        );
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
