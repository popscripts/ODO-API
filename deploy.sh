#!/bin/bash
GREEN="\e[32m"
ENDCOLOR="\e[0m"

echo -e "${GREEN}Install packages.${ENDCOLOR}"
yarn
yarn build
  
clear
echo -e "${GREEN}Clone ODO-MANAGEMENT repo.${ENDCOLOR}"
if [ ! -d ODO-MANAGEMENT/build ]; then
  git clone https://github.com/popscripts/ODO-MANAGEMENT.git
  cd ODO-MANAGEMENT
  git checkout deploy
  cd ../
fi

clear
echo `ls`
echo -e "${GREEN}Copy ODO-MANAGEMENT build files.${ENDCOLOR}"
cp -a ODO-MANAGEMENT/build/. public
