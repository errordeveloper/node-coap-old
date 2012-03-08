test: node_modules
	node node_modules/.bin/nodeunit tests/*.unit.js
lint:
	node node_modules/lint/bin/node-lint --config=node-lint.json \
		headers.js message.js options.js server.js handler.js buffers.js tests/*unit.js

node_modules:
	npm install
