#!/bin/bash
# Copyright (c) 2017 Red Hat, Inc.
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License v1.0
# which accompanies this distribution, and is available at
# http://www.eclipse.org/legal/epl-v10.html

# Just a script to get and build eclipse-che locally
# please send PRs to github.com/kbsingh/build-run-che

# update machine, get required deps in place
# this script assumes its being run on CentOS Linux 7/x86_64

currentDir=$(pwd)
ciDir=$(dirname "$0")
ABSOLUTE_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

set +x

eval "$(./env-toolkit load -f jenkins-env.json -r PASS DEVSHIFT ^QUAY)"

#if [ -z "${QUAY_USERNAME}" ]; then
#  echo "WARNING: failed to get QUAY_USERNAME from jenkins-env file in centos-ci job."
#fi

#if [ -z "${QUAY_PASSWORD}" ]; then
#  echo "WARNING: failed to get QUAY_PASSWORD from jenkins-env file in centos-ci job."
#fi

set -x
yum -y update
yum -y install centos-release-scl-rh java-1.8.0-openjdk-devel git 
yum -y install rh-maven33

scl enable rh-maven33 'mvn clean install -U'

if [ $? -eq 0 ]; then
  echo 'Build Success!'
  exit 0
else
  echo 'Build Failed!'
  exit 1
fi
