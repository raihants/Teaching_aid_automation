export default function OEECard({ title, value, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-semibold text-blue-600 mt-2">
        {value}
      </h2>
    </div>
  )
}