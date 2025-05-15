import { ParsedQs } from "qs";

export type Operator = "=" | "LIKE";

export interface ParsedFilter {
    column: string;
    operator: Operator;
    value: string;
}

export interface ParsedQuery {
    offset: number;
    limit: number;
    sortBy: string;
    order: "ASC" | "DESC";
    filters: ParsedFilter[];
}

export interface QueryOptions {
    defaultPage?: number;
    defaultLimit?: number;
    maxLimit?: number;
    defaultSortBy?: string;
    defaultOrder?: "ASC" | "DESC";
    // param name → column name
    sortableFields: Record<string, string>;
    // param name → column name
    filterableFields: Record<string, string>;
    // param name → operator
    filterOperators?: Record<string, Operator>;
}

export function parseQueryParams(
    query: ParsedQs,
    opts: QueryOptions
): ParsedQuery {
    const {
        defaultPage = 1,
        defaultLimit = 10,
        maxLimit = 100,
        defaultSortBy,
        defaultOrder = "DESC",
        sortableFields,
        filterableFields,
        filterOperators = {},
    } = opts;

    // page & limit (unchanged)…
    let page = defaultPage;
    if (typeof query.page === "string" && !isNaN(+query.page)) {
        page = Math.max(1, Math.floor(+query.page));
    }
    let limit = defaultLimit;
    if (typeof query.limit === "string" && !isNaN(+query.limit)) {
        limit = Math.min(maxLimit, Math.max(1, Math.floor(+query.limit)));
    }
    const offset = (page - 1) * limit;

    // sort_by & order (unchanged)…
    let sortBy = defaultSortBy || Object.values(sortableFields)[0];
    if (typeof query.sort_by === "string" && query.sort_by in sortableFields) {
        sortBy = sortableFields[query.sort_by];
    }
    let order = defaultOrder;
    if (typeof query.order === "string") {
        const up = query.order.toUpperCase();
        if (up === "ASC" || up === "DESC") order = up;
    }

    // build filters array
    const filters: ParsedFilter[] = [];
    for (const [param, column] of Object.entries(filterableFields)) {
        const raw = query[param];
        if (typeof raw === "string" && raw.trim() !== "") {
            const op = filterOperators[param] || "=";
            // for LIKE wrap with %
            const val = op === "LIKE" ? `%${raw.trim()}%` : raw.trim();
            filters.push({ column, operator: op, value: val });
        }
    }

    return { offset, limit, sortBy, order, filters };
}