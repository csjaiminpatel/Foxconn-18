import { TestBed } from '@angular/core/testing';

import { FileUploadWidgetService } from './file-upload-widget.service';

describe('FileUploadWidgetService', () => {
  let service: FileUploadWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileUploadWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
