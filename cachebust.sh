#!/usr/bin/env bash

TS="$(date '+%s')"
for asset in "js" "css"; do
    perl -pi -e 's/funwithcode.'$asset'.*?">/funwithcode.'$asset'?'$TS'">/g' docs/index.html
done