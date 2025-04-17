import { Component, EventEmitter, inject, Inject, Input, OnInit, Output } from '@angular/core';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { SHARED_IMPORTS } from '../../../../../shared-imports';
import {MatCardModule} from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../auth/services/Notification/notification.service';
import { LanguageState } from '../../../auth/store/language/language.state';
import { CommitOperationType, EnumHistoryViews, CommitHistoryType, CommonCommitFields } from '../../models/commits.model';
import { EnumCommitFieldStructure } from '../../models/supply-visibility.model';
import { CommitsService } from '../../services/Commits/commits.service';
import {MatTableModule} from '@angular/material/table';
@Component({
  selector: 'orion-platform-commit-history',
  standalone: true,
  imports: [...SHARED_IMPORTS,ProgressSpinnerComponent,MatCardModule,MatDialogModule,MatTableModule ],
  templateUrl: './commit-history.component.html',
  styleUrl: './commit-history.component.scss'
})
export class CommitHistoryComponent implements OnInit {

  private store = inject(Store);


  @Input() explicitData?:any  = undefined;
  @Output() onDataLoad: EventEmitter<any> = new EventEmitter<any>();
  commitOperationType = CommitOperationType;
  currentHistoryView: EnumHistoryViews = EnumHistoryViews.TABLE_VIEW;
  view = EnumHistoryViews;
  commitHistoryTableData:any[]  = [];
  columns:any[] = [] ;

  title = "History"
  loading:boolean = true
  commitHistoryType = CommitHistoryType;
  componentMode:"STANDALONE" | "DIALOG" = "DIALOG";

  currentLang?:any = undefined;
  currentLang$: Observable<string> = this.store.select(LanguageState.getCurrentLang);
  private ngUnsubscribe = new Subject();
  //data vars
  commitHistories : any;

  constructor(
    private commitsService: CommitsService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialog: MatDialog

  ) { }

  ngOnInit() {

    //InitSettings
    this.componentMode = this.explicitData? "STANDALONE" : "DIALOG";
    this.currentLang$.subscribe(
      (language: string) => (this.currentLang = language)
    );

    //Data Settings
    let historyData = null;

    if(this.componentMode == "STANDALONE"){
      historyData = this.explicitData;
    }else{
      historyData = this.dialogData;
    }

    this.getCommitsHistory(historyData.inboundDeliveryNumber);
    this.getCommitHistoryTable(historyData.inboundDeliveryNumber);
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }

  showCommitHistory() {
    this.loading = true;
    this.title = "History";
  }

  getCommitsHistory(inboundDeliveryNumber:any) {
    //NOTE Handle show history in batch edit case
    this.commitsService
      .getCommitHistory(inboundDeliveryNumber)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.loading = false;
            this.commitHistories = response;
            this.onDataLoad.emit(true);
          }
        },
        (error) => {
          this.loading = false;
          this.notificationService.showError("Error! While Fetching History")
          this.onDataLoad.emit(true);
        }
      )
  }

  onChangeHistoryView(historyView: EnumHistoryViews) {
    this.currentHistoryView = historyView;
  }

  getCommitHistoryTable(inboundDeliveryNumber:any) {
    this.commitsService
      .getCommitHistoryTable(inboundDeliveryNumber)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (res && res.length) {
          this.loading = false;
          // For setting columns header dynamically
          const visibleFields = res[0].map(({ name }: { name: string }) => name);
          const commitTableFields = new CommonCommitFields(EnumCommitFieldStructure.CommitHistoryTable, visibleFields).fields;

          commitTableFields.forEach((ctf) => {
            this.columns.push(ctf.headerText);
          });
          
          // For setting the data of row
          this.commitHistoryTableData = res.map((item:any) => {
            let row: any = {};
            item.forEach(({ name, value }: { name: string; value: any }) => {
              commitTableFields.forEach((ctf) => {
                if (ctf.field.toLowerCase() == name.toLowerCase()) {
                  name = ctf.headerText;
                }
                row[name] = value;
              });
            });
            return row;
          });
        }
      });
  }
}
