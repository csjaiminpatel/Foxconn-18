import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { DX_IMPORTS, MAT_IMPORTS, SHARED_IMPORTS } from '../../../../../shared-imports';
import { HttpEventType } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import FileSaver from 'file-saver';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../auth/services/Notification/notification.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonCommitFields } from '../../models/commits.model';
import { EnumCommitFieldStructure } from '../../models/supply-visibility.model';
import { CommitsService } from '../../services/Commits/commits.service';
import { StatusMessageComponent } from '../../../shared/components/status-message/status-message.component';

@Component({
  selector: 'orion-platform-commit-documents',
  standalone: true,
  imports: [...SHARED_IMPORTS,...DX_IMPORTS,...MAT_IMPORTS,ProgressSpinnerComponent,ReactiveFormsModule,StatusMessageComponent ],
  templateUrl: './commit-documents.component.html',
  styleUrl: './commit-documents.component.scss'
})
export class CommitDocumentsComponent implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef;

  @Input() explicitData:any;

  @Output() onDataLoad: EventEmitter<any> = new EventEmitter<any>();

  private ngUnsubscribe = new Subject();

  loading = true
  showForm: boolean = false;
  uploadDocument?: FormGroup;
  editDocument?: FormGroup;
  commitDocuments: any = [];
  columns: any = [];
  createFields: any = [];
  editFields: any = [];
  datagridInstance: any;
  documentDetail: any;
  selectedRowId?: string = undefined;
  id: any;
  selectedFile?: File | undefined = undefined;
  selectedFileName?: string = undefined;

  showBorders: boolean = true;
  showColumnLines: boolean = false;
  showRowLines: boolean = true;

  constructor(
    private commitsService: CommitsService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) { }

  ngOnInit() {
    this.columns = new CommonCommitFields(EnumCommitFieldStructure.DocumentTable).fields;
    this.createFields = new CommonCommitFields(EnumCommitFieldStructure.DocumentCreateForm).fields;
    this.editFields = new CommonCommitFields(EnumCommitFieldStructure.DocumentEditForm).fields;
    this.id = this.explicitData?.inboundDeliveryNumber
    this.createForm();
    this.getDocuments(this.id);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }

  get name() {
    return this.uploadDocument?.controls['name'];
  }

  get description() {
    return this.uploadDocument?.controls['description'];
  }

  get editDescription() {
    return this.editDocument?.controls['description'];
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  uploadFile() {
    this.showForm = false;
    if (this.selectedFile) {
      this.loading = true;
      let payload = {
        file: this.selectedFile,
        description: this.description?.value
      }
      this.commitsService
        .uploadCommitDocuments(this.id, payload)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (response) => {
            if (response.type == HttpEventType.Response) {
              this.getDocuments(this.id);
            }
          },
          (error) => {
            //this.notificationService.showError(error);
            this.loading = false;
            this.onDataLoad.emit(true);
          }
        )

    } else {
      this.notificationService.showMessage("No files selected.");
    }

  }

  clearFile(): void {
    this.selectedFile = undefined;
    this.selectedFileName = undefined;
    if (this.fileInput){
      this.fileInput.nativeElement.value = ''
    }
  }

  getDocuments(inboundDeliveryNumber:any) {
    this.loading = true;
    this.commitsService
      .getCommitDocuments(inboundDeliveryNumber)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.commitDocuments = response;
            this.loading = false;
            this.onDataLoad.emit(true);
          }
        },
        (error) => {
          this.commitDocuments = []; // when api not have any data then throws an error
          this.notificationService.showError(error.error.detail);
          this.selectedRowId = undefined;
          this.loading = false;
          this.onDataLoad.emit(true);
        }
      )
  }

  createForm() {
    this.uploadDocument = new FormGroup({
      name: new FormControl(),
      description: new FormControl()
    });
  }

  setEditDocumentForm() {
    this.editDocument = new FormGroup({
      description: new FormControl(this.documentDetail.description)
    });
  }

  showUploadForm() {
    this.showForm = true;
    this.uploadDocument?.reset();
    this.clearFile();
  }

  onCloseForm() {
    this.showForm = false;
  }

  actionClick(type: string, rowData?: any): void {
    switch (type) {
      case 'Download':
        this.downloadDocument(rowData);
        break;

      case 'Open':
        this.onExpandRow(rowData)
        break;

      case 'Close':
        this.onCollapseRow();
        break;

      case 'Delete':
        this.deleteDocument(rowData);
        break;

      default:
        break;
    }
  }

  onExpandRow(rowData: any) {
    if (this.datagridInstance) {
      this.datagridInstance.component.collapseAll(-1);
    }

    this.datagridInstance = rowData
    this.selectedRowId = rowData.data.name;
    this.documentDetail = rowData.data;
    this.setEditDocumentForm()
    this.datagridInstance.component.collapseAll(-1)
    this.datagridInstance.component.expandRow(rowData.data)
  }

  onCollapseRow() {
    this.selectedRowId = undefined;
    this.datagridInstance.component.collapseAll(-1)
  }

  downloadDocument(rowData: any) {
    this.notificationService.showMessage('Downloading.....');
    this.commitsService
      .downloadCommitDocuments(this.id, rowData.name)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            FileSaver.saveAs(response, rowData.name);
            this.notificationService.showMessage('Downloading completed.');
          }
        },
        (error) => {
          this.notificationService.showError(error)
        }
      )
  }

  deleteDocument(rowData: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: this.translate.instant('style.deleteDocumentTitle'),
        content: this.translate.instant('style.deleteDocumentContent'),
        button: this.translate.instant('style.yes'),
        cancelButton: this.translate.instant('style.no'),
        positiveBtnColor: "warn",
        hasBackdrop: true,
        disableClose: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.commitsService
          .deleteCommitDocuments(this.id, rowData.name)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            (response) => {
              if (response) {
                this.getDocuments(this.id);
              }
            },
            (error) => {
              this.notificationService.showError(error)
              this.selectedRowId = undefined;
              this.loading = false;
              this.onDataLoad.emit(true);
            }
          )
      }
    });
  }

  updateCommitDocument() {
    this.loading = true;
    let payload = {
      name: this.documentDetail.name,
      description: this.editDescription?.value
    }
    this.commitsService
      .updateCommitDocuments(this.id, payload)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.getDocuments(this.id);
          }
        },
        (error) => {
          this.notificationService.showError(error)
          this.selectedRowId = undefined;
          this.loading = false;
          this.onDataLoad.emit(true);
        }
      )
  }
}
