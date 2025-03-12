export default function YearBanner({ year }: { year: number }) {
  return <h2 id={String(year)}>{year}年度</h2>;
}
