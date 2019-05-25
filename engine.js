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
  const choices = map(types, (type, key) => ({
    name: `${rightPad(`${key}:`, length)} ${type.description} ${config.emojis[key]}`,
    value: key,
  }));

  return {
    prompter(cz, commit) {
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Select the type of change that you\'re committing:',
          choices,
          default: options.defaultType,
        }, {
          type: 'input',
          name: 'scope',
          message: 'What is the scope of this change (e.g. component or file name): (press enter to skip)',
          default: options.defaultScope,
          filter(value) {
            return value.trim().toLowerCase();
          },
        }, {
          type: 'confirm',
          name: 'isEmoji',
          message: 'Add Emoji by default ?',
          default: true,
        }, {
          type: 'input',
          name: 'emoji',
          message: 'Add your own Emoji :\n',
          when(answers) {
            return !answers.isEmoji;
          },
        }, {
          type: 'input',
          name: 'subject',
          message(answers) {
            return (
              `Write a short, imperative tense description of the change (max ${
                helpers.maxSummaryLength(options, answers)
              } chars):\n`
            );
          },
          default: options.defaultSubject,
          validate(subject, answers) {
            const filteredSubject = helpers.filterSubject(subject);
            return filteredSubject.length === 0 ? 'subject is required' : filteredSubject.length <= helpers.maxSummaryLength(options, answers) ? true
              : `Subject length must be less than or equal to ${
                helpers.maxSummaryLength(options, answers)
              } characters. Current length is ${
                filteredSubject.length
              } characters.`;
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
            'Provide a longer description of the change: (press enter to skip)\n',
          default: options.defaultBody,
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          message: 'Are there any breaking changes?',
          default: false,
        },
        {
          type: 'input',
          name: 'breakingBody',
          default: '-',
          message:
            'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n',
          when(answers) {
            return answers.isBreaking && !answers.body;
          },
          validate(breakingBody) {
            return (
              breakingBody.trim().length > 0
              || 'Body is required for BREAKING CHANGE'
            );
          },
        },
        {
          type: 'input',
          name: 'breaking',
          message: 'Describe the breaking changes:\n',
          when(answers) {
            return answers.isBreaking;
          },
        },

        {
          type: 'confirm',
          name: 'isIssueAffected',
          message: 'Does this change affect any open issues?',
          default: !!options.defaultIssues,
        },
        {
          type: 'input',
          name: 'issuesBody',
          default: '-',
          message:
            'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself:\n',
          when(answers) {
            return (
              answers.isIssueAffected && !answers.body && !answers.breakingBody
            );
          },
        },
        {
          type: 'input',
          name: 'issues',
          message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
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
        if (answers.isEmoji) emoji = answers.isEmoji ? ` ${config.emojis[answers.type]}` : ` ${answers.emoji}`;
        // Hard limit this line in the validate
        const head = `${answers.type + scope}: ${answers.subject}${emoji}`;

        // Wrap these lines at options.maxLineWidth characters
        const body = answers.body ? wrap(answers.body, wrapOptions) : false;

        // Apply breaking change prefix, removing it if already present
        let breaking = answers.breaking ? answers.breaking.trim() : '';
        breaking = breaking
          ? `BREAKING CHANGE: ${breaking.replace(/^BREAKING CHANGE: /, '')}`
          : '';
        breaking = breaking ? wrap(breaking, wrapOptions) : false;

        const issues = answers.issues ? wrap(answers.issues, wrapOptions) : false;

        commit(helpers.filter([head, body, breaking, issues]).join('\n\n'));
      });
    },
  };
};
