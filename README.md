-------------
-------------

## [switched to @weareopensource/conventional-changelog for concistency](https://github.com/weareopensource/conventional-changelog)

-------------
-------------

[![npm](https://badges.weareopensource.me/npm/v/waos-conventional-changelog.svg?style=flat-square)](https://www.npmjs.com/package/waos-conventional-changelog) [![Build Status](https://badges.weareopensource.me/travis/WeAreOpenSourceProjects/waos-conventional-changelog.svg?style=flat-square)](https://travis-ci.org/WeAreOpenSourceProjects/waos-conventional-changelog) [![Code Climate](https://badges.weareopensource.me/codeclimate/maintainability-percentage/WeAreOpenSourceProjects/waos-conventional-changelog.svg?style=flat-square)](https://codeclimate.com/github/WeAreOpenSourceProjects/waos-conventional-changelog/maintainability)
 [![Dependabot badge](https://badges.weareopensource.me/badge/Dependabot-enabled-2768cf.svg?style=flat-square)](https://dependabot.com)
 [![Known Vulnerabilities](https://snyk.io/test/github/WeAreOpenSourceProjects/waos-conventional-changelog/badge.svg?style=flat-square)](https://snyk.io/test/github/WeAreOpenSourceProjects/waos-conventional-changelog)

# :globe_with_meridians: [WeAreOpenSource](https://weareopensource.me) Vue 4.x

## :book: Presentation

Prompts for [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) standard, based on [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog), which seems to be abandoned. For this reason, we decided to make our own package and included some PRs, switch to ES6 and add an Emoji system for some fun.

PR included :

* yinzara - [feat: implement subject feedback, scope filtering, subject filtering](https://github.com/commitizen/cz-conventional-changelog/pull/75)

![gif](http://waos.ovh/content/gif/waos-conventional-changelog.gif)

## :boom:  Installation

Make sure you have installed all of the following prerequisites on your development machine:

- Node.js (10.x) - [Download & Install Node.js](https://nodejs.org/en/download/)

Global :

```bash
npm install --global commitizen waos-conventional-changelog
```

Local :

```bash
npm install --global commitizen
commitizen init waos-conventional-changelog --save-dev --save-exact
```

# Integration

We suggest to follow something like this : [How to create good commit messages](https://medium.com/@klauskpm/how-to-create-good-commit-messages-67943d30cced). Juste change cz-conventional-changelog part with waos-conventional-changelog

## Configuration

### package.json

Like commitizen, you specify the configuration of cz-conventional-changelog through the package.json's `config.commitizen` key.

```json5
{
// ...  default values
    "config": {
        "commitizen": {
            "path": "./node_modules/cz-conventional-changelog",
            "maxHeaderWidth": 100,
            "maxLineWidth": 100,
            "defaultType": "",
            "defaultScope": "",
            "defaultSubject": "",
            "defaultBody": "",
            "defaultIssues": ""
        }
    }
// ...
}
```

### Environment variables

The following environment varibles can be used to override any default configuration or package.json based configuration.

* CZ_TYPE = defaultType
* CZ_SCOPE = defaultScope
* CZ_SUBJECT = defaultSubject
* CZ_BODY = defaultBody
* CZ_MAX_HEADER_WIDTH = maxHeaderWidth
* CZ_MAX_LINE_WIDTH = maxLineWidth

### Commitlint

If using the [commitlint](https://github.com/conventional-changelog/commitlint) js library, the "maxHeaderWidth" configuration property will default to the configuration of the "header-max-length" rule instead of the hard coded value of 100.  This can be ovewritten by setting the 'maxHeaderWidth' configuration in package.json or the CZ_MAX_HEADER_WIDTH environment variable.

# Licence

[![Packagist](https://badges.weareopensource.me/packagist/l/doctrine/orm.svg?style=flat-square)](/LICENSE.md)

# Dev

Pierre

<<<<<<< Updated upstream
[![Blog](https://badges.weareopensource.me/badge/Read-WAOS%20Blog-1abc9c.svg?style=flat-square)](https://weareopensource.me) [![Slack](https://badges.weareopensource.me/badge/Chat-WAOS%20Slack-d0355b.svg?style=flat-square)](mailto:weareopensource.me@gmail.com?subject=Join%20Slack&body=Hi,%20I%20found%20your%20community%20We%20Are%20Open%20Source.%20I%20would%20be%20interested%20to%20join%20the%20Slack%20to%20share%20and%20discuss,%20Thanks) [![Mail](https://badges.weareopensource.me/badge/Contact-me%20by%20mail-00a8ff.svg?style=flat-square)](mailto:weareopensource.me@gmail.com?subject=Contact) [![Twitter](https://badges.weareopensource.me/badge/Follow-me%20on%20Twitter-3498db.svg?style=flat-square)](https://twitter.com/pbrisorgueil?lang=fr)  [![Youtube](https://badges.weareopensource.me/badge/Watch-me%20on%20Youtube-e74c3c.svg?style=flat-square)](https://www.youtube.com/channel/UCIIjHtrZL5-rFFupn7c3OtA)
=======
[![Blog](https://badges.weareopensource.me/badge/Read-WAOS%20Blog-1abc9c.svg?style=flat-square)](https://blog.weareopensource.me) [![Slack](https://badges.weareopensource.me/badge/Chat-WAOS%20Slack-d0355b.svg?style=flat-square)](mailto:weareopensource.me@gmail.com?subject=Join%20Slack&body=Hi,%20I%20found%20your%20community%20We%20Are%20Open%20Source.%20I%20would%20be%20interested%20to%20join%20the%20Slack%20to%20share%20and%20discuss,%20Thanks) [![Mail](https://badges.weareopensource.me/badge/Contact-me%20by%20mail-00a8ff.svg?style=flat-square)](mailto:weareopensource.me@gmail.com?subject=Contact) [![Twitter](https://badges.weareopensource.me/badge/Follow-me%20on%20Twitter-3498db.svg?style=flat-square)](https://twitter.com/pbrisorgueil?lang=fr)  [![Youtube](https://badges.weareopensource.me/badge/Watch-me%20on%20Youtube-e74c3c.svg?style=flat-square)](https://www.youtube.com/channel/UCIIjHtrZL5-rFFupn7c3OtA)
>>>>>>> Stashed changes
