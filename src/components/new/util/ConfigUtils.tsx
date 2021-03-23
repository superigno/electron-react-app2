import XMLBuilder from 'xmlbuilder';
import FileSaver from 'file-saver';
import fs from 'fs';
import xml2js from 'xml2js';
import Path from 'path';
import { ImportConfigFileType, ImportConfigObjectType, ImportCurrencyObjectType, ItemGroupType, ItemType } from '../type/Types';

export default class ConfigUtils {

    static generateConfigurationFile = (schema: ItemGroupType[], formObjects: any) => {
        const root = XMLBuilder.create('configuration');
        root.raw(''); //spacer

        schema.sort((a: any, b: any) => (a.order > b.order) ? 1 : -1);

        schema.map((group: ItemGroupType) => {
            //console.log('Group:', group);    
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

    static convertConfigFileToObject = (filePath: string) => {
        return new Promise((resolve, reject) => {
            const parser = new xml2js.Parser();
            fs.readFile(filePath, function (err, data) {
                parser.parseStringPromise(data)
                    .then((result: ImportConfigFileType) => {
                        const configObject: ImportConfigObjectType[] = result.configuration.item.map(item => {
                            return { itemName: item.$.name, itemValue: item.$.value };
                        });
                        resolve(configObject);
                    }).catch(function (err) {
                        reject('Error parsing file: ' + filePath + ' ' + err);
                    });
            });
        });
    }

    static getCurrencyFileObject = () => {
        const filePath = Path.join('resources/Currency.xml');
        return new Promise((resolve, reject) => {
            const parser = new xml2js.Parser();
            fs.readFile(filePath, function (err, data) {
                parser.parseStringPromise(data)
                    .then((result) => {
                        const currencyObject: ImportCurrencyObjectType[] = result.CurrencyTable.Currency.map((currency: ImportCurrencyObjectType) => {
                            return {
                                CountryName: currency.CountryName ? currency.CountryName[0] : "",
                                CurrencyCode: currency.CurrencyCode ? currency.CurrencyCode[0] : "",
                                CurrencyMnrUnts: currency.CurrencyMnrUnts ? currency.CurrencyMnrUnts[0] : "",
                                CurrencyName: currency.CurrencyName ? currency.CurrencyName[0] : "",
                                CurrencyNbr: currency.CurrencyNbr ? currency.CurrencyNbr[0] : "",
                                CurrencySign: currency.CurrencySign ? currency.CurrencySign[0] : ""
                            };
                        });
                        resolve(currencyObject);
                    }).catch(function (err) {
                        reject('Error parsing file: ' + filePath + ' ' + err);
                    });
            });
        });
    }


}