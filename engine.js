/* eslint no-nested-ternary: 0 */

const wrap = require('word-wrap');
const map = require('lodash.map');
const longest = require('longest');
const rightPad = require('right-pad');
const chalk = require('chalk');

const helpers = require('./lib/helpers');
const config = require('./config/default.json');

module.exports = (options) => {
  const types = options.types;

  const length = longest(Object.keys(types)).length + 1;
  if (types.chore) delete types.chore;
  if (types.revert) delete types.revert;
  const choices = map(types, (type, key) => ({
    name: `${config[key].emoji} ${rightPad(`${key}:`, length)} ${config[key].desc}`,
    value: key,
  }));

  return {
    prompter(cz, commit) {
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Type of change: ',
          choices,
          default: options.defaultType,
        }, {
          type: 'input',
          name: 'scope',
          message: 'Scope of this change (enter to skip): ',
          default: options.defaultScope,
          filter(value) {
            return value.trim().toLowerCase();
          },
        }, {
          type: 'confirm',
          name: 'isEmoji',
          message: 'Emoji by default ? ',
          default: true,
        }, {
          type: 'input',
          name: 'emoji',
          message: 'Your own Emoji: ',
          when(answers) {
            return !answers.isEmoji;
          },
        }, {
          type: 'input',
          name: 'subject',
          message(answers) {
            return (
              `Description of the change (max ${
                helpers.maxSummaryLength(options, answers)
              } chars): `
            );
          },
          default: options.defaultSubject,
          validate(subject, answers) {
            const filteredSubject = helpers.filterSubject(subject);
            return filteredSubject.length === 0 ? 'subject is required' : filteredSubject.length <= helpers.maxSummaryLength(options, answers) ? true
              : `Length must be less than or equal to ${
                helpers.maxSummaryLength(options, answers)
              }. Current length is ${
                filteredSubject.length
              }.`;
          },
          transformer(subject, answers) {
            const filteredSubject = helpers.filterSubject(subject);
            const color = filteredSubject.length <= helpers.maxSummaryLength(options, answers)
              ? chalk.green
              : chalk.red;
            return color(`(${filteredSubject.length}) ${subject}`);
          },
          filter(subject) {
            return helpers.filterSubject(subject);
          },
        },
        {
          type: 'input',
          name: 'body',
          message:
            'Details (enter to skip): ',
          default: options.defaultBody,
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          message: 'Are there any breaking changes ? ',
          default: false,
        },
        {
          type: 'input',
          name: 'breakingBody',
          default: '-',
          message:
            'A breaking change requires a body. Please enter details: ',
          when(answers) {
            return answers.isBreaking && !answers.body;
          },
          validate(breakingBody) {
            return (
              breakingBody.trim().length > 0
              || 'Detail is required for breaking change'
            );
          },
        },
        {
          type: 'input',
          name: 'breaking',
          message: 'Describe the breaking changes: ',
          when(answers) {
            return answers.isBreaking;
          },
        },

        {
          type: 'confirm',
          name: 'isIssueAffected',
          message: 'Change affect any open issues ? ',
          default: !!options.defaultIssues,
        },
        {
          type: 'input',
          name: 'issuesBody',
          default: '-',
          message:
            'If issues are closed, the commit requires details. Please enter details: ',
          when(answers) {
            return (
              answers.isIssueAffected && !answers.body && !answers.breakingBody
            );
          },
        },
        {
          type: 'input',
          name: 'issues',
          message: 'Add issue references (e.g. "fix #123", "re #123".): ',
          when(answers) {
            return answers.isIssueAffected;
          },
          default: options.defaultIssues ? options.defaultIssues : undefined,
        },
      ]).then((answers) => {
        const wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth,
        };

        // parentheses are only needed when a scope is present
        const scope = answers.scope ? `(${answers.scope})` : '';

        // add emoji
        let emoji = '';
        if (answers.isEmoji) emoji = answers.isEmoji ? ` ${config[answers.type].emoji}` : ` ${answers.emoji}`;
        // Hard limit this line in the validate
        const head = `${answers.type + scope}: ${answers.subject}${emoji}`;

        // Wrap these lines at options.maxLineWidth characters
        const body = answers.body ? wrap(answers.body, wrapOptions) : false;

        // Apply breaking change prefix, removing it if already present
        let breaking = answers.breaking ? answers.breaking.trim() : '';
        breaking = breaking
          ? `breaking change: ${breaking.replace(/^breaking change: /, '')}`
          : '';
        breaking = breaking ? wrap(breaking, wrapOptions) : false;

        const issues = answers.issues ? wrap(answers.issues, wrapOptions) : false;

        commit(helpers.filter([head, body, breaking, issues]).join('\n\n'));
      });
    },
  };
};
