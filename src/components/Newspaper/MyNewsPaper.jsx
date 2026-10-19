
import { useState } from "react";

const MyNewsPaper = () => {
  const [formData, setFormData] = useState({
    edition: "",
    day: "",
    banglaDate: "",
    englishDate: "",
    arabicDate: "",
    totalPage: "",
  });

  const [editions, setEditions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setEditions((prev) => [
      ...prev,
      { ...formData, id: Date.now() },
    ]);

    setFormData({
      edition: "",
      day: "",
      banglaDate: "",
      englishDate: "",
      arabicDate: "",
      totalPage: "",
    });
  };

  const fields = [
    { name: "edition", label: "Edition", type: "text" },
    { name: "day", label: "Day", type: "text" },
    { name: "banglaDate", label: "Bangla Date", type: "text" },
    { name: "englishDate", label: "English Date", type: "date" },
    { name: "arabicDate", label: "Arabic Date", type: "text" },
    { name: "totalPage", label: "Total Page", type: "number" },
  ];

  return (
    <div className="min-h-screen bg-black px-5 py-6 text-white md:px-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          My Newspaper
        </h1>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Add Edition Form */}
        <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-xl md:p-7 lg:col-span-9">
          <h2 className="mb-5 text-2xl font-medium md:text-3xl">
            Add New Edition
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-base text-zinc-200"
                  >
                    {field.label}
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    min={field.type === "number" ? 1 : undefined}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="mt-6 rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Add Edition
            </button>
          </form>
        </section>

        {/* All Editions */}
        <aside className="lg:col-span-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">All Edition</h2>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
                {editions.length}
              </span>
            </div>

            {editions.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No editions added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {editions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-zinc-800 bg-black p-4"
                  >
                    <h3 className="font-semibold text-white">
                      {item.edition}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-400">
                      {item.day}
                    </p>

                    <p className="mt-2 text-sm text-zinc-300">
                      English Date: {item.englishDate}
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      Total Pages: {item.totalPage}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyNewsPaper;
