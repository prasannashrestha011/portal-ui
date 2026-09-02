import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps) {
    if (totalPages <= 1) return null;

    const previousDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages;

    return (
        <div className="border-t border-border pt-6 pb-2">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) onPageChange(currentPage - 1);
                            }}
                            aria-disabled={previousDisabled}
                            tabIndex={previousDisabled ? -1 : undefined}
                            className={`text-text-secondary hover:bg-primary-subtle hover:text-primary ${previousDisabled ? "pointer-events-none opacity-50" : ""
                                }`}
                        />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <PaginationItem key={pageNum}>
                            <PaginationLink
                                href="#"
                                isActive={currentPage === pageNum}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(pageNum);
                                }}
                                className={
                                    currentPage === pageNum
                                        ? "border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground"
                                        : "text-text-secondary hover:bg-primary-subtle hover:text-primary"
                                }
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) onPageChange(currentPage + 1);
                            }}
                            aria-disabled={nextDisabled}
                            tabIndex={nextDisabled ? -1 : undefined}
                            className={`text-text-secondary hover:bg-primary-subtle hover:text-primary ${nextDisabled ? "pointer-events-none opacity-50" : ""
                                }`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
