breathecode-cli
===============

Command Line Interface for BreatheCode students

[![Version](https://img.shields.io/npm/v/breathecode-cli.svg)](https://npmjs.org/package/breathecode-cli)
[![CircleCI](https://circleci.com/gh/alesanchezr/breathecode/tree/master.svg?style=shield)](https://circleci.com/gh/alesanchezr/breathecode/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/alesanchezr/breathecode?branch=master&svg=true)](https://ci.appveyor.com/project/alesanchezr/breathecode/branch/master)
[![Codecov](https://codecov.io/gh/alesanchezr/breathecode/branch/master/graph/badge.svg)](https://codecov.io/gh/alesanchezr/breathecode)
[![Greenkeeper](https://badges.greenkeeper.io/alesanchezr/breathecode.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/alesanchezr/breathecode/badge.svg)](https://snyk.io/test/github/alesanchezr/breathecode)
[![Downloads/week](https://img.shields.io/npm/dw/breathecode-cli.svg)](https://npmjs.org/package/breathecode-cli)
[![License](https://img.shields.io/npm/l/breathecode-cli.svg)](https://github.com/alesanchezr/breathecode/blob/master/package.json)

<!-- toc -->
* [Install](#install)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
<!-- install -->
# Install

with yarn:
```
$ yarn global add breathecode-cli
```

or with npm:
```
$ npm install -g breathecode-cli
```
<!-- installstop -->
<!-- usage -->
# Usage

```sh-session
$ breathecode COMMAND
running command...
$ breathecode (-v|--version|version)
breathecode-cli/0.0.1 (linux-x64) node-v8.10.0
$ breathecode --help [COMMAND]
USAGE
  $ breathecode COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Commands

* [breathecode hello](#hello)
* [breathecode help [COMMAND]](#help-command)
## hello

Describe the command here

```
USAGE
  $ breathecode hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  Describe the command here
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.1/src/commands/hello.js)_

## help [COMMAND]

display help for breathecode

```
USAGE
  $ breathecode help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

<!-- commandsstop -->
