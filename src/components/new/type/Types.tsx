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

export type SchemaType = {
    groups: ItemGroupType[]
}

export type ItemGroupType = {
    order: number,
    name: string,
    type: string,
    advanced?: boolean,
    items: ItemType[]
}

export type ItemType = {
    order: number,
    name: string,
    type: string,
    description?: string,
    size?: number,
    value?: string | number | boolean | string[],
    options?: string[],
    advanced?: boolean
}