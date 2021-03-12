import XMLBuilder from 'xmlbuilder';
import FileSaver from 'file-saver';
import { ItemGroupType } from '.././ItemGroup';
import { ItemType } from '.././Item';

export default class Utils {

    static generateConfigurationFile = (schema: ItemGroupType[], formObjects: any) => {

        const root = XMLBuilder.create('configuration');
        root.raw(''); //spacer
    
        schema.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1);
    
        schema.map((group: ItemGroupType) => {

            console.log('Group:', group);
    
            root.com(group.name);
    
            group.items.map((i: ItemType) => {
                let item = root.ele('item');
                let objectValue = formObjects[i.name] ? formObjects[i.name] : i.value;
                i.description ? item.commentBefore(i.description) : '';
                item.att('name', i.name);
                item.att('value', objectValue);
            });
    
            root.raw(''); //spacer
    
        });
        const xml = root.end({ pretty: true });
        console.log(xml);
    
    
        const blob = new Blob([xml], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "AppConfiguration.xml");
    
    }

}