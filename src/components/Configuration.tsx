import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { ItemGroup, ItemGroupType } from './ItemGroup';
import { ItemType } from './Item';
import { GenerateButton } from './GenerateButton';
import df from 'd-forest';
import { NavigationBar } from './NavigationBar';
import fs from 'fs';
import Path from 'path';
import xml2js from 'xml2js';

export type ConfigType = {
    groups: ItemGroupType[]    
}

export const ConfigTypes = {
    ALL: "ALL",
    OPERATIONS: "OPERATIONS"
}

type ImportConfigType = {
    configuration: {
        item: {
            $: {
                name: string,
                value: string
            }
        }[]
    }
}

const getDefaultSchema = () => {
    return new Promise<ConfigType>( (resolve, reject) => {
        fs.readFile(Path.join('resources\\schema.json'), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const configSchema: ConfigType = JSON.parse(data);
                //Sort by order number and add default value attribute if not present
                configSchema.groups.sort((a: ItemGroupType, b: ItemGroupType) => (a.order > b.order) ? 1 : -1).forEach(group =>
                    group.items.forEach(item =>
                        item.value = item.value ? item.value : ""
                    )
                )
                console.log("Default config schema: ", configSchema);       
                resolve(configSchema);
            }
        });
    }); 
}

export const Configuration = () => {

    const [schema, setSchema] = React.useState({} as ConfigType);
    const [configType, setConfigType] = React.useState("");
    const defaultSchema = React.useRef({} as ConfigType);

    const handleOnChange = (itemName: string, itemValue: string | string[]) => {
        setSchema((current: ConfigType) => {
            const item = df(current).findLeaf((leaf: ItemType) => leaf.name === itemName);
            item.value = itemValue;
            return { ...current };
        })
    }

    React.useEffect(() => {
        getDefaultSchema()
        .then(s => {
            defaultSchema.current = s;
            setSchema(s);
        }).catch(e => console.log('Error occurred:', e));
    }, [])


    const handleOnCreateNew = (configType: string) => {
        console.log('Create New:', configType);
        //Send deep copy of schema for react to recognize change and rerender components
        const configSchemaCopy = JSON.parse(JSON.stringify(defaultSchema.current));
        setSchema(configSchemaCopy);
        setConfigType(configType)
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
                .then((result: ImportConfigType) => {

                    const groupsArray = defaultSchema.current.groups.map(group => {
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
                    setConfigType(ConfigTypes.ALL)

                }).catch(function (err) {
                    console.error("Invalid file format", err);
                });
        });
    }

    return <>

        <NavigationBar onCreateNew={handleOnCreateNew} onImport={handleOnFileImport} />

        <div className="wrapper">

            <h3 className="bp3-heading">Global FxChoice Configuration Manager</h3>
            
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>            

            <div className="content">
                { schema && schema.groups &&
                    schema.groups.filter((group: ItemGroupType) => {
                        return group.type.toUpperCase() === (configType === ConfigTypes.ALL ? group.type.toUpperCase() : configType);
                    }).map((group: ItemGroupType) =>
                        <ItemGroup key={group.name} group={group} onChange={handleOnChange} />
                    )
                }
            </div>

            <div className="button">
                <GenerateButton type={configType} intent={Intent.PRIMARY} object={schema} text="Generate" />
            </div>

        </div>
        
    </>

};