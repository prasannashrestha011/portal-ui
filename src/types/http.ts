
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination?: PaginationMeta;

}

export interface Page {
    page: number;
    page_size: number;
}
export interface PaginationMeta {
    page: number;
    page_size: number;
    total_size: number;
    total_pages: number;
}