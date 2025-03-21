export interface Pagination {
    current_page: number;
    limit: number;
    count: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
    next_page: number | null;
    prev_page: number | null;
    links: {
        self: string;
        next: string | null;
        prev: string | null;
    };
}
