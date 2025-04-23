const express = require('express');
const utils = require('../utils');
const router = express.Router();
const HTMLParser = require('node-html-parser');

/* GET routes */
router.get('/routes', async function (req, res, next) {
    // const response = await fetch(req.app.get('apisix_url') + '/v1/routes');
    // const data = await response.json();
    const data = [{
        'createdIndex': 18,
        'orig_modifiedIndex': 40,
        'clean_handlers': {},
        'key': '/apisix/routes/561958181249483467',
        'modifiedIndex': 40,
        'value': {
            'create_time': 1744482777,
            'name': 'myroute',
            'status': 1,
            'plugins': {
                'consumer-restriction': {
                    'type': 'consumer_name',
                    '_meta': {'disable': false},
                    'whitelist': ['mikonsum'],
                    'rejected_code': 403
                }
            },
            'desc': 'Una ruta de prueba',
            'service_id': '561958100098089675',
            'methods': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE', 'PURGE'],
            'priority': 0,
            'update_time': 1744534729,
            'id': '561958181249483467',
            'uris': ['/prueba/*', '/oooo/*']
        },
        'has_domain': false
    }, {
        'createdIndex': 22,
        'orig_modifiedIndex': 22,
        'clean_handlers': {},
        'key': '/apisix/routes/561959051852776139',
        'modifiedIndex': 22,
        'value': {
            'create_time': 1744483296,
            'name': 'route-up',
            'status': 0,
            'plugins': {
                'proxy-rewrite': {
                    'regex_uri': ['/control/(.*)/', '/$1/'],
                    'use_real_request_uri_unsafe': false
                }
            },
            'service_id': '561958828715803339',
            'methods': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE', 'PURGE'],
            'priority': 0,
            'update_time': 1744483296,
            'id': '561959051852776139',
            'uri': '/control/*'
        },
        'has_domain': false
    }, {
        'createdIndex': 43,
        'orig_modifiedIndex': 43,
        'clean_handlers': {},
        'key': '/apisix/routes/562054221298402010',
        'modifiedIndex': 43,
        'value': {
            'create_time': 1744540022,
            'name': 'uno1',
            'status': 1,
            'methods': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE', 'PURGE'],
            'service_id': '562054129308926682',
            'priority': 0,
            'uri': '/uno/*',
            'id': '562054221298402010',
            'update_time': 1744540022
        },
        'has_domain': false
    }, {
        'createdIndex': 44,
        'orig_modifiedIndex': 44,
        'clean_handlers': {},
        'key': '/apisix/routes/562054242823570138',
        'modifiedIndex': 44,
        'value': {
            'create_time': 1744540034,
            'name': 'uno2',
            'status': 1,
            'methods': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE', 'PURGE'],
            'service_id': '562054129308926682',
            'priority': 0,
            'uri': '/dos/*',
            'id': '562054242823570138',
            'update_time': 1744540034
        },
        'has_domain': false
    }, {
        'createdIndex': 45,
        'orig_modifiedIndex': 45,
        'clean_handlers': {},
        'key': '/apisix/routes/562054408985117402',
        'modifiedIndex': 45,
        'value': {
            'create_time': 1744540133,
            'name': 'tres',
            'status': 1,
            'host': '*.ccc.com',
            'methods': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'TRACE'],
            'remote_addr': '1.1.1.1',
            'uri': '/tres/*',
            'priority': 0,
            'update_time': 1744540133,
            'id': '562054408985117402',
            'plugins': {'proxy-rewrite': {'method': 'POST', 'use_real_request_uri_unsafe': false}}
        },
        'has_domain': false
    }, {
        'createdIndex': 47,
        'orig_modifiedIndex': 48,
        'clean_handlers': {},
        'key': '/apisix/routes/562109432381571802',
        'modifiedIndex': 48,
        'value': {
            'create_time': 1744572930,
            'name': 'sin-na2',
            'status': 1,
            'methods': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE', 'PURGE'],
            'upstream': {
                'hash_on': 'vars',
                'keepalive_pool': {'requests': 1000, 'idle_timeout': 60, 'size': 320},
                'scheme': 'http',
                'pass_host': 'pass',
                'timeout': {'send': 6, 'connect': 6, 'read': 6},
                'type': 'least_conn',
                'nodes': [{'host': '3.4.5.6', 'port': 4444, 'weight': 1}]
            },
            'priority': 0,
            'uri': '/na/*',
            'id': '562109432381571802',
            'update_time': 1744572962
        },
        'has_domain': false
    }, {
        'createdIndex': 50,
        'orig_modifiedIndex': 50,
        'clean_handlers': {},
        'key': '/apisix/routes/562111283512476378',
        'modifiedIndex': 50,
        'value': {
            'create_time': 1744574033,
            'name': 'con-up-existente',
            'status': 1,
            'methods': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE', 'PURGE'],
            'uri': '/*',
            'priority': 0,
            'id': '562111283512476378',
            'update_time': 1744574033,
            'upstream_id': '561957799953695435'
        },
        'has_domain': false
    }, {
        'createdIndex': 67,
        'orig_modifiedIndex': 67,
        'clean_handlers': {},
        'key': '/apisix/routes/562230525662593747',
        'modifiedIndex': 67,
        'value': {
            'create_time': 1744645107,
            'name': 'multi-remote-addr',
            'status': 1,
            'methods': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE', 'PURGE'],
            'remote_addrs': ['1.2.3.4', '5.6.7.8'],
            'upstream': {
                'hash_on': 'vars',
                'keepalive_pool': {'requests': 1000, 'idle_timeout': 60, 'size': 320},
                'scheme': 'http',
                'pass_host': 'pass',
                'timeout': {'send': 6, 'connect': 6, 'read': 6},
                'type': 'roundrobin',
                'nodes': [{'host': '3.4.5.6', 'port': 1111, 'weight': 1}]
            },
            'priority': 0,
            'update_time': 1744645107,
            'uri': '/*',
            'id': '562230525662593747'
        },
        'has_domain': false
    }];
    let list = [];
    let mapper = {};
    for (const el of data) {
        list.push(el.value.id);
        mapper[el.value.id] = el.value.name;
    }
    res.json({data: utils.sortArrayOfObjects(data), ids: list, names: mapper, total: data.length});
});


/* GET route/id */
router.get('/route/:id', async function (req, res, next) {
    const id = req.params.id;
    const response = await fetch(req.app.get('apisix_url') + '/v1/route/' + id);
    const data = await response.json();
    res.json(data);
});

/* GET services */
router.get('/services', async function (req, res, next) {
    // const response = await fetch(req.app.get('apisix_url') + '/v1/services');
    // const data = await response.json();
    const data = [{
        'createdIndex': 17,
        'clean_handlers': {},
        'key': '/apisix/services/561958100098089675',
        'modifiedIndex': 19,
        'value': {
            'create_time': 1744482729,
            'name': 'myservice',
            'desc': 'Servicio de prueba',
            'id': '561958100098089675',
            'plugins': {
                'pepe-plugin': {'data': 1},
                'pepe-plugin': {'data': 1},
                'pepe-plugin2': {'data': 1},
                'pepe-plugin3': {'data': 1},
                'pepe-plugin4': {'data': 1},
                'pepe-plugin5': {'data': 1},
                'pepe-plugin6': {'data': 1},
                'pocho-plugin': {'data': 1},
                'jaja-plugin': {'data': 1, '_meta': {'disable': true}},
                'response-rewrite': {
                    'status_code': 201,
                    'headers': {'set': {'Content-Type': 'application/json'}},
                    'body_base64': false,
                    'body': '{\'msg\':\'Hola\'}',
                    '_meta': {'disable': false}
                }
            },
            'update_time': 1744482904,
            'upstream_id': '561957799953695435'
        },
        'has_domain': false
    }, {
        'createdIndex': 21,
        'clean_handlers': {},
        'key': '/apisix/services/561958828715803339',
        'modifiedIndex': 21,
        'value': {
            'create_time': 1744483163,
            'name': 'service-up',
            'id': '561958828715803339',
            'update_time': 1744483163,
            'upstream_id': '561958803298321099'
        },
        'has_domain': false
    }, {
        'createdIndex': 41,
        'clean_handlers': {},
        'key': '/apisix/services/562054129308926682',
        'modifiedIndex': 41,
        'value': {
            'create_time': 1744539967,
            'name': 'unservicio',
            'update_time': 1744539967,
            'id': '562054129308926682',
            'hosts': ['*.hosti.com'],
            'desc': 'MI service'
        },
        'has_domain': false
    }, {
        'createdIndex': 42,
        'clean_handlers': {},
        'key': '/apisix/services/562054175161058010',
        'modifiedIndex': 42,
        'value': {
            'create_time': 1744539994,
            'name': 'dosservice',
            'update_time': 1744539994,
            'desc': 'Otro service',
            'id': '562054175161058010',
            'upstream': {
                'hash_on': 'vars',
                'keepalive_pool': {'requests': 1000, 'idle_timeout': 60, 'size': 320},
                'scheme': 'http',
                'pass_host': 'pass',
                'timeout': {'send': 6, 'connect': 6, 'read': 6},
                'type': 'least_conn',
                'nodes': [{'host': 'hostito', 'port': 7777, 'weight': 1}]
            }
        },
        'has_domain': true
    }, {
        'createdIndex': 46,
        'clean_handlers': {},
        'key': '/apisix/services/562108275777077978',
        'modifiedIndex': 106,
        'value': {
            'create_time': 1744572241,
            'name': 'conupyhost',
            'update_time': 1744926258,
            'id': '562108275777077978',
            'desc': 'Descripción de un service muy larga, muy larga, tanto que no cabe aquí.\n\nAdemás tiene líneas.',
            'hosts': ['*.macario.com'],
            'upstream_id': '561957799953695435'
        },
        'has_domain': false
    }, {
        'createdIndex': 49,
        'clean_handlers': {},
        'key': '/apisix/services/562110319560753882',
        'modifiedIndex': 49,
        'value': {
            'create_time': 1744573459,
            'name': 'diferencia-hosts-de-host',
            'update_time': 1744573459,
            'id': '562110319560753882',
            'hosts': ['hosts.com'],
            'upstream': {
                'hash_on': 'vars',
                'keepalive_pool': {'requests': 1000, 'idle_timeout': 60, 'size': 320},
                'scheme': 'http',
                'pass_host': 'pass',
                'timeout': {'send': 6, 'connect': 6, 'read': 6},
                'type': 'roundrobin',
                'nodes': [{'host': 'host.com', 'port': 1234, 'weight': 1}]
            }
        },
        'has_domain': true
    }];
    let list = [];
    let mapper = {};
    for (const el of data) {
        list.push(el.value.id);
        mapper[el.value.id] = el.value.name;
    }
    res.json({data: utils.sortArrayOfObjects(data), ids: list, names: mapper, total: data.length});
});


/* GET service/id */
router.get('/service/:id', async function (req, res, next) {
    const id = req.params.id;
    const response = await fetch(req.app.get('apisix_url') + '/v1/service/' + id);
    const data = await response.json();
    res.json(data);
});

/* GET upstreams */
router.get('/upstreams', async function (req, res, next) {
    // const response = await fetch(req.app.get('apisix_url') + '/v1/upstreams');
    // const data = await response.json();
    const data = [{
        'createdIndex': 16,
        'clean_handlers': {},
        'key': '/apisix/upstreams/561957799953695435',
        'modifiedIndex': 105,
        'value': {
            'create_time': 1744482550,
            'retries': 1,
            'scheme': 'https',
            'update_time': 1744888163,
            'id': '561957799953695435',
            'pass_host': 'pass',
            'nodes': [{'host': 'google.es', 'port': 443, 'weight': 2}, {'host': 'google.it', 'port': 443, 'weight': 4}],
            'hash_on': 'vars',
            'desc': 'Descripción del upstream',
            'keepalive_pool': {'requests': 1000, 'idle_timeout': 60, 'size': 320},
            'name': 'myupstream',
            'timeout': {'send': 6, 'connect': 6, 'read': 6},
            'type': 'roundrobin',
            'retry_timeout': 5000
        },
        'has_domain': true
    }, {
        'createdIndex': 20,
        'clean_handlers': {},
        'key': '/apisix/upstreams/561958803298321099',
        'modifiedIndex': 20,
        'value': {
            'create_time': 1744483148,
            'name': 'control-up',
            'scheme': 'http',
            'pass_host': 'pass',
            'nodes': [{'host': '127.0.0.1', 'port': 9090, 'weight': 1}],
            'hash_on': 'vars',
            'keepalive_pool': {'requests': 1000, 'idle_timeout': 60, 'size': 320},
            'update_time': 1744483148,
            'timeout': {'send': 6, 'connect': 6, 'read': 6},
            'type': 'roundrobin',
            'id': '561958803298321099'
        },
        'has_domain': false
    }, {
        'createdIndex': 51,
        'clean_handlers': {},
        'key': '/apisix/upstreams/562112014311228122',
        'modifiedIndex': 70,
        'value': {
            'create_time': 1744574469,
            'name': 'unsolohost',
            'scheme': 'https',
            'pass_host': 'pass',
            'nodes': [{'host': 'google.com', 'port': 443, 'weight': 1}],
            'hash_on': 'vars',
            'keepalive_pool': {'requests': 1000, 'idle_timeout': 60, 'size': 320},
            'update_time': 1744650750,
            'timeout': {'send': 6, 'connect': 6, 'read': 6},
            'type': 'roundrobin',
            'id': '562112014311228122',
            "checks": {
                "passive": {
                    "healthy": {
                        "successes": 5,
                        "http_statuses": [200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 306, 307, 308]
                    },
                    "type": "http",
                    "unhealthy": {
                        "http_statuses": [429, 500, 503],
                        "http_failures": 2,
                        "tcp_failures": 2,
                        "timeouts": 7
                    }
                },
                "active": {
                    "concurrency": 10,
                    "http_path": "/",
                    "timeout": 1,
                    "healthy": {
                        "successes": 2,
                        "interval": 1,
                        "http_statuses": [200, 302]
                    },
                    "type": "http",
                    "unhealthy": {
                        "interval": 1,
                        "http_statuses": [429, 404, 500, 501, 502, 503, 504, 505],
                        "http_failures": 5,
                        "tcp_failures": 2,
                        "timeouts": 3
                    },
                    "https_verify_certificate": true
                }
            }
        },
        'has_domain': true
    }];
    let list = [];
    let mapper = {};
    for (const el of data) {
        list.push(el.value.id);
        mapper[el.value.id] = el.value.name;
    }
    res.json({data: utils.sortArrayOfObjects(data), ids: list, names: mapper, total: data.length});
});


/* GET upstream/id */
router.get('/upstream/:id', async function (req, res, next) {
    const id = req.params.id;
    const response = await fetch(req.app.get('apisix_url') + '/v1/upstream/' + id);
    const data = await response.json();
    res.json(data);
});

/* GET plugin_metadatas */
router.get('/plugin_metadatas', async function (req, res, next) {
    const response = await fetch(req.app.get('apisix_url') + '/v1/plugin_metadatas');
    const data = await response.json();
    res.json(data);
});

/* GET plugin_metadata/name */
router.get('/plugin_metadata/:name', async function (req, res, next) {
    const id = req.params.name;
    const response = await fetch(req.app.get('apisix_url') + '/v1/plugin_metadata/' + id);
    const data = await response.json();
    res.json(data);
});


/* GET healthcheck */
router.get('/healthcheck', async function (req, res, next) {
    // const response = await fetch(req.app.get('apisix_url') + '/v1/healthcheck');
    // const data = await response.text();
    // const root = HTMLParser.parse(data);

    const root = HTMLParser.parse('<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>APISIX upstream check status</title></head><body><h1>APISIX upstream check status</h1><table style="background-color:white" cellspacing="0" cellpadding="3" border="1"><tbody><tr bgcolor="#C0C0C0"><th>Index</th><th>Upstream</th><th>Check type</th><th>Host</th><th>Status</th><th>Success counts</th><th>TCP Failures</th><th>HTTP Failures</th><th>TIMEOUT Failures</th></tr><tr bgcolor="#FF0000"><td>1</td><td>/apisix/upstreams/561957799953695435</td><td>http</td><td>142.250.201.78:1234</td><td>unhealthy</td><td>0</td><td>0</td><td>0</td><td>3</td></tr><tr bgcolor="#FF0000"><td>2</td><td>/apisix/upstreams/561957799953695435</td><td>http</td><td>142.250.201.67:1234</td><td>unhealthy</td><td>0</td><td>0</td><td>0</td><td>3</td></tr></tbody></table></body></html>', {
        blockTextElements: {
            script: false,		// keep text content when parsing
            noscript: false,		// keep text content when parsing
            style: false,		// keep text content when parsing
            pre: false			// keep text content when parsing
        }
    });

    const tbody = root.getElementsByTagName('tr');
    let firstRow = true;
    let headers = [];
    let response = {};
    tbody.forEach(tr => {
        let item = {};
        tr.childNodes.forEach((cell, idx) => {
            if (firstRow) {
                headers.push(cell.textContent);
            } else {
                item[headers[idx]] = cell.textContent;
            }
        });

        if (!firstRow) {
            // Extract the upstream ID
            const pieces = item['Upstream'].split('/');
            const uId = pieces[pieces.length - 1];

            if (!response[uId]) {
                response[uId] = [item];
            } else {
                response[uId].push(item);
            }
        }

        firstRow = false;
    });


    res.json(response);
});

module.exports = router;
