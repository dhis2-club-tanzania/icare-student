export function getOrderByColumns(orderParams: string[]) {
    return (orderParams || [])
        .map(orderString => (orderString || '').split(':')[0])
        .filter(orderString => orderString);
}
