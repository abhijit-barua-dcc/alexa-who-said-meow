FROM amazonlinux:latest

RUN yum -y update
RUN yum -y install findutils

ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 6.10.3
RUN touch /root/.profile

RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

ENV workdir=/usr/src/app

RUN mkdir -p $workdir
RUN mkdir -p $workdir

RUN npm --silent install -g grunt-cli@^1.0.x
RUN npm --silent install -g mocha@^4.0.x

WORKDIR $workdir

ADD ./package.json .
ADD ./src/* ./
ADD ./Gruntfile.js .
ADD .jshintrc .

RUN npm --silent install

ENV SKILL_NAME "DefaultSkillName"
ENV SKILL_TAG "latest"

CMD grunt
#CMD tail -f /dev/null
