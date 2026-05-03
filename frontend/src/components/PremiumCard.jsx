export default function PremiumCard({ title, value, children }) {
  return (
    <div className="glass card-hover p-5 rounded-2xl">
      {title && <p className="text-slate-500">{title}</p>}
      {value && (
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      )}
      {children}
    </div>
  );
}