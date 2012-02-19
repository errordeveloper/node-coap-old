test:
	node node_modules/nodeunit/bin/nodeunit tests/*.unit.js
lint:
	node node_modules/lint/bin/node-lint --config=node-lint.json \
		headers.js message.js options.js server.js tests/*unit.js
