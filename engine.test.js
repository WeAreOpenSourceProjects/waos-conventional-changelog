/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: 0 */

const types = require('conventional-commit-types').types;
const chalk = require('chalk');
const path = require('path');

// const mock = require('mock-require');
const engine = require(path.resolve('./engine'));

const defaultOptions = {
  types,
  maxLineWidth: 100,
  maxHeaderWidth: 100,
};

const type = 'func';
const scope = 'everything';
const subject = 'testing123';
const longBody = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const body = 'A quick brown fox jumps over the dog';
const issues = 'a issues is not a person that kicks things';
const longIssues = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
const breakingChange = 'BREAKING CHANGE: ';
const breaking = 'asdhdfkjhbakjdhjkashd adhfajkhs asdhkjdsh ahshd';


function processQuestions(questions, answers) {
  for (const i in questions) {
    const question = questions[i];
    const answer = answers[question.name];
    const validation = answer === undefined || !question.validate
      ? true
      : question.validate(answer, answers);
    if (validation !== true) {
      throw new Error(
        validation
            || `Answer '${answer}' to question '${question.name}' was invalid`,
      );
    }
    if (question.filter && answer) {
      answers[question.name] = question.filter(answer);
    }
  }
}


function commitMessage(answers, options = defaultOptions) {
  let result = null;
  engine(options).prompter(
    {
      prompt(questions) {
        return {
          then(finalizer) {
            processQuestions(questions, answers, options);
            finalizer(answers);
          },
        };
      },
    },
    (message) => {
      result = message;
    },
  );
  return result;
}

function getQuestions(options = defaultOptions) {
  let result = null;
  engine(options).prompter({
    prompt(questions) {
      result = questions;
      return {
        then() {},
      };
    },
  });
  return result;
}

function getQuestion(name, options = defaultOptions) {
  const questions = getQuestions(options);
  for (const i in questions) {
    if (questions[i].name === name) {
      return questions[i];
    }
  }
  return false;
}

function questionPrompt(name, answers, options = defaultOptions) {
  const question = getQuestion(name, options);
  return question.message && typeof question.message === 'string'
    ? question.message
    : question.message(answers);
}

function questionTransformation(name, answers, options = defaultOptions) {
  const question = getQuestion(name, options);
  return (
    question.transformer
    && question.transformer(answers[name], answers, options)
  );
}

function questionFilter(name, answer, options = defaultOptions) {
  const question = getQuestion(name, options);
  return (
    question.filter
    && question.filter(typeof answer === 'string' ? answer : answer[name])
  );
}

function questionDefault(name, options = defaultOptions) {
  const question = getQuestion(name, options);
  return question.default;
}

function questionWhen(name, answers, options = defaultOptions) {
  const question = getQuestion(name, options);
  return question.when(answers);
}


describe('commit message', () => {
  test('only header w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
      }),
    ).toEqual(`${type}: ${subject}`);
  });
  test('only header w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
      }),
    ).toEqual(`${type}(${scope}): ${subject}`);
  });
  test('header and body w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body,
      }),
    ).toEqual(`${type}: ${subject}\n\n${body}`);
  });
  test('header and body w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
      }),
    ).toEqual(`${type}(${scope}): ${subject}\n\n${body}`);
  });
  test('header, body and issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body,
        issues,
      }),
    ).toEqual(`${type}: ${subject}\n\n${body}\n\n${issues}`);
  });
  test('header, body and issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
        issues,
      }),
    ).toEqual(`${type}(${scope}): ${subject}\n\n${body}\n\n${issues}`);
  });
  test('header, body and long issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body,
        issues: longIssues,
      }),
    ).toEqual(`${type}: ${subject}\n\n${body}\n\n${longIssues}`);
  });
  test('header, body and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
        issues: longIssues,
      }),
    ).toEqual(`${type}(${scope}): ${subject}\n\n${body}\n\n${longIssues}`);
  });
  test('header and long body w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
      }),
    ).toEqual(`${type}: ${subject}\n\n${longBody}`);
  });
  test('header and long body w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
      }),
    ).toEqual(`${type}(${scope}): ${subject}\n\n${longBody}`);
  });
  test('header, long body and issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
        issues,
      }),
    ).toEqual(`${type}: ${subject}\n\n${longBody}\n\n${issues}`);
  });
  test('header, long body and issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        issues,
      }),
    ).toEqual(`${type}(${scope}): ${subject}\n\n${longBody}\n\n${issues}`);
  });
  test('header, long body and long issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
        issues: longIssues,
      }),
    ).toEqual(`${type}: ${subject}\n\n${longBody}\n\n${longIssues}`);
  });
  test('header, long body and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        issues: longIssues,
      }),
    ).toEqual(
      `${type}(${scope}): ${subject}\n\n${longBody}\n\n${longIssues}`,
    );
  });
  test('header, long body, breaking change, and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        breaking,
        issues: longIssues,
      }),
    ).toEqual(
      `${type}(${scope}): ${subject}\n\n${longBody}\n\n${breakingChange}${breaking}\n\n${longIssues}`,
    );
  });
  test('header, long body, breaking change (with prefix entered), and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        breaking: `${breakingChange}${breaking}`,
        issues: longIssues,
      }),
    ).toEqual(
      `${type}(${scope}): ${subject}\n\n${longBody}\n\n${breakingChange}${breaking}\n\n${longIssues}`,
    );
  });
});

describe('validation', () => {
  test('subject exceeds max length', () => {
    expect(() => commitMessage({
      type,
      scope,
      subject: longBody,
    })).toThrow(
      'length must be less than or equal to '
        + `${defaultOptions.maxLineWidth - type.length - scope.length - 4}`,
    );
  });
  test('empty subject', () => {
    expect(() => commitMessage({
      type,
      scope,
      subject: '',
    })).toThrow('subject is required');
  });
});

describe('defaults', () => {
  test('defaultType default', () => {
    expect(questionDefault('type')).toBeFalsy();
  });
  test('defaultType options', () => {
    expect(
      questionDefault('type', { ...defaultOptions, defaultType: type }),
    ).toEqual(type);
  });
  test('defaultScope default', () => {
    expect(questionDefault('scope')).toBeFalsy();
  });
  test('defaultScope options', () => {
    expect(
      questionDefault('scope', {
        ...defaultOptions,
        defaultScope: scope,
      }),
    ).toEqual(scope);
  });
  test('defaultSubject default', () => {
    expect(questionDefault('subject')).toBeFalsy();
  });
  test('defaultSubject options', () => {
    expect(
      questionDefault('subject', {
        ...defaultOptions,
        defaultSubject: subject,
      }),
    ).toEqual(subject);
  });
  test('defaultBody default', () => {
    expect(questionDefault('body')).toBeFalsy();
  });
  test('defaultBody options', () => {
    expect(
      questionDefault('body', { ...defaultOptions, defaultBody: body }),
    ).toEqual(body);
  });
  test('defaultIssues default', () => {
    expect(questionDefault('issues')).toBeFalsy();
  });
  test('defaultIssues options', () => {
    expect(
      questionDefault('issues', {
        ...defaultOptions,
        defaultIssues: issues,
      }),
    ).toEqual(issues);
  });
});

describe('prompts', () => {
  test('commit subject prompt for commit w/ out scope', () => {
    expect(questionPrompt('subject', { type })).toEqual(
      expect.stringContaining(
        `(max ${defaultOptions.maxHeaderWidth - type.length - 2} chars)`,
      ),
    );
  });
  test('commit subject prompt for commit w/ scope', () => {
    expect(questionPrompt('subject', { type, scope })).toEqual(
      expect.stringContaining(
        `(max ${defaultOptions.maxHeaderWidth
          - type.length
          - scope.length
          - 4} chars)`,
      ),
    );
  });
});

describe('transformation', () => {
  test('subject w/ character count', () => expect(
    questionTransformation('subject', {
      type,
      subject,
    }),
  ).toEqual(chalk.green(`(${subject.length}) ${subject}`)));
  test('long subject w/ character count', () => expect(
    questionTransformation('subject', {
      type,
      subject: longBody,
    }),
  ).toEqual(chalk.red(`(${longBody.length}) ${longBody}`)));
});

describe('filter', () => {
  test('lowercase scope', () => expect(questionFilter('scope', 'HelloMatt')).toEqual('hellomatt'));
  test('lowerfirst subject trimmed and trailing dots striped', () => expect(questionFilter('subject', '  A subject...  ')).toEqual('a subject'));
});

describe('when', () => {
  test('breaking by default', () => expect(questionWhen('breaking', {})).toBeFalsy());
  test('breaking when isBreaking', () => expect(
    questionWhen('breaking', {
      isBreaking: true,
    }),
  ).toBeTruthy());
  test('issues by default', () => expect(questionWhen('issues', {})).toBeFalsy());
  test('issues when isIssueAffected', () => expect(
    questionWhen('issues', {
      isIssueAffected: true,
    }),
  ).toBeTruthy());
});

// TODO: fix mock tests
// describe('commitlint config header-max-length', () => {

//   const mockOptions = async (headerMaxLength) => {
//       var options = undefined;

//       mock('./engine', (opts) => {
//         options = opts;
//       });
//       if (headerMaxLength) {
//         mock('cosmiconfig', () => {
//           return {
//             load: (cwd) => {
//               return {
//                 filepath: cwd + '/.commitlintrc.js',
//                 config: {
//                   rules: {
//                     'header-max-length': [2, 'always', headerMaxLength]
//                   }
//                 }
//               };
//             }
//           };
//         });
//       }

//       mock.reRequire('./index');
//       try {
//         return mock
//           .reRequire('@commitlint/load')()
//           .then(() => {
//             return options;
//           });
//       } catch (err) {
//         return Promise.resolve(options);
//       }
//     }

//     afterEach(() => {
//       delete require.cache[require.resolve('./index')];
//       delete require.cache[require.resolve('@commitlint/load')];
//       delete process.env.CZ_MAX_HEADER_WIDTH;
//       mock.stopAll();
//     });

//     it('with no environment or commitizen config override', async () => {
//       try {
//         const result = await mockOptions(72);
//         console.log('toto', result);
//         expect(result).toBeDefined();
//         expect(result.maxHeaderWidth).toBe(72);
//       } catch (err) {
//          expect(err).toBeFalsy();
//          console.log(err);
//       }
//     });

//     // it('with environment variable override', () => {
//     //   process.env.CZ_MAX_HEADER_WIDTH = '105';
//     //   return mockOptions(72).then((options) => {
//     //     expect(options).toBeDefined();
//     //     expect(options.maxHeaderWidth).toBe(105);
//     //   });
//     // });

//     // it('with commitizen config override', () => {
//     //   mock('commitizen', {
//     //     configLoader: {
//     //       load: () => {
//     //         return {
//     //           maxHeaderWidth: 103
//     //         };
//     //       }
//     //     }
//     //   });
//     //   return mockOptions(72).then((options) => {
//     //     expect(options).toBeDefined();
//     //     expect(options.maxHeaderWidth).toBe(103)
//     //   });
//     // });
// });
