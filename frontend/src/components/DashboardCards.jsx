const cards = [
  { title: "Active Projects", value: 8 },
  { title: "Pending Tasks", value: 14 },
  { title: "Team Members", value: 12 },
  { title: "Meetings Today", value: 3 },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">{card.title}</p>
          <h3 className="text-3xl font-bold mt-2">{card.value}</h3>
        </div>
      ))}
    </div>
  );
}