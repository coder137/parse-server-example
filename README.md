Table of Contents

- [Parse-Server-Setup](#parse-server-setup)
- [Getting Started](#getting-started)
    - [Changes from the original `parse-server-example`](#changes-from-the-original-parse-server-example)

# Parse-Server-Setup

This is a clone of the [parse-server-example](https://github.com/parse-community/parse-server-example)

# Getting Started

``` bash
npm install -g mongodb-runner
```

- Install global mongodb-runner package
- `npm install`
    - This installs all the packages locally from `package.json`
- `mongodb-runner start`
    - **NOTE**: This is not persisitent storage
    - Go [here](https://github.com/coder137/Parse-Server-Repo/tree/master/python#for-local-tests) to see how to bypass it on windows
    - Alternative is to install `mongodb` from the [official website](https://docs.mongodb.com/manual/installation/)
    - `mongo -v` should be greater than `version 2.6`
    - `mongo` to start
- Start with `npm start`
- Runs the `index.js` file

## Changes from the original `parse-server-example`

- Created `old` Directory
    - `index.js`
    - main `README.md`
- Added `index.js` minimal code with dashboard integration
- Updated `package.json`
- Added *this* README.md
