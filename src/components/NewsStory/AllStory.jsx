
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import useAxiosSecure from "../../contexts/useAxiosSecure";
// import useAxiosSecure from "../contexts/useAxiosSecure";

const AllNews = () => {
  const axiosSecure = useAxiosSecure();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all stories
  const fetchStories = async () => {
    try {
      setLoading(true);

      const response = await axiosSecure.get("/stories");

      setStories(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Fetch stories error:", error);
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Delete story
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this story?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await axiosSecure.delete(
        `/stories/${id}`
      );

      if (response.data.success) {
        setStories((previous) =>
          previous.filter((story) => story._id !== id)
        );

        toast.success("Story deleted successfully");
      } else {
        toast.error(response.data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete story error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete story"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Format published date
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
            All Stories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all published stories and drafts.
          </p>
        </div>

        <Link
          to="/dashboard/add-story"
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Story
        </Link>
      </div>

      {/* Story count */}
      <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">
          Total Stories
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-800">
          {stories.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[750px] text-left">
          <thead className="bg-slate-100 text-sm text-slate-600">
            <tr>
              <th className="px-5 py-4 font-semibold">
                #
              </th>

              <th className="px-5 py-4 font-semibold">
                Story Title
              </th>

              <th className="px-5 py-4 font-semibold">
                Published Date
              </th>

              <th className="px-5 py-4 font-semibold">
                Author
              </th>

              <th className="px-5 py-4 text-center font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  Loading stories...
                </td>
              </tr>
            ) : stories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  No stories found.
                </td>
              </tr>
            ) : (
              stories.map((story, index) => (
                <tr
                  key={story._id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4 text-slate-500">
                    {index + 1}
                  </td>

                  <td className="max-w-xs px-5 py-4">
                    <div className="flex items-center gap-3">
                      {story.images?.[0]?.imageUrl && (
                        <img
                          src={story.images[0].imageUrl}
                          alt={story.title || "Story"}
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                        />
                      )}

                      <span className="font-medium text-slate-800">
                        {story.title || "Untitled"}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                    {formatDate(story.publishedDate)}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {story.authorName || "N/A"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/update-story/${story._id}`}
                        className="rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                      >
                        Update
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(story._id)}
                        disabled={deletingId === story._id}
                        className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === story._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllNews;
