import * as React from 'react';
import { Configuration, ConfigType } from './Configuration';
import { NavigationBar } from './NavigationBar';
import { Footer } from './Footer';
import fs from 'fs';
import Path from 'path';
import xml2js from 'xml2js';
import { ipcRenderer } from 'electron';
import { ItemGroupType } from './ItemGroup';
import { ItemType } from './Item';
import df from 'd-forest';

type ImportItemType = {
    $: {
        name: string,
        value: string
    }    
}

type ImportConfigType = {
    configuration: {
        item: ImportItemType[]
    }   
}

export const Home = () => {

    const configSchema: ConfigType = JSON.parse(fs.readFileSync(Path.join('resources\\schema.json'), 'utf8'));
    
    //Sort by order number and add default value attribute if not present
    configSchema.groups.sort((a: ItemGroupType, b: ItemGroupType) => (a.order > b.order) ? 1 : -1).forEach(group => 
        group.items.forEach(item => 
            item.value = item.value ? item.value : ""
        )
    )

    console.log("Config Schema: ", configSchema);

    const [schema, setSchema] = React.useState(configSchema);

    const handleOnCreateNew = () => {
        console.log('Create New');
        setSchema(configSchema);
        ipcRenderer.send('reload');
    }

    const handleOnFileImport = (filePath: string) => {

        const filetype = Path.extname(filePath).toLowerCase();

        if (filetype != '.xml') {
            console.error('File type is invalid', filetype);
            return;
        }

        const parser = new xml2js.Parser();
        fs.readFile(filePath, function (err, data) {
            parser.parseStringPromise(data)
                .then( (result: ImportConfigType) => {

                    const groupsArray = configSchema.groups.map(group => {
                        const items = group.items.filter((item: ItemType) => {
                           const match = df(result.configuration.item).findLeaf((leaf: any) => leaf.name === item.name);
                            if (match) {
                                item.value = match.value;
                                return true
                            } else {
                                return false;
                            }
                        });
                        return { ...group, items: items };
                    }).filter((group: ItemGroupType) => {
                        return group.items.length > 0;
                    });

                    const filteredSchema = { groups: groupsArray };
                    setSchema(filteredSchema);

                }).catch(function (err) {
                    console.error("Invalid file format", err);
                });
        });
    }

    return <>

        <NavigationBar onCreateNew={handleOnCreateNew} onImport={handleOnFileImport} />
        <Configuration schema={schema} />
        <Footer />

    </>
}