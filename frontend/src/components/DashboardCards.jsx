import PremiumCard from "../components/PremiumCard";


const cards = [
  { title: "Active Projects", value: 8 },
  { title: "Pending Tasks", value: 14 },
  { title: "Team Members", value: 12 },
  { title: "Meetings Today", value: 3 },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <div className="grid md:grid-cols-4 gap-5">
  <PremiumCard title="Total Tasks" value={data.stats.total} />
  <PremiumCard title="Completed" value={data.stats.completed} />
  <PremiumCard title="Pending" value={data.stats.pending} />
  <PremiumCard title="In Progress" value={data.stats.inprogress} />
</div>
    </div>
  );
}