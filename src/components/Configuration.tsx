import React from 'react';
import { Intent, Button, InputGroup, Label, Spinner } from '@blueprintjs/core';
import { ItemGroup, ItemGroupType } from './ItemGroup';
import { ItemType } from './Item';
import { GenerateButton } from './GenerateButton';
import df from 'd-forest';
import { NavigationBar } from './NavigationBar';
import fs from 'fs';
import Path from 'path';
import xml2js from 'xml2js';
import { Footer } from './Footer';
import { Content } from './Content';

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
    return new Promise<ConfigType>((resolve, reject) => {
        fs.readFile(Path.join('resources\\schemas\\schema.json'), 'utf8', (err, data) => {
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
    const [flag, setFlag] = React.useState(false);
    const [formVars, setFormVars] = React.useState({} as any);


    const handleOnChange = (itemName: string, itemValue: string | string[]) => {
        formVars[itemName] = itemValue;
    }

    React.useEffect(() => {
        setFlag(true);
        getDefaultSchema()
            .then(s => {
                initializeFormVariables(s);
                setSchema(s);
            }).catch(e => console.log('Error occurred:', e));
    }, [])

    const initializeFormVariables = (schema: ConfigType) => {
        console.log('Initialize form variables');
        let vars = {} as any;
        schema.groups.map(group => {
            group.items.map((item: ItemType) => {
                let key: string = item.name;
                vars[key] = item.value;
            });
        });
        setFormVars(vars);
        console.log("Form vars:", vars);
    }

    const handleOnCreateNew = (configType: string) => {
        console.log('Create New:', configType);
        setFlag(true);
        setConfigType(configType)
        initializeFormVariables(schema);
        setTimeout(() => {
            setFlag(false);
        }, 2000);
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

                    const groupsArray = schema.groups.map(group => {
                        const items = group.items.filter((item: ItemType) => {
                            const match = df(result.configuration.item).findLeaf((leaf: any) => leaf.name === item.name);
                            if (match) {
                                if (item.type == "multiselect") {
                                    item.value = match.value.split(",");
                                } else {
                                    item.value = match.value;
                                }                                
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

                    console.log('filteredSchema:',filteredSchema);
                    
                    setFlag(true);
                    initializeFormVariables(filteredSchema);
                    setSchema(filteredSchema);
                    setConfigType(ConfigTypes.ALL)
                    setTimeout(() => {
                        setFlag(false);
                    }, 2000);

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

                {flag && <Spinner />}

                {!flag && <Content schema={schema} configType={configType} onChange={handleOnChange} />}

            </div>

            <div className="button">
                <GenerateButton type={configType} intent={Intent.PRIMARY} object={formVars} schema={schema} text="Generate" />
            </div>

        </div>

        <Footer />

    </>

};