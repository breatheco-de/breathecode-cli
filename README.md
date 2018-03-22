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
$ yarn global add @breathecode/breathecode-cli
```

or with npm:
```
$ npm install -g @breathecode/breathecode-cli
```
<!-- installstop -->
<!-- usage -->
# Usage

```sh-session
$ breathecode COMMAND
running command...
$ breathecode (-v|--version|version)
@breathecode/breathecode-cli/0.0.1 (linux-x64) node-v8.10.0
$ breathecode --help [COMMAND]
USAGE
  $ breathecode COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Commands

* [breathecode generate:all](#generateall)
* [breathecode generate:flux-action](#generateflux-action)
* [breathecode generate:flux-folders](#generateflux-folders)
* [breathecode generate:flux-store](#generateflux-store)
* [breathecode generate:flux-view](#generateflux-view)
* [breathecode generate:react-component](#generatereact-component)
* [breathecode hello](#hello)
* [breathecode help [COMMAND]](#help-command)
## generate:all

Generate template code and other boring stuff!

```
USAGE
  $ breathecode generate:all
```

_See code: [src/commands/generate/all.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.1/src/commands/generate/all.js)_

## generate:flux-action

Generate a new Flux.Action

```
USAGE
  $ breathecode generate:flux-action

OPTIONS
  -n, --name=name  the action name (optional)
```

_See code: [src/commands/generate/flux-action.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.1/src/commands/generate/flux-action.js)_

## generate:flux-folders

Generate flux directory hierarchy

```
USAGE
  $ breathecode generate:flux-folders
```

_See code: [src/commands/generate/flux-folders.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.1/src/commands/generate/flux-folders.js)_

## generate:flux-store

Generate a new flux store

```
USAGE
  $ breathecode generate:flux-store

OPTIONS
  -n, --name=name  the store name (optional)
```

_See code: [src/commands/generate/flux-store.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.1/src/commands/generate/flux-store.js)_

## generate:flux-view

Generate a new Flux.View

```
USAGE
  $ breathecode generate:flux-view

OPTIONS
  -n, --name=name  the view name (optional)
```

_See code: [src/commands/generate/flux-view.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.1/src/commands/generate/flux-view.js)_

## generate:react-component

Generate a new React.Component

```
USAGE
  $ breathecode generate:react-component

OPTIONS
  -n, --name=name  the component name (optional)
```

_See code: [src/commands/generate/react-component.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.1/src/commands/generate/react-component.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.1.6/src/commands/help.ts)_
<!-- commandsstop -->
