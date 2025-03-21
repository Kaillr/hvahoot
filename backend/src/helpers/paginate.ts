import { Request } from 'express';
import db from '../config/db.js';
import { ErrorDetails } from '../types/error.js';
import { Pagination } from '../types/pagination.js';

interface PaginationParams {
    req: Request;
    table: string;
}

interface PaginationResponse {
    data?: object;
    pagination?: Pagination;
    error?: ErrorDetails;
}

export default async function paginate({
    req,
    table,
}: PaginationParams): Promise<PaginationResponse> {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = (page - 1) * limit;

    if (page < 1 || limit < 1) {
        return {
            error: {
                code: 'INVALID_PARAMETERS',
                message: 'Page and limit must be greater than 0.',
                details:
                    'The provided values for page and limit are invalid. Both must be greater than 0.',
            },
        };
    }

    if (limit > 100) {
        return {
            error: {
                code: 'INVALID_PARAMETERS',
                message: 'Limit cannot exceed 100.',
                details:
                    'The provided limit is too high. Please ensure that the limit is 100 or less.',
            },
        };
    }

    const { rows: countRows } = await db.query(
        `SELECT count(*)
         FROM ${table}`,
    );
    const totalRows = Number(countRows[0].count);
    const totalPages = Math.ceil(totalRows / limit);

    if (page > totalPages) {
        return {
            error: {
                code: 'INVALID_PARAMETERS',
                message: 'The requested page exceeds the available range.',
                details: 'Page cannot exceed total pages.',
            },
        };
    }

    const { rows: dataRows } = await db.query(
        `
            SELECT *
            FROM ${table}
            ORDER BY created_at ASC, id ASC
            LIMIT $1 OFFSET $2
        `,
        [limit, offset],
    );

    return {
        data: dataRows,
        pagination: {
            current_page: page,
            limit: limit,
            count: dataRows.length,
            total_items: totalRows,
            total_pages: totalPages,
            has_next_page: page < totalPages,
            has_prev_page: page > 1,
            next_page: page < totalPages ? page + 1 : null,
            prev_page: page > 1 ? page - 1 : null,
            links: {
                self: `${req.baseUrl}?page=${page}&limit=${limit}`,
                next:
                    page < totalPages
                        ? `${req.baseUrl}?page=${page + 1}&limit=${limit}`
                        : null,
                prev:
                    page > 1
                        ? `${req.baseUrl}?page=${page - 1}&limit=${limit}`
                        : null,
            },
        },
    };
}
