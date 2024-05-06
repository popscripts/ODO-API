#!/bin/bash
GREEN="\e[32m"
YELLOW="\e[33m"
ENDCOLOR="\e[0m"

echo -e "${YELLOW}[Install pm2.]${ENDCOLOR}"
yarn add pm2

echo -e "${YELLOW}[Install ODO-API packages.]${ENDCOLOR}"
yarn
yarn build
  
if [ ! -d ODO-MANAGEMENT ]; then
  echo -e "${GREEN}[Clone ODO-MANAGEMENT repo.]${ENDCOLOR}"
  git clone https://github.com/popscripts/ODO-MANAGEMENT.git
  cd ODO-MANAGEMENT
  git checkout deploy
else 
  echo -e "${GREEN}[Pull ODO-MANAGEMENT repo.]${ENDCOLOR}"
  cd ODO-MANAGEMENT
  git checkout deploy
  git pull
fi

echo -e "${GREEN}[Install ODO-MANAGEMENT packages.]${ENDCOLOR}"
npm i

echo -e "${GREEN}[Build ODO-MANAGEMENT app.]${ENDCOLOR}"
npm run build

cd ../

echo -e "${GREEN}[Copy ODO-MANAGEMENT build files.]${ENDCOLOR}"
cp -a ODO-MANAGEMENT/build/. public
