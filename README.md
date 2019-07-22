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
breathecode-cli/1.1.38 linux-x64 node-v10.15.3
$ breathecode --help [COMMAND]
USAGE
  $ breathecode COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Commands

* [breathecode app:all](#appall)
* [breathecode app:get-todos](#appget-todos)
* [breathecode help [COMMAND]](#help-command)
* [breathecode run:exercises](#runexercises)
* [breathecode run:server](#runserver)
* [breathecode start:all](#startall)
* [breathecode start:django](#startdjango)
* [breathecode start:django-project](#startdjango-project)
* [breathecode start:exercises](#startexercises)
* [breathecode start:flux](#startflux)
* [breathecode start:flux-project](#startflux-project)
* [breathecode start:react](#startreact)
* [breathecode start:react-exercises](#startreact-exercises)
* [breathecode start:react-project](#startreact-project)
* [breathecode start:react-webapp](#startreact-webapp)
* [breathecode start:vanillajs](#startvanillajs)
* [breathecode start:vanillajs-project](#startvanillajs-project)
* [breathecode start:wordpress](#startwordpress)
* [breathecode start:wordpress-project](#startwordpress-project)
* [breathecode test:exercise](#testexercise)
## app:all

Small apps to help developers

```
USAGE
  $ breathecode app:all
```

_See code: [src/commands/app/all.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/app/all.js)_

## app:get-todos

Reads your code looking for //TODO: comments

```
USAGE
  $ breathecode app:get-todos

OPTIONS
  -l, --log                              log scaned files on the console
  -t, --type=js|jsx|scss|css|md|html|py  [default: js] file extensions to look for
```

_See code: [src/commands/app/get-todos.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/app/get-todos.js)_

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

## run:exercises

Runs a small server with all the exercise instructions

```
USAGE
  $ breathecode run:exercises

OPTIONS
  -h, --host=host  [default: localhost] server host
  -o, --output     show build output on console
  -p, --port=port  [default: 8080] server port
```

_See code: [src/commands/run/exercises.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/run/exercises.js)_

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

_See code: [src/commands/run/server.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/run/server.js)_

## start:all

A collection of boilerplates to start new projects

```
USAGE
  $ breathecode start:all
```

_See code: [src/commands/start/all.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/all.js)_

## start:django

Start a new django project or exercise

```
USAGE
  $ breathecode start:django
```

_See code: [src/commands/start/django.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/django.js)_

### start:django-project

Start a new Django+REST project

```
USAGE
  $ breathecode start:django-project
```

_See code: [src/commands/start/django-project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/django-project.js)_

## start:django-project

Start a new Django+REST project

```
USAGE
  $ breathecode start:django-project
```

_See code: [src/commands/start/django-project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/django-project.js)_

## start:exercises

Initialize the boilerplate for creating exercises

```
USAGE
  $ breathecode start:exercises

OPTIONS
  -c, --compiler=compiler  specify what compiler you want: [react, vanilajs]
```

_See code: [src/commands/start/exercises.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/exercises.js)_

## start:flux

Start a new flux project or exercise

```
USAGE
  $ breathecode start:flux
```

_See code: [src/commands/start/flux.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/flux.js)_

### start:flux-project

Start a new React+Flux project

```
USAGE
  $ breathecode start:flux-project

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/flux-project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/flux-project.js)_

## start:flux-project

Start a new React+Flux project

```
USAGE
  $ breathecode start:flux-project

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/flux-project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/flux-project.js)_

## start:react

Start a new react project or exercise

```
USAGE
  $ breathecode start:react
```

_See code: [src/commands/start/react.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/react.js)_

### start:react-exercises

Start a new react project

```
USAGE
  $ breathecode start:react-exercises

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/react-exercises.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/react-exercises.js)_

### start:react-project

Start a new react project

```
USAGE
  $ breathecode start:react-project

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/react-project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/react-project.js)_

### start:react-webapp

Start a new react project

```
USAGE
  $ breathecode start:react-webapp

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/react-webapp.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/react-webapp.js)_

## start:react-exercises

Start a new react project

```
USAGE
  $ breathecode start:react-exercises

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/react-exercises.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/react-exercises.js)_

## start:react-project

Start a new react project

```
USAGE
  $ breathecode start:react-project

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/react-project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/react-project.js)_

## start:react-webapp

Start a new react project

```
USAGE
  $ breathecode start:react-webapp

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/react-webapp.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/react-webapp.js)_

## start:vanillajs

Start a new vanillajs project or exercise

```
USAGE
  $ breathecode start:vanillajs
```

_See code: [src/commands/start/vanillajs.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/vanillajs.js)_

### start:vanillajs-project

Start a new Vanilla.js project

```
USAGE
  $ breathecode start:vanillajs-project

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/vanillajs-project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/vanillajs-project.js)_

## start:vanillajs-project

Start a new Vanilla.js project

```
USAGE
  $ breathecode start:vanillajs-project

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/vanillajs-project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/vanillajs-project.js)_

## start:wordpress

Start a new wordpress project or exercise

```
USAGE
  $ breathecode start:wordpress
```

_See code: [src/commands/start/wordpress.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/wordpress.js)_

### start:wordpress-project

Start a new wordpress project

```
USAGE
  $ breathecode start:wordpress-project

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/wordpress-project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/wordpress-project.js)_

## start:wordpress-project

Start a new wordpress project

```
USAGE
  $ breathecode start:wordpress-project

OPTIONS
  -m, --mode=mode  install a particular branch or version for the boilerplate
  -n, --name=name  [default: hello-rigo] app name
  -r, --root       install on the root directory
```

_See code: [src/commands/start/wordpress-project.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/start/wordpress-project.js)_

## test:exercise

Run a particular exercise in the browser

```
USAGE
  $ breathecode test:exercise

OPTIONS
  -n, --number=number  number of the exercise
```

_See code: [src/commands/test/exercise.js](https://github.com/breatheco-de/breathecode-cli/blob/v1.1.38/src/commands/test/exercise.js)_
<!-- commandsstop -->
