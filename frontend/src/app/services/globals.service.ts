import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalsService {
    private _MSG = new Subject();

    private _APISIX_URL = 'http://localhost:3000/api';

    get APISIX_URL(): string {
        return this._APISIX_URL;
    }

    set APISIX_URL(value: string) {
        this._APISIX_URL = value;
    }

    private _API_URL = 'http://localhost:3000/api';

    get API_URL(): string {
        return this._API_URL;
    }

    private _GRAPH_SHAPES: any = {
        "route": [
            -1, 0.8,
            -1, 0.5,
            -0.8, 0.5,
            -0.3, -0.8,
            0.2, 0.5,
            0.7, -0.6,
            0.7, -0.8,
            1, -0.8,
            1, -0.5,
            0.8, -0.5,
            0.2, 0.8,
            -0.3, -0.5,
            -0.7, 0.8,
            -1, 0.8
        ]
    };

    get GRAPH_SHAPES(): any {
        return this._GRAPH_SHAPES;
    }

    private _GRAPH_STYLES = [
        {
            "selector": "node",
            "style": {
                "color": "#F5F5F5",
                "label": "data(name)",
                "text-halign": "right",
                "text-valign": "center",
                "text-margin-x": 5,
                "text-outline-color": "#222",
                "text-outline-opacity": 0.7,
                "text-outline-width": 2,
                "min-zoomed-font-size": 10
            }
        },
        {
            "selector": "node[kind = 'service']",
            "style": {
                "background-color": "#6CC870",
                // "border-color": "#388E3C",
                "border-color": "#222",
                "border-width": 5,
                "shape": "concave-hexagon"
            }
        },
        {
            "selector": "node[kind = 'route']",
            "style": {
                "background-color": "#4FC3F7",
                "border-width": 5,
                "border-color": "#222",
                "shape": "round-tag"
                // "shape": "polygon",
                // "shape-polygon-points": this._GRAPH_SHAPES.route
            }
        },
        {
            "selector": "node[kind = 'route'][!status]",
            "style": {
                "background-color": "#838788"
            }
        },
        {
            "selector": "node[kind = 'upstream']",
            "style": {
                "background-color": "#FFB74D",
                // "border-color": "#F57C00",
                "border-color": "#222",
                "border-width": 5,
                "shape": "round-diamond"
            }
        },
        {
            "selector": "node[kind = 'plugin']",
            "style": {
                "background-color": "#FFF176",
                // "border-color": "#FBC02D",
                "border-color": "#388E3C",
                "border-width": 3,
                "shape": "round-triangle",
                "outline-width": 3,
                "outline-color": "#222"
            }
        },
        {
            "selector": "node[kind = 'plugin'][!status]",
            "style": {
                "border-color": "#D32F2F"
            }
        },
        {
            "selector": "node[kind = 'target']",
            "style": {
                "background-color": "#E35959",
                // "border-color": "#D32F2F",
                "border-color": "#222",
                "border-width": 5,
                "shape": "round-rectangle"
            }
        },
        {
            "selector": "*.transparent",
            "style": {
                "background-color": "#777",
                "opacity": 0.2
            }
        },
        {
            "selector": "*.hidden",
            "style": {
                "display": "none"
            }
        },
        {
            "selector": "*.flash",
            "style": {
                "background-color": "#dd00dd",
            }
        },
        {
            "selector": "edge",
            "style": {
                "width": 25,
                "curve-style": "haystack",
                "haystack-radius": 0,
                "line-style": "dotted",
                "line-opacity": 0.5,
                "line-outline-width": 5,
                "line-outline-color": "#999",
                "line-fill": "linear-gradient"
            }
        },
        {
            "selector": "edge[kind = 'rs']",
            "style": {
                "line-gradient-stop-colors": "#4FC3F7 #6CC870",
                "line-gradient-stop-positions": "0% 100%"
            }
        },
        {
            "selector": "edge[kind = 'su']",
            "style": {
                "line-gradient-stop-colors": "#6CC870 #FFB74D",
                "line-gradient-stop-positions": "0% 100%"
            }
        },
        {
            "selector": "edge[kind = 'ut']",
            "style": {
                "line-gradient-stop-colors": "#FFB74D #E35959",
                "line-gradient-stop-positions": "0% 100%"
            }
        },
        {
            "selector": "edge[kind = 'st']",
            "style": {
                "line-gradient-stop-colors": "#6CC870 #E35959",
                "line-gradient-stop-positions": "0% 100%"
            }
        },
        {
            "selector": "edge[kind = 'rt']",
            "style": {
                "line-gradient-stop-colors": "#4FC3F7 #E35959",
                "line-gradient-stop-positions": "0% 100%"
            }
        },
        {
            "selector": "edge[kind = 'ru']",
            "style": {
                "line-gradient-stop-colors": "#4FC3F7 #FFB74D",
                "line-gradient-stop-positions": "0% 100%"
            }
        },
        {
            "selector": "edge[kind = 'sp']",
            "style": {
                "width": 3,
                "line-outline-width": 3,
                "line-style": "dotted",
                "line-gradient-stop-colors": "#6CC870 #FFF176",
                "line-gradient-stop-positions": "0% 100%"
            }
        },
        {
            "selector": "edge[kind = 'rp']",
            "style": {
                "width": 3,
                "line-outline-width": 3,
                "line-gradient-stop-colors": "#4FC3F7 #FFF176",
                "line-gradient-stop-positions": "0% 100%"
            }
        },
        {
            "selector": ".multiline-manual",
            "style": {
                "text-wrap": "wrap"
            }
        },
        {
            "selector": ".multiline-auto",
            "style": {
                "text-wrap": "wrap",
                "text-max-width": 80
            }
        },
        {
            "selector": ".autorotate",
            "style": {
                "edge-text-rotation": "autorotate"
            }
        }
    ];

    get GRAPH_STYLES(): any[] {
        return this._GRAPH_STYLES;
    }

    private _ICON_GITHUB = `<?xml version="1.0"?><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><g class="layer"><title>Layer 1</title><path clip-rule="evenodd" d="m12.02,0.32c-6.51,0 -11.77,5.3 -11.77,11.86c0,5.24 3.37,9.68 8.05,11.25c0.58,0.12 0.8,-0.26 0.8,-0.57c0,-0.28 -0.02,-1.22 -0.02,-2.2c-3.27,0.71 -3.96,-1.41 -3.96,-1.41c-0.53,-1.37 -1.31,-1.73 -1.31,-1.73c-1.07,-0.73 0.08,-0.73 0.08,-0.73c1.19,0.08 1.81,1.22 1.81,1.22c1.05,1.8 2.75,1.3 3.43,0.98c0.1,-0.77 0.41,-1.3 0.74,-1.59c-2.61,-0.27 -5.36,-1.3 -5.36,-5.85c0,-1.3 0.47,-2.36 1.21,-3.18c-0.12,-0.29 -0.53,-1.51 0.12,-3.14c0,0 1,-0.31 3.24,1.22a11.32,11.32 0 0 1 2.94,-0.39c1,0 2.01,0.14 2.94,0.39c2.24,-1.53 3.23,-1.22 3.23,-1.22c0.64,1.63 0.23,2.85 0.12,3.14c0.76,0.82 1.21,1.88 1.21,3.18c0,4.55 -2.75,5.56 -5.38,5.85c0.43,0.37 0.8,1.08 0.8,2.2c0,1.59 -0.02,2.87 -0.02,3.26c0,0.32 0.21,0.69 0.8,0.57c4.68,-1.57 8.05,-6.01 8.05,-11.25c0.02,-6.56 -5.26,-11.86 -11.75,-11.86z" fill="#fff" fill-rule="evenodd" id="svg_1"/></g></svg>`;

    get ICON_GITHUB(): string {
        return this._ICON_GITHUB;
    }

    // PREF: style for not selected nodes in the graph (transparent | hidden)
    private _prefGraphHideClass: string = 'transparent';

    get prefGraphHideClass(): string {
        return this._prefGraphHideClass;
    }

    set prefGraphHideClass(value: string) {
        this._prefGraphHideClass = value;
    }

    private _prefShowPlugins: boolean = true;

    get prefShowPlugins(): boolean {
        return this._prefShowPlugins;
    }

    set prefShowPlugins(value: boolean) {
        this._prefShowPlugins = value;
    }

    getMSG(): Subject<any> {
        return this._MSG;
    }

    setMSG(data: any) {
        this._MSG.next(data);
    }

    // full | thin | min
    private _prefFiltersSize: string = 'full';

    get prefFiltersSize(): string {
        return this._prefFiltersSize;
    }

    set prefFiltersSize(value: string) {
        this._prefFiltersSize = value;
    }
}
