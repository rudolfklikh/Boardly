import {
  rule as noCallbackInSelectSignal,
  RULE_NAME as noCallbackInSelectSignalName
} from './rules/no-callback-in-select-signal';
import {
  rule as noDestroyRule,
  RULE_NAME as noDestroyRuleName
} from './rules/no-destroy-implementation';
import {
  rule as noNzComponentParams,
  RULE_NAME as noNzComponentParamsName
} from './rules/no-nz-component-params';
import {
  rule as noReactiveSelectSignal,
  RULE_NAME as noReactiveSelectSignalName
} from './rules/no-reactive-select-signal';

import {
  rule as checkSignalUsage,
  RULE_NAME as checkSignalUsageName
} from './rules/check-signal-usage';

import {
  rule as checkSignalUsageTemplate,
  RULE_NAME as checkSignalUsageTemplateName
} from './rules/check-signal-usage-template';

import {
  rule as noSignalFuncsInTemplate,
  RULE_NAME as noSignalFuncsInTemplateName
} from './rules/no-signal-funcs-in-template';

import {
  rule as noInvalidSignalInitialization,
  RULE_NAME as noInvalidSignalInitializationName
} from './rules/no-invalid-signal-initialization';

import {
  rule as noSignalsInGetters,
  RULE_NAME as noSignalsInGettersName
} from './rules/no-signals-in-getters';

module.exports = {
  rules: {
    [checkSignalUsageName]: checkSignalUsage,
    [checkSignalUsageTemplateName]: checkSignalUsageTemplate,
    [noCallbackInSelectSignalName]: noCallbackInSelectSignal,
    [noInvalidSignalInitializationName]: noInvalidSignalInitialization,
    [noNzComponentParamsName]: noNzComponentParams,
    [noReactiveSelectSignalName]: noReactiveSelectSignal,
    [noSignalFuncsInTemplateName]: noSignalFuncsInTemplate,
    [noSignalsInGettersName]: noSignalsInGetters,
    [noDestroyRuleName]: noDestroyRule
  }
};
