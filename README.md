Project setup
=============================

A starter setup for a gulp project including:
+ BrowserSync
+ JS (lint, minify, concat, sourcemaps)
+ SASS (compile, sourcemaps)
+ CSS (minify)
+ Autoprefixer (Vendor Prefixes)
+ Images (image compression)
+ HTML (minify)

## Requirements

To use this you'll need the following installed:

+ [NodeJS](http://nodejs.org) - use the installer
+ [GulpJS](https://github.com/gulpjs/gulp) - `$ npm install -g gulp`

## Setup

1. `$ git clone git@github.com:afishr/game-of-life.git` or download it into a directory of your choice.
2. Then run `$ npm install` inside that directory. (This should install all the plugins needed)

## Usage

1. To start the browser syncing and file watching, just run `$ npm start` in the project directory.
2. Folders and file paths can be changed in gulpfile.js

## Serve Task
+ To run just server without file watcher and automatic building just run `$ npm serve`

## Build Task

+ The build task should be ran when your project is ready for production with `$ npm build:prod`.
+ Also you can just build the project as if it was builded automatically by file watcher `$ npm build:dev`
+ What does the build task do differently?
  + Compress your images
  + Minify your CSS and not create sourcemaps
  + Not start BrowserSync
