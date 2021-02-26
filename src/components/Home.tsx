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

export const Home = () => {

    const configSchema: ConfigType = JSON.parse(fs.readFileSync(Path.join('resources\\schema.json'), 'utf8'));
    //Sort by order number
    configSchema.groups.sort((a: ItemGroupType, b: ItemGroupType) => (a.order > b.order) ? 1 : -1)
    
    const [schema, setSchema] = React.useState(configSchema);
    
    const handleOnCreateNew = () => {
        console.log('Create New');
        setSchema(configSchema);
        ipcRenderer.send('reload');
    }

    const handleOnFileImport = (filePath: string) => {

        const parser = new xml2js.Parser();
        fs.readFile(filePath, function (err, data) {
            parser.parseStringPromise(data)
            .then(function (result) {
                
                console.log("Contents: ", result);

                //Need to recreate object for react to recognize change and rerender component
                const groupsArray = configSchema.groups.map((group: ItemGroupType) => {
                    const items = group.items.map((item: ItemType) => {
                        return { ...item, value: item.value ? item.value : '' };
                    })
                    return { ...group, items: items };
                });
        
                const recreatedSchema = { groups: groupsArray };


                console.log('Test:', recreatedSchema);                
                console.log('Orig:', configSchema);


                setSchema(recreatedSchema);

            }).catch(function (err) {
                console.error("Error: ", err);
            });
        });
    }    

    return <>

        <NavigationBar onCreateNew={handleOnCreateNew} onImport={handleOnFileImport} />
        <Configuration schema={schema} />
        <Footer />

    </>
}