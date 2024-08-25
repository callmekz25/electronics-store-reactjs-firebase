export const Loading = ({ css }) => {
    return (
        <div className={`flex items-center justify-center py-[300px] ${css}`}>
            <div className="loader-small"></div>
        </div>
    );
};
