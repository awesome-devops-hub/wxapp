export function intExclusive(origin: number, bound: number): number {
    return Math.floor(Math.random() * (bound - origin)) + origin;
}

export function intInclusive(origin: number, bound: number): number {
    return Math.floor(Math.random() * (bound - origin + 1)) + origin;
}

export function nextRange(origin: number, range: number): number {
    return intExclusive(origin - range, origin + range);
}

export function nextFloat(origin: number, bound: number): number {
    return Math.random() * (bound - origin) + origin;
}

export function nextBoolean(value: number): boolean {
    return Math.random() <= value;
}

export const simulatePagination = (page: number, size: number, totalCount: number) => {
    return {
        page,
        size,
        totalCount,
        totalPage: Math.ceil(totalCount / size),
    };
};
