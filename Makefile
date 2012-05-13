test: node_modules libcoap_server
	node node_modules/.bin/nodeunit tests/*.unit.js
lint:
	node node_modules/.bin/node-lint --config=node-lint.json \
		headers.js message.js options.js server.js handler.js integer.js content.js tests/*unit.js

node_modules:
	npm install


LIBCOAP_PATH = import/libcoap/

$(LIBCOAP_PATH)/Makefile: $(LIBCOAP_PATH)
	cd $< && ./configure

libcoap: $(LIBCOAP_PATH)/Makefile
	$(MAKE) -C $(LIBCOAP_PATH)

libcoap_server: libcoap
	import/libcoap/examples/coap-server &
