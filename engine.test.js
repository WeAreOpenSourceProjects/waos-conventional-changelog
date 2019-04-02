const chai = require('chai');
const chalk = require('chalk');
const mock = require('mock-require');
const semver = require('semver');

const types = require('conventional-commit-types').types;
const engine = require('./engine');

const expect = chai.expect;
chai.should();

const defaultOptions = {
  types,
  maxLineWidth: 100,
  maxHeaderWidth: 100,
};

const type = 'func';
const scope = 'everything';
const subject = 'testing123';
const longBody = 'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a'
  + 'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a'
  + 'a a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a aa a';
const longBodySplit = `${longBody.slice(0, defaultOptions.maxLineWidth).trim()
}\n${
  longBody
    .slice(defaultOptions.maxLineWidth, 2 * defaultOptions.maxLineWidth)
    .trim()
}\n${
  longBody.slice(defaultOptions.maxLineWidth * 2, longBody.length).trim()}`;
const body = 'A quick brown fox jumps over the dog';
const issues = 'a issues is not a person that kicks things';
const longIssues = 'b b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b'
  + 'b b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b'
  + 'b b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b bb b';
const breakingChange = 'BREAKING CHANGE: ';
const breaking = 'asdhdfkjhbakjdhjkashd adhfajkhs asdhkjdsh ahshd';
const longIssuesSplit = `${longIssues.slice(0, defaultOptions.maxLineWidth).trim()
}\n${
  longIssues
    .slice(defaultOptions.maxLineWidth, defaultOptions.maxLineWidth * 2)
    .trim()
}\n${
  longIssues.slice(defaultOptions.maxLineWidth * 2, longIssues.length).trim()}`;

describe('commit message', () => {
  it('only header w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
      }),
    ).to.equal(`${type}: ${subject}`);
  });
  it('only header w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
      }),
    ).to.equal(`${type}(${scope}): ${subject}`);
  });
  it('header and body w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body,
      }),
    ).to.equal(`${type}: ${subject}\n\n${body}`);
  });
  it('header and body w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
      }),
    ).to.equal(`${type}(${scope}): ${subject}\n\n${body}`);
  });
  it('header, body and issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body,
        issues,
      }),
    ).to.equal(`${type}: ${subject}\n\n${body}\n\n${issues}`);
  });
  it('header, body and issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
        issues,
      }),
    ).to.equal(`${type}(${scope}): ${subject}\n\n${body}\n\n${issues}`);
  });
  it('header, body and long issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body,
        issues: longIssues,
      }),
    ).to.equal(`${type}: ${subject}\n\n${body}\n\n${longIssuesSplit}`);
  });
  it('header, body and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body,
        issues: longIssues,
      }),
    ).to.equal(
      `${type}(${scope}): ${subject}\n\n${body}\n\n${longIssuesSplit}`,
    );
  });
  it('header and long body w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
      }),
    ).to.equal(`${type}: ${subject}\n\n${longBodySplit}`);
  });
  it('header and long body w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
      }),
    ).to.equal(`${type}(${scope}): ${subject}\n\n${longBodySplit}`);
  });
  it('header, long body and issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
        issues,
      }),
    ).to.equal(`${type}: ${subject}\n\n${longBodySplit}\n\n${issues}`);
  });
  it('header, long body and issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        issues,
      }),
    ).to.equal(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${issues}`,
    );
  });
  it('header, long body and long issues w/ out scope', () => {
    expect(
      commitMessage({
        type,
        subject,
        body: longBody,
        issues: longIssues,
      }),
    ).to.equal(`${type}: ${subject}\n\n${longBodySplit}\n\n${longIssuesSplit}`);
  });
  it('header, long body and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        issues: longIssues,
      }),
    ).to.equal(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${longIssuesSplit}`,
    );
  });
  it('header, long body, breaking change, and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        breaking,
        issues: longIssues,
      }),
    ).to.equal(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}\n\n${longIssuesSplit}`,
    );
  });
  it('header, long body, breaking change (with prefix entered), and long issues w/ scope', () => {
    expect(
      commitMessage({
        type,
        scope,
        subject,
        body: longBody,
        breaking: `${breakingChange}${breaking}`,
        issues: longIssues,
      }),
    ).to.equal(
      `${type}(${scope}): ${subject}\n\n${longBodySplit}\n\n${breakingChange}${breaking}\n\n${longIssuesSplit}`,
    );
  });
});

describe('validation', () => {
  it('subject exceeds max length', () => {
    expect(() => commitMessage({
      type,
      scope,
      subject: longBody,
    })).to.throw(
      'length must be less than or equal to '
        + `${defaultOptions.maxLineWidth - type.length - scope.length - 4}`,
    );
  });
  it('empty subject', () => {
    expect(() => commitMessage({
      type,
      scope,
      subject: '',
    })).to.throw('subject is required');
  });
});

describe('defaults', () => {
  it('defaultType default', () => {
    expect(questionDefault('type')).to.be.undefined;
  });
  it('defaultType options', () => {
    expect(
      questionDefault('type', customOptions({ defaultType: type })),
    ).to.equal(type);
  });
  it('defaultScope default', () => {
    expect(questionDefault('scope')).to.be.undefined;
  });
  it('defaultScope options', () => expect(
    questionDefault('scope', customOptions({ defaultScope: scope })),
  ).to.equal(scope));

  it('defaultSubject default', () => expect(questionDefault('subject')).to.be.undefined);
  it('defaultSubject options', () => {
    expect(
      questionDefault(
        'subject',
        customOptions({
          defaultSubject: subject,
        }),
      ),
    ).to.equal(subject);
  });
  it('defaultBody default', () => {
    expect(questionDefault('body')).to.be.undefined;
  });
  it('defaultBody options', () => {
    expect(
      questionDefault('body', customOptions({ defaultBody: body })),
    ).to.equal(body);
  });
  it('defaultIssues default', () => {
    expect(questionDefault('issues')).to.be.undefined;
  });
  it('defaultIssues options', () => {
    expect(
      questionDefault(
        'issues',
        customOptions({
          defaultIssues: issues,
        }),
      ),
    ).to.equal(issues);
  });
});

describe('prompts', () => {
  it('commit subject prompt for commit w/ out scope', () => {
    expect(questionPrompt('subject', { type })).to.contain(
      `(max ${defaultOptions.maxHeaderWidth - type.length - 2} chars)`,
    );
  });
  it('commit subject prompt for commit w/ scope', () => {
    expect(questionPrompt('subject', { type, scope })).to.contain(
      `(max ${defaultOptions.maxHeaderWidth
        - type.length
        - scope.length
        - 4} chars)`,
    );
  });
});

describe('transformation', () => {
  it('subject w/ character count', () => expect(
    questionTransformation('subject', {
      type,
      subject,
    }),
  ).to.equal(chalk.green(`(${subject.length}) ${subject}`)));
  it('long subject w/ character count', () => expect(
    questionTransformation('subject', {
      type,
      subject: longBody,
    }),
  ).to.equal(chalk.red(`(${longBody.length}) ${longBody}`)));
});

describe('filter', () => {
  it('lowercase scope', () => expect(questionFilter('scope', 'HelloMatt')).to.equal('hellomatt'));
  it('lowerfirst subject trimmed and trailing dots striped', () => expect(questionFilter('subject', '  A subject...  ')).to.equal(
    'a subject',
  ));
});

describe('when', () => {
  it('breaking by default', () => expect(questionWhen('breaking', {})).to.be.undefined);
  it('breaking when isBreaking', () => expect(
    questionWhen('breaking', {
      isBreaking: true,
    }),
  ).to.be.true);
  it('issues by default', () => expect(questionWhen('issues', {})).to.be.undefined);
  it('issues when isIssueAffected', () => expect(
    questionWhen('issues', {
      isIssueAffected: true,
    }),
  ).to.be.true);
});

describe('commitlint config header-max-length', () => {
  // commitlint config parser only supports Node 6.0.0 and higher
  if (semver.gte(process.version, '6.0.0')) {
    function mockOptions(headerMaxLength) {
      let options;
      mock('./engine', (opts) => {
        options = opts;
      });
      if (headerMaxLength) {
        mock('cosmiconfig', () => ({
          load(cwd) {
            return {
              filepath: `${cwd}/.commitlintrc.js`,
              config: {
                rules: {
                  'header-max-length': [2, 'always', headerMaxLength],
                },
              },
            };
          },
        }));
      }

      mock.reRequire('./index');
      try {
        return mock
          .reRequire('@commitlint/load')()
          .then(() => options);
      } catch (err) {
        return Promise.resolve(options);
      }
    }

    afterEach(() => {
      delete require.cache[require.resolve('./index')];
      delete require.cache[require.resolve('@commitlint/load')];
      delete process.env.CZ_MAX_HEADER_WIDTH;
      mock.stopAll();
    });

    it('with no environment or commitizen config override', () => mockOptions(72).then((options) => {
      expect(options).to.have.property('maxHeaderWidth', 72);
    }));

    it('with environment variable override', () => {
      process.env.CZ_MAX_HEADER_WIDTH = '105';
      return mockOptions(72).then((options) => {
        expect(options).to.have.property('maxHeaderWidth', 105);
      });
    });

    it('with commitizen config override', () => {
      mock('commitizen', {
        configLoader: {
          load() {
            return {
              maxHeaderWidth: 103,
            };
          },
        },
      });
      return mockOptions(72).then((options) => {
        expect(options).to.have.property('maxHeaderWidth', 103);
      });
    });
  } else {
    // Node 4 doesn't support commitlint so the config value should remain the same
    it('default value for Node 4', () => mockOptions(72).then((options) => {
      expect(options).to.have.property('maxHeaderWidth', 100);
    }));
  }
});
function commitMessage(answers, options) {
  options = options || defaultOptions;
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

function processQuestions(questions, answers, options) {
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

function getQuestions(options) {
  options = options || defaultOptions;
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

function getQuestion(name, options) {
  options = options || defaultOptions;
  const questions = getQuestions(options);
  for (const i in questions) {
    if (questions[i].name === name) {
      return questions[i];
    }
  }
  return false;
}

function questionPrompt(name, answers, options) {
  options = options || defaultOptions;
  const question = getQuestion(name, options);
  return question.message && typeof question.message === 'string'
    ? question.message
    : question.message(answers);
}

function questionTransformation(name, answers, options) {
  options = options || defaultOptions;
  const question = getQuestion(name, options);
  return (
    question.transformer
    && question.transformer(answers[name], answers, options)
  );
}

function questionFilter(name, answer, options) {
  options = options || defaultOptions;
  const question = getQuestion(name, options);
  return (
    question.filter
    && question.filter(typeof answer === 'string' ? answer : answer[name])
  );
}

function questionDefault(name, options) {
  options = options || defaultOptions;
  const question = getQuestion(name, options);
  return question.default;
}

function questionWhen(name, answers, options) {
  options = options || defaultOptions;
  const question = getQuestion(name, options);
  return question.when(answers);
}

function customOptions(options) {
  Object.keys(defaultOptions).forEach((key) => {
    if (options[key] === undefined) {
      options[key] = defaultOptions[key];
    }
  });
  return options;
}
