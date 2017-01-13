<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [I2T Web App](#i2t-web-app)
	- [Requirements](#requirements)
	- [Development](#development)
		- [Installation](#installation)
		- [Live Reload](#live-reload)
		- [Building](#building)

<!-- /TOC -->

# I2T Web App

## Requirements

- Node.js 7.x+ (`nvm install 7 && nvm use`)
- gulp (`npm i -g gulp`)
- jspm (`npm i -g jspm`)

- Bower endpoint for JSPM:

  ```sh
  npm i -g jspm-bower-endpoint
  jspm registry create bower jspm-bower-endpoint
  ```

## Development

### Installation

```bash
git clone <repository url> <project dir>
cd <project dir>/webapp
cp src/web/app/app.config.js src/web/app/app.config.local.js
npm i && jspm i
```

### Live Reload

`gulp serve`

### Building

`gulp build:<environment>`
