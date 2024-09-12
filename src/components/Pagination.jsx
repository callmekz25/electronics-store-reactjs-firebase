export const Pagination = ({
    totalPosts,
    postsPerPage,
    setCurrentPage,
    currentPage,
}) => {
    let pages = [];
    // Lấy số pages
    //  25 / 8 làm tròn lên
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pages.push(i);
    }

    return (
        <div className="pagination pt-[60px]">
            {pages.map((page, index) => {
                return (
                    <button
                        key={index}
                        // Mấu chốt để set lại vị trí page để render
                        onClick={() => {
                            window.scrollTo(0, 0);
                            setCurrentPage(page);
                            sessionStorage.setItem("currentPage", page);
                        }}
                        className={page === Number(currentPage) ? "active" : ""}
                    >
                        {page}
                    </button>
                );
            })}
        </div>
    );
};
