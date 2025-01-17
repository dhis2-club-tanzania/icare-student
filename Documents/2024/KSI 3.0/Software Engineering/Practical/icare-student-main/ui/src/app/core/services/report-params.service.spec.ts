/* tslint:disable:no-unused-variable */

import { ReportParamsService } from './report-params.service';

describe('Service: ReportParams', () => {
  let httpClientSpy: {
    get: jasmine.Spy;
    post: jasmine.Spy;
    put: jasmine.Spy;
    me: jasmine.Spy;
  };

  let notificationSpy: {
    show: jasmine.Spy;
  };

  let reportParamsService: ReportParamsService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('NgxOpenmrsHttpclientServiceService', [
      'get',
      'post',
      'put',
      'me',
    ]);

    notificationSpy = jasmine.createSpyObj('NotificationService', ['show']);

    reportParamsService = new ReportParamsService(
      httpClientSpy as any,
      notificationSpy as any
    );
  });

  it('should report params service instance', () => {
    expect(reportParamsService).toBeDefined();
  });

  it('should return list of expected report groups', () => {});
});
