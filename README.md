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
breathecode-cli/1.1.97 linux-x64 node-v10.15.3
$ breathecode --help [COMMAND]
USAGE
  $ breathecode COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Commands

* [breathecode download:exercises](#downloadexercises)
* [breathecode download:project](#downloadproject)
* [breathecode help [COMMAND]](#help-command)
* [breathecode init](#init)
* [breathecode login](#login)
* [breathecode run](#run)
* [breathecode update [CHANNEL]](#update-channel)
* [breathecode utils:todo](#utilstodo)
## download:exercises

Start a new project using a boilerplate

```
USAGE
  $ breathecode download:exercises

OPTIONS
  -m, --mode=mode              install a particular branch or version for the boilerplate
  -n, --name=name              [default: hello-rigo] app folder name
  -r, --root                   install on the root directory
  -t, --technology=technology  technology, e.g: [dom,html,css,react,python-lists,python-beginner,etc].

ALIASES
  $ breathecode start:exercises
```

_See code: [src/commands/download/exercises.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.97/src/commands/download/exercises.js)_

## download:project

Start a new project using a boilerplate

```
USAGE
  $ breathecode download:project

OPTIONS
  -m, --mode=mode              install a particular branch or version for the boilerplate
  -n, --name=name              [default: hello-rigo] app folder name
  -r, --root                   install on the root directory
  -t, --technology=technology  technology, e.g: [flask,django,react,flux,vanillajs,wordpress,etc].

ALIASES
  $ breathecode start:project
```

_See code: [src/commands/download/project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.97/src/commands/download/project.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## init

Create new exercises or tutorials

```
USAGE
  $ breathecode init

OPTIONS
  -g, --grading=grading    Grading type for exercises: [isolated, incremental]
  -l, --language=language  specify what language you want: [html, css, react, vanilajs, node, python]
```

_See code: [src/commands/init.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.97/src/commands/init.js)_

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

_See code: [src/commands/login.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.97/src/commands/login.js)_

## run

Runs a small server with all the exercise instructions

```
USAGE
  $ breathecode run

OPTIONS
  -d, --debug                         debugger mode for more verbage
  -d, --disable_grading               disble grading functionality
  -e, --editor=standalone|gitpod      [standalone, gitpod]
  -g, --grading=isolated|incremental  [isolated, incremental]
  -h, --host=host                     server host
  -l, --language=language             specify what language you want: [html, css, react, vanilajs, node, python]
  -p, --port=port                     server port
```

_See code: [src/commands/run.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.97/src/commands/run.js)_

## update [CHANNEL]

update the breathecode CLI

```
USAGE
  $ breathecode update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.9/src/commands/update.ts)_

## utils:todo

Reads your code looking for //TODO: comments

```
USAGE
  $ breathecode utils:todo

OPTIONS
  -l, --log                              log scaned files on the console
  -t, --type=js|jsx|scss|css|md|html|py  [default: js] file extensions to look for
```

_See code: [src/commands/utils/todo.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.97/src/commands/utils/todo.js)_
<!-- commandsstop -->
