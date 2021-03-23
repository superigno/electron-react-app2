export type SchemaType = {
    groups: ItemGroupType[]
}

export type ItemGroupType = {
    order: number,
    name: string,
    type: string,
    advanced?: boolean,
    items: ItemType[],
    hidden?: boolean
}

export type ItemType = {
    order: number,
    name: string,
    type: string,
    description?: string,
    size?: number,
    value?: string | number | boolean | string[],
    options?: string[],
    advanced?: boolean,
    hidden?: boolean
}

export type ImportConfigFileType = {
    configuration: {
        item: {
            $: {
                name: string,
                value: string
            }
        }[]
    }
}

export type ImportConfigObjectType = {
    itemName: string,
    itemValue: string
}

export type ImportCurrencyObjectType = {
    CountryName: string,
    CurrencyCode: string,
    CurrencyMnrUnts: string,
    CurrencyName: string,
    CurrencyNbr: string,
    CurrencySign: string
}