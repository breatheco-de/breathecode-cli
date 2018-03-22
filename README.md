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
$ npm install -g @breathecode/breathecode-cli
$ breathecode COMMAND
running command...
$ breathecode (-v|--version|version)
@breathecode/breathecode-cli/0.0.3 linux-x64 node-v8.10.0
$ breathecode --help [COMMAND]
USAGE
  $ breathecode COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Commands

* [breathecode c9:all](#c-9-all)
* [breathecode c9:mysql](#c-9-mysql)
* [breathecode c9:node](#c-9-node)
* [breathecode c9:phpmyadmin](#c-9-phpmyadmin)
* [breathecode generate:all](#generateall)
* [breathecode generate:flux-action](#generateflux-action)
* [breathecode generate:flux-folders](#generateflux-folders)
* [breathecode generate:flux-store](#generateflux-store)
* [breathecode generate:flux-view](#generateflux-view)
* [breathecode generate:react-component](#generatereact-component)
* [breathecode help [COMMAND]](#help-command)
* [breathecode start:all](#startall)
* [breathecode start:django-rest](#startdjango-rest)
* [breathecode start:flux](#startflux)
* [breathecode start:react](#startreact)
## c9:all

Interact with Cloud9 functionalities

```
USAGE
  $ breathecode c9:all
```

_See code: [src/commands/c9/all.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/c9/all.js)_

## c9:mysql

Interact with MySQL

```
USAGE
  $ breathecode c9:mysql

OPTIONS
  --install  install MySQL
  --start    start MySQL
  --stop     stop MySQL
```

_See code: [src/commands/c9/mysql.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/c9/mysql.js)_

## c9:node

Interact node.js

```
USAGE
  $ breathecode c9:node

OPTIONS
  --upgrade  upgrade node to v8
```

_See code: [src/commands/c9/node.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/c9/node.js)_

## c9:phpmyadmin

Interact with PhpMyAdmin

```
USAGE
  $ breathecode c9:phpmyadmin

OPTIONS
  --install  install phpmyadmin
```

_See code: [src/commands/c9/phpmyadmin.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/c9/phpmyadmin.js)_

## generate:all

Generate template code and other boring stuff!

```
USAGE
  $ breathecode generate:all
```

_See code: [src/commands/generate/all.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/generate/all.js)_

## generate:flux-action

Generate a new Flux.Action

```
USAGE
  $ breathecode generate:flux-action

OPTIONS
  -n, --name=name  the action name (optional)
```

_See code: [src/commands/generate/flux-action.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/generate/flux-action.js)_

## generate:flux-folders

Generate flux directory hierarchy

```
USAGE
  $ breathecode generate:flux-folders
```

_See code: [src/commands/generate/flux-folders.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/generate/flux-folders.js)_

## generate:flux-store

Generate a new flux store

```
USAGE
  $ breathecode generate:flux-store

OPTIONS
  -n, --name=name  the store name (optional)
```

_See code: [src/commands/generate/flux-store.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/generate/flux-store.js)_

## generate:flux-view

Generate a new Flux.View

```
USAGE
  $ breathecode generate:flux-view

OPTIONS
  -n, --name=name  the view name (optional)
```

_See code: [src/commands/generate/flux-view.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/generate/flux-view.js)_

## generate:react-component

Generate a new React.Component

```
USAGE
  $ breathecode generate:react-component

OPTIONS
  -n, --name=name  the component name (optional)
```

_See code: [src/commands/generate/react-component.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/generate/react-component.js)_

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

## start:all

A collection of boilerplates to start new projects

```
USAGE
  $ breathecode start:all
```

_See code: [src/commands/start/all.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/start/all.js)_

## start:django-rest

Start a new Django+REST project

```
USAGE
  $ breathecode start:django-rest
```

_See code: [src/commands/start/django-rest.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/start/django-rest.js)_

## start:flux

Start a new React+Flux project

```
USAGE
  $ breathecode start:flux
```

_See code: [src/commands/start/flux.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/start/flux.js)_

## start:react

Start a new react project

```
USAGE
  $ breathecode start:react
```

_See code: [src/commands/start/react.js](https://github.com/breatheco-de/breathecode-cli/blob/v0.0.3/src/commands/start/react.js)_
<!-- commandsstop -->
