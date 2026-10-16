
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../contexts/useAxiosSecure";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { imageUpload } from "../../utils";

// import { imageUpload } from "../../utils";
// import useAxiosSecure from "../../contexts/useAxiosSecure";

const UpdateStory = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // Fetch existing story
  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);

        // Assumes GET /stories/:id exists
        const response = await axiosSecure.get(`/stories/${id}`);

        const data = response.data;

        if (!data || !data._id) {
          toast.error("Story not found");
          return;
        }

        setStory(data);

        setImages(
          (data.images || []).map((image) => ({
            ...image,
            caption: image.caption || "",
          }))
        );

        reset({
          title: data.title || "",
          publishedDate: data.publishedDate
            ? new Date(data.publishedDate)
                .toISOString()
                .slice(0, 16)
            : "",
        });
      } catch (error) {
        console.error("Fetch story error:", error);
        toast.error("Failed to load story");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStory();
  }, [id, axiosSecure, reset]);

  // Select new images
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5 MB`);
        return false;
      }

      return true;
    });

    setSelectedImages((previous) => [
      ...previous,
      ...validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        caption: "",
      })),
    ]);

    event.target.value = "";
  };

  // Edit existing caption
  const handleCaptionChange = (index, caption) => {
    setImages((previous) =>
      previous.map((image, i) =>
        i === index ? { ...image, caption } : image
      )
    );
  };

  // Edit new image caption
  const handleNewCaptionChange = (index, caption) => {
    setSelectedImages((previous) =>
      previous.map((image, i) =>
        i === index ? { ...image, caption } : image
      )
    );
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  // Remove new image
  const removeNewImage = (index) => {
    setSelectedImages((previous) => {
      const target = previous[index];

      if (target) URL.revokeObjectURL(target.preview);

      return previous.filter((_, i) => i !== index);
    });
  };

  // Update story
  const onSubmit = async (data) => {
    try {
      if (!data.title?.trim()) {
        toast.error("Story title is required");
        return;
      }

      if (!data.publishedDate) {
        toast.error("Published date is required");
        return;
      }

      setUploading(true);

      // Preserve existing image URLs and edited captions
      const existingImages = images.map((image) => ({
        imageUrl: image.imageUrl,
        caption: image.caption.trim(),
      }));

      // Upload new images
      const uploadedImages = await Promise.all(
        selectedImages.map(async (image) => {
          const response = await imageUpload(image.file);

          const imageUrl =
            typeof response === "string"
              ? response
              : response?.data?.display_url ||
                response?.data?.url ||
                response?.display_url ||
                response?.url;

          if (!imageUrl) {
            throw new Error("Image upload failed");
          }

          return {
            imageUrl,
            caption: image.caption.trim(),
          };
        })
      );

      const updateData = {
        title: data.title.trim(),
        publishedDate: new Date(
          data.publishedDate
        ).toISOString(),
        images: [...existingImages, ...uploadedImages],
      };

      if (updateData.images.length === 0) {
        toast.error("At least one image is required");
        return;
      }

      const response = await axiosSecure.patch(
        `/stories/${id}`,
        updateData
      );

      if (response.data.success) {
        toast.success("Story updated successfully!");

        selectedImages.forEach((image) =>
          URL.revokeObjectURL(image.preview)
        );

        navigate("/dashboard/all-stories");
      }
    } catch (error) {
      console.error("Update story error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update story"
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading story...</p>;
  }

  if (!story) {
    return <p className="p-6">Story not found.</p>;
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-800">
          Update Story
        </h1>

        <button
          type="button"
          onClick={() =>
            navigate("/all-story")
          }
          className="rounded-md bg-blue-600 px-4 py-3 text-white"
        >
          All Stories
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3"
      >
        {/* Story title and images */}
        <section className="space-y-5 rounded-lg bg-black p-5 shadow-sm lg:col-span-2">
          <div>
            <label className="mb-2 block font-medium">
              Story Title *
            </label>

            <input
              {...register("title", { required: true })}
              required
              placeholder="Story Title"
              className="w-full rounded-md border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <h2 className="mb-3 font-medium">
              Story Images & Captions
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={`${image.imageUrl}-${index}`}
                  className="rounded-md border border-slate-200 p-2"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.caption || "Story image"}
                    className="h-64 w-full rounded-md object-cover"
                  />

                  <label className="mt-3 block text-sm font-medium">
                    Story Caption
                  </label>

                  <textarea
                    value={image.caption}
                    onChange={(event) =>
                      handleCaptionChange(
                        index,
                        event.target.value
                      )
                    }
                    placeholder="Write image description"
                    rows={3}
                    className="mt-2 w-full rounded-md border border-slate-300 p-2"
                  />

                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="mt-2 text-sm text-red-600"
                  >
                    Remove image
                  </button>
                </div>
              ))}

              {selectedImages.map((image, index) => (
                <div
                  key={image.preview}
                  className="rounded-md border border-green-300 p-2"
                >
                  <img
                    src={image.preview}
                    alt={`New story image ${index + 1}`}
                    className="h-64 w-full rounded-md object-cover"
                  />

                  <label className="mt-3 block text-sm font-medium">
                    Story Caption
                  </label>

                  <textarea
                    value={image.caption}
                    onChange={(event) =>
                      handleNewCaptionChange(
                        index,
                        event.target.value
                      )
                    }
                    placeholder="Write image description"
                    rows={3}
                    className="mt-2 w-full rounded-md border border-slate-300 p-2"
                  />

                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="mt-2 text-sm text-red-600"
                  >
                    Remove image
                  </button>
                </div>
              ))}

              <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 p-4 text-center hover:border-green-600">
                <span className="text-4xl text-green-700">
                  +
                </span>

                <span className="mt-2 font-medium">
                  Select image(s)
                </span>

                <span className="mt-1 text-sm text-slate-500">
                  JPG, PNG, WEBP · Max 5 MB each
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {images.length + selectedImages.length} image(s)
            </p>
          </div>
        </section>

        {/* Metadata */}
        <section className="space-y-5 rounded-lg bg-black p-5 shadow-sm">
          <div>
            <label className="mb-2 block font-medium">
              Author Name
            </label>

            <input
              value={story.authorName || "N/A"}
              readOnly
              className="w-full rounded-md border px-3 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Story Category
            </label>

            <input
              value={story.category || ""}
              readOnly
              className="w-full rounded-md border  px-3 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Published Date *
            </label>

            <input
              type="datetime-local"
              {...register("publishedDate", {
                required: true,
              })}
              required
              className="w-full rounded-md border  px-3 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Publish Status
            </label>

            <input
              value={story.status || ""}
              readOnly
              className="w-full rounded-md border  px-3 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full rounded-md bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-60"
          >
            {uploading
              ? "Uploading / Updating..."
              : isSubmitting
                ? "Updating..."
                : "Update Story"}
          </button>
        </section>
      </form>
    </div>
  );
};

export default UpdateStory;
