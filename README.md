# Kintsugi
A very opinionated and batteries-included application development toolkit comprising existing Javascript frameworks. Kintsugi combines the best of many tools to create a cohesive system to manage large and complex applications that are broken down into many packages.

# Phases of a Project
Kintsugi manages the development process into many phases. These are:

## Initialization
* Scaffold project with sample packages
* Setup environment
* Install dependencies

	k init
	k init -g angular2
	k init -g react-redux
	k init -g react-mobservable

## Development
* Create project symlinks for subset of project and dependencies
* Watch file changes and transpile source code for subset of project and dependencies
* Fire up Webpack Dev Server to create in-memory bundle(s)

	k dev
	k dev foo
	k dev foo -d 2
	
## Install New Dependent Package

To install dependent package for a specific pacakge, do this inside the package's directory. Every time a NEWER package is installed, all the project's packages dependency versions will be updated.

	cd package-a
	k install foo bar baz@0.5.0

## Scaffold
* Scaffold new package in the project

	k new foo

## Package
* Build subset of packages or entire project
* Bundle with Webpack

	k build

## Test
* Watch test file changes and transpile test code
* Run tests against the transpilation

	k test

## Publish
* Publish artifacts to npm repository (changed)
* Publish artifacts to file share as tarball

	k publish