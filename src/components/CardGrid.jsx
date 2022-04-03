export function CardGrid({ children }) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            columnGap: "1.25rem",
            rowGap: "1rem"
        }}>
            {children}
        </div>
    )
}