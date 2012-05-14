test: node_modules libcoap_server
	node node_modules/.bin/nodeunit tests/*.unit.js
lint:
	node node_modules/.bin/node-lint --config=node-lint.json \
		headers.js message.js options.js server.js handler.js integer.js content.js tests/*unit.js

node_modules:
	npm install


ifdef TRAVIS
  BUILD_LOG := /dev/null
else
  BUILD_LOG := ./build.log
endif

LIBCOAP_PATH = import/libcoap/
LIBCOAP_SERVER_PORT = 15683

$(LIBCOAP_PATH)/Makefile: $(LIBCOAP_PATH)
	(cd $< && autoconf && ./configure) > $(BUILD_LOG)

libcoap: $(LIBCOAP_PATH)/Makefile
	$(MAKE) -C $(LIBCOAP_PATH) >> $(BUILD_LOG)

ifdef TRAVIS
libcoap_server: libcoap
	import/libcoap/examples/coap-server -p $(LIBCOAP_SERVER_PORT) &
else
libcoap_server:
	import/libcoap/examples/coap-server -v9 -p $(LIBCOAP_SERVER_PORT) &
endif
