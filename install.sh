#!/bin/sh

mkdir static/img/screens
mkdir static/img/screens/thumbs
mkdir static/img/screens/full
touch static/img/screens/screens-list.txt
npm install
bower install
grunt build

if [ ! -f .password ]; then
    openssl rand -base64 48 > .password
fi
