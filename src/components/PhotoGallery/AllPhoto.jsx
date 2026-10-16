
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";

import useAxiosSecure from "../../contexts/useAxiosSecure";

const AllPhoto = () => {
  const axiosSecure = useAxiosSecure();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all photo galleries
  const fetchPhotos = async () => {
    try {
      setLoading(true);

      const response = await axiosSecure.get("/photos");

      setPhotos(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Fetch photos error:", error);
      toast.error("Failed to load photo galleries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Delete gallery
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo gallery?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await axiosSecure.delete(
        `/photos/${id}`
      );

      if (response.data.success) {
        setPhotos((previous) =>
          previous.filter((photo) => photo._id !== id)
        );

        toast.success("Photo gallery deleted successfully");
      } else {
        toast.error(
          response.data.message || "Failed to delete gallery"
        );
      }
    } catch (error) {
      console.error("Delete gallery error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete photo gallery"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
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

  // Resolve author name
  const getAuthorName = (photo) => {
    return (
      photo.guestWriterName?.trim() ||
      photo.articleWriterName ||
      photo.articleWriter ||
      "N/A"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
            All Photo Galleries
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your photo galleries.
          </p>
        </div>

        <Link
          to="/dashboard/add-photo-gallery"
          className="rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Gallery
        </Link>
      </div>

      {/* Gallery count */}
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">
          Total Galleries
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-800">
          {photos.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-slate-100 text-sm text-slate-600">
            <tr>
              <th className="px-5 py-4 font-semibold">#</th>
              <th className="px-5 py-4 font-semibold">
                Gallery Title
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
                  Loading photo galleries...
                </td>
              </tr>
            ) : photos.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  No photo galleries found.
                </td>
              </tr>
            ) : (
              photos.map((photo, index) => (
                <tr
                  key={photo._id}
                  className="transition hover:bg-slate-50"
                >
                  {/* Serial */}
                  <td className="px-5 py-4 text-slate-500">
                    {index + 1}
                  </td>

                  {/* Title and thumbnail */}
                  <td className="max-w-sm px-5 py-4">
                    <div className="flex items-center gap-3">
                      {photo.images?.[0]?.imageUrl && (
                        <img
                          src={photo.images[0].imageUrl}
                          alt={photo.galleryTitle || "Gallery"}
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                        />
                      )}

                      <span className="font-medium text-slate-800">
                        {photo.galleryTitle || "Untitled Gallery"}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                    {formatDate(photo.publishedDate)}
                  </td>

                  {/* Author */}
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {getAuthorName(photo)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/update-photo/${photo._id}`}
                        className="rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                      >
                        Update
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(photo._id)}
                        disabled={deletingId === photo._id}
                        className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === photo._id
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

export default AllPhoto;
