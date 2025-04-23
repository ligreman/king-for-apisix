import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JsonService {
    TEMPLATES = {
        item: '<div class="json__item"><div class="json__key">%KEY%</div><div class="json__value json__value--%TYPE%">%VALUE%</div></div>',
        itemCollapsible: '<label class="json__item json__item--collapsible"><input type="checkbox" class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>',
        itemCollapsibleOpen: '<label class="json__item json__item--collapsible"><input type="checkbox" checked class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>'
    };

    createItem(key:any, value:any, type:any){
        let element = this.TEMPLATES.item.replace('%KEY%', key);

        if(type == 'string') {
            element = element.replace('%VALUE%', '"' + value + '"');
        } else {
            element = element.replace('%VALUE%', value);
        }

        element = element.replace('%TYPE%', type);

        return element;
    }

     createCollapsibleItem(key:any, value:any, type:any, children:any, collapsible:boolean){
         let element = this.TEMPLATES['itemCollapsible'];

        if(collapsible) {
            element = this.TEMPLATES['itemCollapsibleOpen'];
        }

        element = element.replace('%KEY%', key);
        element = element.replace('%VALUE%', type);
        element = element.replace('%TYPE%', type);
        element = element.replace('%CHILDREN%', children);

        return element;
    }


     handleChildren(key:any, value:any, type:any, collapsible:boolean) {
        let html = '';

        for(const item in value) {
            html += this.handleItem(item, value[item], collapsible);
        }

        return this.createCollapsibleItem(key, value, type, html, collapsible);
    }

     handleItem(key:any, value:any, collapsible:boolean) {
        const type = typeof value;

        if(typeof value === 'object') {
            return this.handleChildren(key, value, type, collapsible);
        }

        return this.createItem(key, value, type);
    }

    jsonViewer(json:any, collapsible:boolean) {
        let _result = '';
        for(const item in json) {
            _result += this.handleItem(item, json[item], collapsible);
        }

        return '<div class="json">'+_result+'</div>';
    }
}
