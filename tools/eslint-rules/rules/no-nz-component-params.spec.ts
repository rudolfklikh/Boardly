import { rule, RULE_NAME } from './no-nz-component-params';
import { RuleTester } from '@typescript-eslint/rule-tester';

const ruleTester = new RuleTester();
ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      name: 'uses nzData to pass data',
      code: `
        import { ErrorModalComponent } from '@order-up/external-shared';

        export class FetchFlowEffects {
          readonly fetchCancelErrorModalParams = {
            nzContent: ErrorModalComponent,
            nzWidth: 600,
            nzClosable: false,
            nzFooter: null,
            nzData: {
              showWarningIcon: false,
              bodyHeader: 'Unable to Cancel the Jobsite Pickup',
              bodyText: 'Please contact support help desk (800) 791-2750',
              primaryButtonText: 'Ok'
            }
          };
        }`
    }
  ],
  invalid: [
    {
      name: 'uses nzComponentParams to pass data',
      code: `
        import { ErrorModalComponent } from '@order-up/external-shared';

        export class FetchFlowEffects {
          readonly fetchCancelErrorModalParams = {
            nzContent: ErrorModalComponent,
            nzWidth: 600,
            nzClosable: false,
            nzFooter: null,
            nzComponentParams: {
              showWarningIcon: false,
              bodyHeader: 'Unable to Cancel the Jobsite Pickup',
              bodyText: 'Please contact support help desk (800) 791-2750',
              primaryButtonText: 'Ok'
            }
          };
        }`,
      errors: [
        {
          messageId: 'doNotUse'
        }
      ]
    }
  ]
});
