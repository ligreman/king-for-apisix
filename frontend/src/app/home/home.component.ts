import {AfterViewInit, ChangeDetectionStrategy, Component, Inject, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {forkJoin} from 'rxjs';
import cytoscape from 'cytoscape';
import {ApiService} from '../services/api.service';
import {ToastService} from '../services/toast.service';
import tidytree from 'cytoscape-tidytree';
import {Md5} from 'ts-md5';
import {GlobalsService} from '../services/globals.service';
import cytoscapePopper from 'cytoscape-popper';
import tippy, {sticky} from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {JsonService} from '../services/json.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';

cytoscape.use(tidytree);

// TODO Ayuda

function popperFactory(ref: any, content: any, opts: any) {
    // Since tippy constructor requires DOM element/elements, create a placeholder
    return tippy(document.createElement('div'), {
        getReferenceClientRect: ref.getBoundingClientRect,
        trigger: 'manual',

        // dom element inside the tippy:
        content: content,
        // your own preferences:
        arrow: true,
        placement: 'bottom',
        hideOnClick: false,
        sticky: true,
        allowHTML: true,

        // if interactive:
        theme: 'tippy-dark',
        interactive: false,
        appendTo: document.body, // or append dummyDomEle to document.body
        plugins: [sticky]
    });
}

cytoscape.use(cytoscapePopper(popperFactory));

@Component({
    selector: 'app-home',
    imports: [CommonModule, MatListModule, MatProgressBarModule, MatButtonToggleModule, MatTooltipModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnInit {
    readonly dialog = inject(MatDialog);

    showFilter = new FormControl(['route', 'service']);
    selection = new FormControl();

    // Vars
    loading: boolean = true;
    showRoutes: boolean = true;
    showServices: boolean = true;

    // Graph
    graph: any;
    createdNodes: any[] = [];
    createdEdges: any[] = [];
    upstreamsWithoutMetadata: any[] = [];
    data: any = {};
    optionsList: any = [];
    pluginList: any = [];
    maxSpacingFactor: number = 1;
    tippys: any[] = [];
    graphDOM:any;

    constructor(private api: ApiService, private toast: ToastService, private globals: GlobalsService, private jsonUtils: JsonService) {
    }

    ngOnInit(): void {
        this.globals.getMSG().subscribe(async (data) => {
            switch (data) {
                case 'fit-screen':
                    this.fitScreen();
                    break;
                case 'reload-data':
                    await this.reloadData();
                    break;
            }
        });
    }

    ngAfterViewInit(): void {
        // The setTimeout waits till the DOM is loaded
        setTimeout(async () => {
            await this.startUp();
        }, 1500);
    }

    /**
     * Get data and create the graph
     */
    async startUp() {
        let elements: any[] = [];
        await this.getData();
        // The order of node creation is important u > s > r
        const uu = this.createUpstreams()
        const ss = this.createServices();
        const rr = this.createRoutes();
        elements = elements.concat(ss, rr, uu);

        if (this.globals.prefShowPlugins) {
            elements = elements.concat(this.createPlugins());
        }
        this.loading = false;

        console.log(elements);
        this.graphDOM = document.getElementById('graph');
        this.graph = cytoscape({
            container: this.graphDOM,
            elements: elements,
            wheelSensitivity: 0.2,
            maxZoom: 3,
            style: this.globals.GRAPH_STYLES,
            autoungrabify: false,
            autounselectify: true,
            boxSelectionEnabled: false
        });

        // I apply the layout to all nodes and edges, except plugins nodes
        this.graph.elements('*[kind != "plugin"]').layout({
            name: "tidytree",
            horizontalSpacing: (this.maxSpacingFactor * 20) + 30,
            verticalSpacing: 50,
            direction: 'LR',
            spacingFactor: 1.2,
            nodeDimensionsIncludeLabels: true
        }).run();

        // Manually position plugin nodes, relative to their "parent"
        this.graph.elements('node[kind = "plugin"]').layout({
            name: 'preset',
            zoom: false,
            pan: false,
            fit: false,
            positions: (node: any) => {
                const data = node.data();
                console.log(data);
                // Get source node position
                const sourcePos = this.graph.getElementById(data.sourceId).position();

                let modX = 1, modY = 1;
                switch (data.positionSquare) {
                    case 0:
                        modX = -1;
                        modY = 1;
                        break;
                    case 1:
                        modX = -1;
                        modY = -1;
                        break;
                    case 2:
                        modX = +1;
                        modY = -1;
                        break;
                    case 3:
                    default:
                        modX = 1;
                        modY = 1;
                        break;
                }

                // Position the node relative to it
                return {
                    x: sourcePos.x + (modX * data.positionFactor * 30),
                    y: sourcePos.y + (modY * data.positionFactor * 40)
                };
            }
        }).run();
        this.tooltips();
    }

    tooltips() {
        // On node click show tip
        this.graph.nodes().forEach((n: any) => {
            let tip: any;
            if (!['plugin', 'target'].includes(n.data('kind'))) {
                const meta = n.data('meta');
                n.on('mouseover', (ev: any) => {
                    let div = document.createElement('div');
                    div.innerHTML = `<div class="tip">` +
                        this.getTipInfo(n.data('kind'), n.data('meta'))
                        + `</div>`;

                    tip = n.popper({
                        content: div
                    });
                    tip.show();
                    n.data('tippy', tip);
                    this.tippys.push(tip);
                    this.graphDOM.classList.add('hand');
                });

                n.on('mouseout', (ev: any) => {
                    tip.destroy();
                    this.graphDOM.classList.remove('hand');
                });
            }

            n.on('vclick', (ev: any) => {
                if (tip) {
                    tip.destroy();
                }
                this.dialog.open(DetailsDialog, {
                    minHeight: '70vh',
                    minWidth: '70vw',
                    data: {
                        kind: n.data('kind'),
                        key: n.data('url'),
                        meta: n.data('meta')
                    }
                });
            });
        });

        // Destroy Tips when dragging the graph
        // this.graph.on('dragpan', (ev: any) => {
        //     this.destroyAllTips();
        // });
    }

    destroyAllTips() {
        this.tippys.forEach((t: any) => {
            t.hide();
            setTimeout(() => {
                t.destroy();
            }, 1000);
        });
    }

    getTipInfo(kind: string, meta: any) {
        let html: string = '';
        switch (kind) {
            case 'service':
                html += '<p><strong>' + meta.name + '</strong></p>';
                if (meta.desc) {
                    html += '<p><em>' + meta.desc + '</em></p>';
                }
                if (meta.hosts) {
                    html += '<p>Hosts: </p><ul>';
                    meta.hosts.forEach((host: any) => {
                        html += '<li>' + host + '</li>';
                    });
                    html += '</ul>'
                }
                break;
            case 'route':
                html += '<p><strong>' + meta.name + '</strong></p>';
                if (meta.desc) {
                    html += '<p><em>' + meta.desc + '</em></p>';
                }
                if (meta.methods) {
                    html += '<p>Methods: ' + meta.methods.join(', ') + '</p>';
                }
                if (meta.uri) {
                    html += '<p>URI: ' + meta.uri + '</p>';
                }
                if (meta.uris) {
                    html += '<p>URIs: </p><ul>';
                    meta.uris.forEach((uri: any) => {
                        html += '<li>' + uri + '</li>';
                    });
                    html += '</ul>'
                }
                if (meta.status === 1 || meta.status === 0) {
                    const ss = meta.status === 1 ? '<span class="status-ok">Enabled</span>' : '<span class="status-fail">Disabled</span>';
                    html += '<p>Status: ' + ss + '</p>';
                }
                if (meta.priority) {
                    html += '<p>Priority: ' + meta.priority + '</p>';
                }
                break;
            case 'upstream':
                if (meta.name) {
                    html += '<p><strong>' + meta.name + '</strong></p>';
                }
                if (meta.desc) {
                    html += '<p><em>' + meta.desc + '</em></p>';
                }
                if (meta.type) {
                    html += '<p>Type: ' + meta.type + '</p>';
                }
                if (meta.scheme) {
                    html += '<p>Scheme: ' + meta.scheme + '</p>';
                }
                if (meta.nodes) {
                    html += '<p>Nodes: </p><ul>';
                    meta.nodes.forEach((nod: any) => {
                        html += '<li>' + nod.host + ':' + nod.port + '</li>';
                    });
                    html += '</ul>'
                }
                if (meta.checks){
                    if (meta.checks.passive){
                        html += '<p>Health checks — passive: enabled</p>';
                    }
                    if (meta.checks.active){
                        html += '<p>Health checks — active: enabled</p>';
                    }
                }
                break;
        }

        return html;
    }

    /**
     * Get all data from APISIX control api
     */
    async getData() {
        console.log('GET DATA');
        // Get Data
        return new Promise<void>((resolve, reject) => {
            forkJoin([this.api.getServices(), this.api.getRoutes(), this.api.getUpstreams(), this.api.getHealth()])
                .subscribe({
                    next: (res) => {
                        this.data = {
                            services: res[0],
                            routes: res[1],
                            upstreams: res[2],
                            health: res[3]
                        };
                        console.log(res);
                        // this.processData();
                        resolve();
                    },
                    error: (error) => {
                        this.toast.error_general(error, {disableTimeOut: true});
                        reject(error);
                    }
                });


        });
    }

    /**
     Create nodes + edges for each Service
     */
    createServices() {
        let elements = [];
        // 3 cases: a service can have an associated upstream, create a new one directly
        // that has several associated nodes, or may not have any upstream.
        for (const service of this.data.services.data) {
            this.optionsList.push({
                id: 's-' + service.value.id,
                name: service.value.name,
                desc: service.value.desc,
                kind: 'service'
            });

            // I create the service node
            const nS1 = 's-' + service.value.id;
            elements.push({
                group: 'nodes',
                data: {
                    id: nS1,
                    name: service.value.name,
                    kind: 'service',
                    meta: service.value,
                    url: this.globals.APISIX_URL + service.key
                }
            });
            this.createdNodes.push(nS1);

            // If I had an existing upstream, I create only the edge
            if (service.value.upstream_id) {
                const nU1 = 'u-' + service.value.upstream_id;
                // I only create the node if I have not created it before
                // (orphan upstream -> Apisix does not leave orphans, so it is not needed)
                // if (!this.createdNodes.includes(nU1)) {
                //     elements.push({
                //         group: 'nodes',
                //         data: {
                //             id: nU1,
                //             name: this.data.upstreams.names[service.value.upstream_id],
                //             kind: 'upstream'
                //         }
                //     });
                //     this.upstreamsWithoutMetadata.push(service.value.upstream_id);
                //     this.createdNodes.push(nU1);
                // }

                // I only create the Edge if I have not created it before
                const eS1 = 's-' + this.cut(nS1) + '#u-' + this.cut(nU1);
                if (!this.createdEdges.includes(eS1)) {
                    elements.push({
                        group: 'edges',
                        data: {
                            id: eS1,
                            source: nS1,
                            target: nU1,
                            kind: 'su'
                        }
                    });
                    this.createdEdges.push(eS1);
                }
            }

            // If the Service creates an Upstream with associated nodes
            if (service.value.upstream) {
                // First create the virtual-upstream node
                const uuidV = this.uuid(service.value.id + service.value.upstream.scheme);
                const vU1 = 'vu-' + uuidV;
                if (!this.createdNodes.includes(vU1)) {
                    elements.push({
                        group: 'nodes',
                        data: {
                            id: vU1,
                            name: '(virtual upstream)',
                            kind: 'upstream',
                            special: 'virtual',
                            meta: service.value.upstream,
                            url: this.globals.APISIX_URL + service.key
                        }
                    });
                    this.createdNodes.push(vU1);
                }

                // The edge from service to virtual-upstream
                // I only create the Edge if I have not created it before
                const eS2 = 's-' + this.cut(nS1) + '#vu-' + this.cut(uuidV);
                if (!this.createdEdges.includes(eS2)) {
                    elements.push({
                        group: 'edges',
                        data: {
                            id: eS2,
                            source: nS1,
                            target: vU1,
                            kind: 'su'
                        }
                    });
                    this.createdEdges.push(eS2);
                }

                // For each target in the virtual upstream I will create its Node + Edge
                for (const upNode of service.value.upstream.nodes) {
                    const uuid = this.uuidHost(service.value.upstream.scheme, upNode);
                    // the target node
                    const nH1 = 'h-' + uuid;
                    // I only create the node if I have not created it before
                    if (!this.createdNodes.includes(nH1)) {
                        elements.push({
                            group: 'nodes',
                            data: {
                                id: nH1,
                                name: this.nameHost(service.value.upstream.scheme, upNode),
                                kind: 'target',
                                meta: upNode,
                                url: this.globals.APISIX_URL + service.key
                            }
                        });
                        this.createdNodes.push(nH1);
                    }

                    // I only create the Edge if I have not created it before
                    const eS3 = 'vu-' + this.cut(vU1) + '#h-' + this.cut(uuid);
                    if (!this.createdEdges.includes(eS3)) {
                        elements.push({
                            group: 'edges',
                            data: {
                                id: eS3,
                                source: vU1,
                                target: nH1,
                                kind: 'ut'
                            }
                        });
                        this.createdEdges.push(eS3);
                    }
                }
            }

            // Extract plugins
            if (service.value.plugins) {
                this.pluginList = this.pluginList.concat(this.extractPlugins(service, 's'));
            }
        }
        return elements;
    }

    /**
     Create nodes + edges from each Route
     */
    createRoutes() {
        let elements: any = [];

        // 3 cases: a route can have an existing service associated (cannot create it),
        // or an upstream already existing, or a new upstream with nodes, or a remote address.
        for (const route of this.data.routes.data) {
            this.optionsList.push({
                id: 'r-' + route.value.id,
                name: route.value.name,
                desc: route.value.desc,
                kind: 'route'
            });

            // I create the route node
            const nR1 = 'r-' + route.value.id;
            elements.push({
                group: 'nodes',
                data: {
                    id: nR1,
                    name: route.value.name,
                    kind: 'route',
                    status: route.value.status === 1 ? true : false,
                    meta: route.value,
                    url: this.globals.APISIX_URL + route.key
                }
            });
            this.createdNodes.push(nR1);

            // If it has a Service, lets create the edge
            if (route.value.service_id) {
                const nS1 = 's-' + route.value.service_id;
                // I only create the node if I have not created it before
                // if (!this.createdNodes.includes(nS1)) {
                //     elements.push({
                //         group: 'nodes',
                //         data: {
                //             id: nS1,
                //             name: this.data.upstreams.names[route.value.service_id],
                //             kind: 'service'
                //         }
                //     });
                //     this.createdNodes.push(nS1);
                // }

                // I only create the Edge if I have not created it before
                const eS1 = 'r-' + this.cut(nR1) + '#s-' + this.cut(nS1);
                if (!this.createdEdges.includes(eS1)) {
                    elements.push({
                        group: 'edges',
                        data: {
                            id: eS1,
                            source: nR1,
                            target: nS1,
                            kind: 'rs'
                        }
                    });
                    this.createdEdges.push(eS1);
                }
            }

            // If I had an existing upstream, I create the edge
            if (route.value.upstream_id) {
                const nU1 = 'u-' + route.value.upstream_id;
                // I only create the node if I have not created it before
                // if (!this.createdNodes.includes(nU1)) {
                //     elements.push({
                //         group: 'nodes',
                //         data: {
                //             id: nU1,
                //             name: this.data.upstreams.names[route.value.upstream_id],
                //             kind: 'upstream'
                //         }
                //     });
                //     this.createdNodes.push(nU1);
                // }

                // I only create the Edge if I have not created it before
                const eS1 = 'r-' + this.cut(nR1) + '#u-' + this.cut(nU1);
                if (!this.createdEdges.includes(eS1)) {
                    elements.push({
                        group: 'edges',
                        data: {
                            id: eS1,
                            source: nR1,
                            target: nU1,
                            kind: 'ru'
                        }
                    });
                    this.createdEdges.push(eS1);
                }
            }

            // If it declares a new upstream
            if (route.value.upstream) {
                // First create the virtual upstream node
                const uuidV = this.uuid(route.value.id + route.value.upstream.scheme);
                const vU1 = 'vu-' + uuidV;
                // I only create the node if I have not created it before
                if (!this.createdNodes.includes(vU1)) {
                    elements.push({
                        group: 'nodes',
                        data: {
                            id: vU1,
                            name: '(virtual upstream)',
                            kind: 'upstream',
                            special: 'virtual',
                            meta: route.value.upstream,
                            url: this.globals.APISIX_URL + route.key
                        }
                    });
                    this.createdNodes.push(vU1);
                }

                // Now the edge from route to this virtual upstream
                const eS2 = 'r-' + this.cut(nR1) + '#vu-' + this.cut(uuidV);
                if (!this.createdEdges.includes(eS2)) {
                    elements.push({
                        group: 'edges',
                        data: {
                            id: eS2,
                            source: nR1,
                            target: vU1,
                            kind: 'ru'
                        }
                    });
                    this.createdEdges.push(eS2);
                }

                // For each Upstream's target node I will create its Node + Edge de Grafo
                for (const upNode of route.value.upstream.nodes) {
                    const uuid = this.uuidHost(route.value.upstream.scheme, upNode);
                    const nH1 = 'h-' + uuid;
                    // I only create the node if I have not created it before
                    if (!this.createdNodes.includes(nH1)) {
                        elements.push({
                            group: 'nodes',
                            data: {
                                id: nH1,
                                name: this.nameHost(route.value.upstream.scheme, upNode),
                                kind: 'target',
                                meta: upNode,
                                url: this.globals.APISIX_URL + route.key
                            }
                        });
                        this.createdNodes.push(nH1);
                    }

                    // I only create the Edge if I have not created it before
                    const eS3 = 'vu-' + this.cut(vU1) + '#h-' + this.cut(uuid);
                    if (!this.createdEdges.includes(eS3)) {
                        elements.push({
                            group: 'edges',
                            data: {
                                id: eS3,
                                source: vU1,
                                target: nH1,
                                kind: 'ut'
                            }
                        });
                        this.createdEdges.push(eS3);
                    }
                }
            }

            let addrs;
            if (route.value.remote_addr) {
                addrs = [route.value.remote_addr];
            }
            if (route.value.remote_addrs) {
                addrs = route.value.remote_addrs;
            }

            // If it has remote address, it can be 1 (string) or many (array [strings])
            if (addrs) {
                // For each Upstream node I will create its Node + Edge
                for (const addr of addrs) {
                    const uuid = Md5.hashStr(addr);
                    const nRH1 = 'rh-' + uuid;
                    // I only create the node if I have not created it before
                    if (!this.createdNodes.includes(nRH1)) {
                        elements.push({
                            group: 'nodes',
                            data: {
                                id: nRH1,
                                name: addr,
                                kind: 'target',
                                meta: {'class': 'Remote Address'},
                                url: this.globals.APISIX_URL + route.key
                            }
                        });
                        this.createdNodes.push(nRH1);
                    }

                    // I only create the Edge if I have not created it before
                    const eS3 = 'r-' + this.cut(nR1) + '#rh-' + this.cut(uuid);
                    if (!this.createdEdges.includes(eS3)) {
                        elements.push({
                            group: 'edges',
                            data: {
                                id: eS3,
                                source: nR1,
                                target: nRH1,
                                kind: 'rt'
                            }
                        });
                        this.createdEdges.push(eS3);
                    }
                }
            }

            // Extract plugins
            if (route.value.plugins) {
                this.pluginList = this.pluginList.concat(this.extractPlugins(route, 'r'));
            }
        }
        return elements;
    }

    createUpstreams() {
        let elements: any = [];

        // Create the Upstreams that have not been already created
        for (const upstream of this.data.upstreams.data) {
            // Create the Upstream node
            const nU1 = 'u-' + upstream.value.id;
            if (!this.createdNodes.includes(nU1)) {
                elements.push({
                    group: 'nodes',
                    data: {
                        id: nU1,
                        name: upstream.value.name,
                        kind: 'upstream',
                        meta: upstream.value,
                        url: this.globals.APISIX_URL + upstream.key,
                        health: this.data.health[upstream.value.id] || null
                    }
                });
                this.createdNodes.push(nU1);
            }

            // For each upstream nodes, create a host node + edge
            if (upstream.value.nodes) {
                // For each Upstream node I will create its Node
                for (const upNode of upstream.value.nodes) {
                    const uuid = this.uuidHost(upstream.value.scheme, upNode);
                    const nH1 = 'h-' + uuid;
                    // I only create the node if I have not created it before
                    if (!this.createdNodes.includes(nH1)) {
                        elements.push({
                            group: 'nodes',
                            data: {
                                id: nH1,
                                name: this.nameHost(upstream.value.scheme, upNode),
                                kind: 'target',
                                meta: upNode,
                                url: this.globals.APISIX_URL + upstream.key
                            }
                        });
                        this.createdNodes.push(nH1);
                    }


                    // I only create the Edge if I have not created it before
                    const eS1 = 'u-' + this.cut(nU1) + '#h-' + this.cut(uuid);
                    if (!this.createdEdges.includes(eS1)) {
                        elements.push({
                            group: 'edges',
                            data: {
                                id: eS1,
                                source: nU1,
                                target: nH1,
                                kind: 'ut'
                            }
                        });
                        this.createdEdges.push(eS1);
                    }
                }
            }
        }
        return elements;
    }

    createPlugins() {
        let result = [];
        console.log(this.pluginList);
        for (const plugin of this.pluginList) {
            const nP1 = 'p-' + Md5.hashStr(plugin.source + plugin.name);
            // I only create the node if I have not created it before
            if (!this.createdNodes.includes(nP1)) {
                this.maxSpacingFactor = Math.max(this.maxSpacingFactor, plugin.positionFactor);
                result.push({
                    group: 'nodes',
                    data: {
                        id: nP1,
                        name: plugin.name,
                        sourceId: plugin.source,
                        positionFactor: plugin.positionFactor,
                        positionSquare: plugin.positionSquare,
                        kind: 'plugin',
                        status: plugin.status,
                        meta: plugin.metadata,
                        url: plugin.url
                    }
                });
                this.createdNodes.push(nP1);
            }

            // I only create the Edge if I have not created it before
            const eP1 = plugin.sourceKind + '-' + this.cut(plugin.source) + '#p-' + this.cut(nP1);
            if (!this.createdEdges.includes(eP1)) {
                result.push({
                    group: 'edges',
                    data: {
                        id: eP1,
                        source: plugin.source,
                        target: nP1,
                        kind: plugin.sourceKind + 'p'
                    }
                });
                this.createdEdges.push(eP1);
            }
        }

        console.log('plugins');
        console.log(result);
        return result;
    }

    /**
     * Extract the plugins from services and routes
     */
    extractPlugins(source: any, kind: string) {
        let result: any = [];
        let pluginCountForSource: any = {};
        Object.keys(source.value.plugins).forEach(plug => {
            let status = source.value.plugins[plug]._meta ? source.value.plugins[plug]._meta.disable : false;
            // Calc the number of plugins a unique source has, when adding this plugin
            pluginCountForSource[source.value.id] = pluginCountForSource[source.value.id] ? pluginCountForSource[source.value.id] + 1 : 1;
            result.push({
                source: kind + '-' + source.value.id,
                sourceKind: kind,
                positionFactor: Math.ceil(pluginCountForSource[source.value.id] / 4),
                positionSquare: pluginCountForSource[source.value.id] % 4,
                name: plug,
                status: !status,
                metadata: source.value.plugins[plug],
                url: this.globals.APISIX_URL + source.key
            });
        });

        console.log('extract');
        console.log(result);
        return result;
    }

    nameHost(scheme: any, host: any) {
        return scheme + '://' + host.host + ':' + host.port;
    }

    uuidHost(scheme: any, host: any) {
        return Md5.hashStr(this.nameHost(scheme, host));
    }

    uuid(data: string) {
        return Md5.hashStr(data);
    }

    cut(txt: string) {
        return txt.substring(txt.length - 5);
    }


    selectionChange(selected: any) {
        // Empty collection
        let filterSelection: any = this.graph.collection();

        let aux = [];
        for (let opt of selected) {
            if (opt.selected) {
                aux.push(opt.value);
                // Store all connected nodes in filterSelection
                filterSelection = filterSelection.union(this.getAllConnected(opt.value));
            }
        }
        console.log('Cojo conectados de: ' + aux.join(', '));

        // Reset all
        this.graph.elements().removeClass(['transparent', 'hidden']);
        this.graph.fit();

        if (filterSelection.nonempty()) {
            // Add the hide styles class to all nodes not selected
            filterSelection.absoluteComplement().addClass(this.globals.prefGraphHideClass);

            // Fit graph and flash
            this.graph.fit(filterSelection);
        }
    }

    getAllConnected(nodeId: string) {
        let connected: any = this.graph.collection();
        let revised: any = this.graph.collection();
        let newFound: any = this.graph.collection();

        newFound = newFound.union(this.graph.getElementById(nodeId));

        while (newFound.nonempty()) {
            let temporal: any = this.graph.collection();
            newFound.forEach((node: any) => {
                if (!revised.contains(node)) {
                    const pre = node.predecessors((ele: any) => ele.isNode());
                    const suc = node.successors((ele: any) => ele.isNode());
                    const preE = node.predecessors((ele: any) => ele.isEdge());
                    const sucE = node.successors((ele: any) => ele.isEdge());
                    revised = revised.union(node);
                    connected = connected.union(node).union(pre).union(suc).union(preE).union(sucE);
                    temporal = temporal.union(pre).union(suc);
                }
            });
            newFound = this.graph.collection().union(temporal);
        }

        return connected;
    }

    /**
     * Reset the zoom
     */
    fitScreen() {
        this.graph.fit();
    }

    async reloadData() {
        // destroy graph
        this.destroyAllTips();
        this.graph.destroy();
        // reset vars
        this.loading = true;
        this.createdNodes = [];
        this.createdEdges = [];
        this.upstreamsWithoutMetadata = [];
        this.data = {};
        this.optionsList = [];
        this.selection.setValue([]);
        this.pluginList = [];
        this.maxSpacingFactor = 1;
        this.tippys = [];
        // get data again
        await this.startUp();
    }

    hideFilter(kind: string) {
        let res: boolean = false;
        if (kind === 'service' && !this.showServices) {
            res = true;
        }
        if (kind === 'route' && !this.showRoutes) {
            res = true;
        }
        return res;
    }

    changeFilter() {
        if (this.showFilter.value) {
            this.showRoutes = this.showFilter.value.includes('route') ? true : false;
            this.showServices = this.showFilter.value.includes('service') ? true : false;
        }
    }

    filtersSize(size: string) {
        return this.globals.prefFiltersSize === size;
    }

    cleanFilters() {
        this.selection.setValue([]);
        this.selectionChange([]);
    }
}


/**
 * Details Dialog Component
 */
@Component({
    selector: 'details-dialog',
    templateUrl: 'details-dialog.html',
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsDialog {
    jsonHtml: any;
    url: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private jsonUtils: JsonService) {
        this.url = this.data.key;
        this.jsonHtml = this.jsonUtils.jsonViewer(this.data.meta, true);
    }
}
