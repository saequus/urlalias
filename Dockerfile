FROM node:16

ENV PORT=3000

EXPOSE 27017

RUN set -xe \
  && export DEBIAN_FRONTEND=noninteractive \
  && apt-get update -qq \
  && apt-get install -qq --no-install-recommends \
    gnupg2 \
    wget \
    ca-certificates \
  && apt-get update -qq && apt-get upgrade -qq \
  && BUILD_DEPS='build-essential curl python3-dev' \
  && apt-get install -qq --no-install-recommends ${BUILD_DEPS} \
  && apt-get install -qq --no-install-recommends \
    git-core \
    nginx \
    python3 \
    python3-setuptools \
    python3-pip \
    python3-wheel \
  && pip3 install circus \
  && apt-get autoremove -qq ${BUILD_DEPS} \
  && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /opt

COPY package.json yarn.lock ./
COPY public ./public

RUN yarn install

COPY app/ ./app

CMD ["yarn", "serve"]

