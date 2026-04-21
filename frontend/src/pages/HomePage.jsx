export default function HomePage() {
  return (
    <div className="grid md:grid-cols-4 gap-5">
      <div className="bg-white p-5 rounded-xl shadow">
        <p className="text-gray-500">Open Tasks</p>
        <h2 className="text-3xl font-bold">14</h2>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <p className="text-gray-500">Meetings Today</p>
        <h2 className="text-3xl font-bold">3</h2>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <p className="text-gray-500">Available Engineers</p>
        <h2 className="text-3xl font-bold">5</h2>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <p className="text-gray-500">Efficiency</p>
        <h2 className="text-3xl font-bold">91%</h2>
      </div>
    </div>
  );
}