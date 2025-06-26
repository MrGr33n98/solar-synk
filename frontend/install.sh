#!/bin/bash

corepack enable

yarn set version 4.0.2

yarn install 

yarn dlx @yarnpkg/sdks vscode
