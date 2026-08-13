
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination?: PaginationMeta;

}


export interface PaginationMeta {
    page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
}