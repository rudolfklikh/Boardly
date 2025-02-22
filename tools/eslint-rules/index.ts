import {
  RULE_NAME as noReactiveSelectSignalName,
  rule as noReactiveSelectSignal
} from './rules/no-reactive-select-signal';
import {
  RULE_NAME as noDestroyRuleName,
  rule as noDestroyRule
} from './rules/no-destroy-implementation';

module.exports = {
  rules: {
    [noReactiveSelectSignalName]: noReactiveSelectSignal,
    [noDestroyRuleName]: noDestroyRule
  }
};
