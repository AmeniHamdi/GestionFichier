import { Component ,EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { UploadFileService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-tableedit',
  templateUrl: './tableedit.component.html',
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
  constructor(
    private uploadFileService: UploadFileService,
    private messageService: MessageService
  ) {}

  @Input() fileType: string = "";
  @Input() products: any;
  
  @Output() onDelete = new EventEmitter();
  @Output() onEdit = new EventEmitter();

  public headers: string[] = [];

  clonedProducts: { [s: string]: any } = {};
//oninit is no longer available here
  ngOnChanges() {
    this.headers = Object.keys(this.products[0]);
  }

  onRowEditInit(product: any) {
    this.clonedProducts[product.id] = { ...product };
  }

  async onRowDelete(product: any) {
    try {
      await firstValueFrom(
        this.uploadFileService.delete(this.fileType, product.id)
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${this.fileType} is deleted`,
      });
      //Here we inform the parent about the changes
      this.onDelete.emit();
    } catch (error: unknown) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error while deleting ${this.fileType}`,
      });
    }
  }
  async onRowEditSave(product: any) {
    try {
      await firstValueFrom(this.uploadFileService.edit(this.fileType, product));
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${this.fileType} is updated.`,
      });
      this.onEdit.emit();
    } catch (error: unknown) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Error while updating ${this.fileType}`,
      });
    }
  }

  onRowEditCancel(product: any, index: number) {}

}
