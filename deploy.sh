#!/bin/bash
GREEN="\e[32m"
ENDCOLOR="\e[0m"

echo -e "${GREEN}Clone ODO-API repo. ${ENDCOLOR}"
if [ ! -d ODO-API ]; then
  git clone https://github.com/popscripts/ODO-API.git
  cd ODO-API

  echo -e "${GREEN}Create .env file ${ENDCOLOR}"
  touch .env
  echo DATABASE_URL='mysql://odoapi:0d0.KA$B3X@localhost:3306/odo' >> .env
  echo PORT=3000 >> .env
  echo ODO_ENV='prod' >> .env
  JWT_KEY=`openssl rand -hex 32`
  echo JWT_SECRET_KEY=$JWT_KEY >> .env
  JWT_REFRESH=`openssl rand -hex 32`
  echo JWT_REFRESH_KEY=$JWT_REFRESH >> .env
fi

clear
echo -e "${GREEN}Install packages.${ENDCOLOR}"
if [ ! -d node_modules ]; then
  yarn
  yarn build
  cd ../
fi

clear
echo -e "${GREEN}Clone ODO-MANAGEMENT repo.${ENDCOLOR}"
if [ ! -d ODO-MANAGEMENT/build ]; then
  git clone https://github.com/popscripts/ODO-MANAGEMENT.git
  cd ODO-MANAGEMENT
  git checkout deploy
  cd ../
fi

clear
echo -e "${GREEN}Copy ODO-MANAGEMENT build files.${ENDCOLOR}"
cp -a ODO-MANAGEMENT/build/. ODO-API/public

cd ODO-API
