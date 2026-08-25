export const decodeCursor = (cursor: string): [any, string] => {
    const jsonStr = Buffer.from(cursor, 'base64').toString('utf-8')
    return JSON.parse(jsonStr)
}

export const encodeCursor = (customValue: any, id: string): string => {
    const jsonStr = JSON.stringify([customValue, id])
    return Buffer.from(jsonStr).toString('base64')
}
