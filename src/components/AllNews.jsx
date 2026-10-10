
import { useEffect, useState } from "react";
// import useAxiosSecure from "../contexts/useAxiosSecure";
import { toast } from "react-toastify";
import useAxiosSecure from "../contexts/useAxiosSecure";

const AllNews = () => {
  const axiosSecure = useAxiosSecure();

  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Fetch all images
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axiosSecure.get("/news");
        setNews(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load images.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [axiosSecure]);

  // Open modal and fetch image details
  const handleImageClick = async (id) => {
    setSelectedNews({ _id: id });
    setDetailsLoading(true);

    try {
      const res = await axiosSecure.get(`/news/${id}`);
      setSelectedNews(res.data);
    } catch (err) {
      console.error("Details error:", err);
      toast.error("Failed to load image details.");
      setSelectedNews(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    if (deleting) return;
    setSelectedNews(null);
  };

  // Open image in a new tab
  const handleViewImage = () => {
    if (!selectedNews?.imageUrl) return;

    window.open(
      selectedNews.imageUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Delete image record
  const handleDelete = async () => {
    if (!selectedNews?._id || deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      await axiosSecure.delete(`/news/${selectedNews._id}`);

      setNews((prevNews) =>
        prevNews.filter(
          (item) => item._id !== selectedNews._id
        )
      );

      setSelectedNews(null);
      toast.success("Image deleted successfully.");
    } catch (err) {
      console.error(
        "Delete error:",
        err.response?.data || err.message
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to delete image."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10">Loading images...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        All Media ({news.length})
      </h2>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {news.map((item) => (
          <button
            type="button"
            key={item._id}
            onClick={() => handleImageClick(item._id)}
            aria-label={`View details for ${item.fileName || "image"}`}
            className="group overflow-hidden rounded-xl border-2 border-gray-200
              bg-white p-1 shadow-sm transition-all duration-300
              hover:border-blue-500 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img
              src={item.imageUrl}
              alt={item.fileName || "Media image"}
              loading="lazy"
              className="w-full aspect-square rounded-lg object-cover
                transition-transform duration-300
                group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {news.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No images found.
        </p>
      )}

      {/* Image Details Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
            bg-black/70 p-4"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-lg max-h-[90vh]
              overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeModal}
              disabled={deleting}
              aria-label="Close modal"
              className="absolute right-3 top-3 z-10 flex h-9 w-9
                items-center justify-center rounded-full
                bg-white text-2xl text-gray-700 shadow
                hover:bg-gray-100 disabled:opacity-50"
            >
              &times;
            </button>

            {detailsLoading ? (
              <p className="py-16 text-center">
                Loading image details...
              </p>
            ) : (
              <>
                {/* Preview */}
                {selectedNews.imageUrl && (
                  <div className="mb-5 overflow-hidden rounded-xl border">
                    <img
                      src={selectedNews.imageUrl}
                      alt={selectedNews.fileName || "Media image"}
                      className="max-h-80 w-full object-contain"
                    />
                  </div>
                )}

                <h3
                  id="modal-title"
                  className="mb-4 break-words text-black text-xl font-bold"
                >
                  Image Details
                </h3>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b pb-2">
                    <span className="text-gray-500">File name</span>
                    <span className="break-all text-right font-medium text-black">
                      {selectedNews.fileName || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-b pb-2">
                    <span className="text-gray-500">File type</span>
                    <span className="text-right text-black">
                      {selectedNews.fileType || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-b pb-2">
                    <span className="text-gray-500">File size</span>
                    <span className="text-right text-black">
                      {Number.isFinite(selectedNews.fileSize)
                        ? `${(
                            selectedNews.fileSize / (1024 * 1024)
                          ).toFixed(2)} MB`
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-b pb-2">
                    <span className="text-gray-500">Uploaded by</span>
                    <span className="break-all text-right text-black">
                      {selectedNews.uploadedBy?.name || "Unknown"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-b pb-2">
                    <span className="text-gray-500">Email</span>
                    <span className="break-all text-right text-black">
                      {selectedNews.uploadedBy?.email || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Upload date</span>
                    <span className="text-right text-black">
                      {selectedNews.uploadedAt
                        ? new Date(
                            selectedNews.uploadedAt
                          ).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleViewImage}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-3
                      font-semibold text-white transition
                      hover:bg-blue-700"
                  >
                    View Image
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-3
                      font-semibold text-white transition
                      hover:bg-red-700 disabled:cursor-not-allowed
                      disabled:opacity-60"
                  >
                    {deleting ? "Deleting..." : "Delete Image"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllNews;
