[![Version](https://img.shields.io/npm/v/@breathecode/breathecode-cli.svg)](https://npmjs.org/package/breathecode-cli)
[![Build Status](https://travis-ci.org/breatheco-de/breathecode-cli.svg?branch=master)](https://travis-ci.org/breatheco-de/breathecode-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@breathecode/breathecode-cli.svg)](https://npmjs.org/package/breathecode-cli)
[![License](https://img.shields.io/npm/l/@breathecode/breathecode-cli.svg)](https://github.com/Techniv/Licenses-for-GitHub/tree/master/GNU-GPL)
# BreatheCode-Cli

Command Line Interface for BreatheCode students:
- Download boilerplates.
- Cloud 9 integration.
- Automatic code generation (snippets).
- Syntact correction.
- Any idea? [Suggest new features or integrations here.](https://github.com/breatheco-de/breathecode-cli/issues/new)

## Table of contents

<!-- toc -->
* [BreatheCode-Cli](#breathe-code-cli)
* [Install](#install)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
<!-- install -->
# Install

Make sure you have node 8+
```
$ node -v
```
With npm:
```
$ npm install -g breathecode-cli
```
OR with yarn:
```
$ yarn global add breathecode-cli
```

<!-- installstop -->
<!-- usage -->
# Usage

```sh-session
$ npm install -g breathecode-cli
$ breathecode COMMAND
running command...
$ breathecode (-v|--version|version)
breathecode-cli/1.1.73 linux-x64 node-v10.15.3
$ breathecode --help [COMMAND]
USAGE
  $ breathecode COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Commands

* [breathecode create:exercises](#createexercises)
* [breathecode help [COMMAND]](#help-command)
* [breathecode login](#login)
* [breathecode run:exercises](#runexercises)
* [breathecode run:server](#runserver)
* [breathecode start:exercises](#startexercises)
* [breathecode start:project](#startproject)
* [breathecode utils:todo](#utilstodo)
## create:exercises

Initialize the boilerplate for creating exercises

```
USAGE
  $ breathecode create:exercises

OPTIONS
  -c, --compiler=compiler  specify what compiler you want: [react, vanilajs, node, python]
```

_See code: [src/commands/create/exercises.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.73/src/commands/create/exercises.js)_

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

## login

Login to breathecode

```
USAGE
  $ breathecode login

OPTIONS
  -d, --debug                            debugger mode fro more verbage
  -l, --log                              log scaned files on the console
  -t, --type=js|jsx|scss|css|md|html|py  [default: js] file extensions to look for
```

_See code: [src/commands/login.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.73/src/commands/login.js)_

## run:exercises

Runs a small server with all the exercise instructions

```
USAGE
  $ breathecode run:exercises

OPTIONS
  -d, --debug                     debugger mode fro more verbage
  -e, --editor=standalone|gitpod  [default: standalone] [standalone, gitpod]
  -h, --host=host                 [default: localhost] server host
  -m, --mode=exercises|tutorial   [default: exercises] [exercises, tutorial]
  -o, --output                    show build output on console
  -p, --port=port                 [default: 8080] server port
```

_See code: [src/commands/run/exercises.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.73/src/commands/run/exercises.js)_

## run:server

Runs a dummy server without any configuration

```
USAGE
  $ breathecode run:server

OPTIONS
  -c, --compiler=compiler  compiler type: react, vanillajs, etc.
  -e, --entry=entry        entry file path for the server
  -h, --host=host          [default: localhost] server host
  -p, --port=port          [default: 8080] server port
```

_See code: [src/commands/run/server.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.73/src/commands/run/server.js)_

## start:exercises

Start a new project using a boilerplate

```
USAGE
  $ breathecode start:exercises

OPTIONS
  -m, --mode=mode              install a particular branch or version for the boilerplate
  -n, --name=name              [default: hello-rigo] app folder name
  -r, --root                   install on the root directory
  -t, --technology=technology  technology, e.g: [dom,html,css,react,python-lists,python-beginner,etc].
```

_See code: [src/commands/start/exercises.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.73/src/commands/start/exercises.js)_

## start:project

Start a new project using a boilerplate

```
USAGE
  $ breathecode start:project

OPTIONS
  -m, --mode=mode              install a particular branch or version for the boilerplate
  -n, --name=name              [default: hello-rigo] app folder name
  -r, --root                   install on the root directory
  -t, --technology=technology  technology, e.g: [flask,django,react,flux,vanillajs,wordpress,etc].
```

_See code: [src/commands/start/project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.73/src/commands/start/project.js)_

## utils:todo

Reads your code looking for //TODO: comments

```
USAGE
  $ breathecode utils:todo

OPTIONS
  -l, --log                              log scaned files on the console
  -t, --type=js|jsx|scss|css|md|html|py  [default: js] file extensions to look for
```

_See code: [src/commands/utils/todo.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.73/src/commands/utils/todo.js)_
<!-- commandsstop -->
