
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import useAxiosSecure from "../../contexts/useAxiosSecure";
import { imageUpload } from "../../utils";

const AddPhoto = ({ writers = [] }) => {
  const axiosSecure = useAxiosSecure();

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      galleryTitle: "",
      guestWriterName: "",
      guestWriterDesignation: "",
      articleWriter: "",
      publishedDate: new Date().toISOString().slice(0, 16),
      status: "Published",
    },
  });

  // Select multiple images
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
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        caption: "",
      })),
    ]);

    event.target.value = "";
  };

  // Update image caption
  const handleCaptionChange = (id, caption) => {
    setSelectedImages((previous) =>
      previous.map((image) =>
        image.id === id ? { ...image, caption } : image
      )
    );
  };

  // Remove image
  const removeImage = (id) => {
    setSelectedImages((previous) => {
      const image = previous.find((item) => item.id === id);

      if (image) URL.revokeObjectURL(image.preview);

      return previous.filter((item) => item.id !== id);
    });
  };

  // Submit gallery
  const onSubmit = async (data) => {
    if (selectedImages.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      setUploading(true);

      // Upload all images to ImageBB
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
            throw new Error(
              `Failed to upload ${image.file.name}`
            );
          }

          return {
            imageUrl,
            caption: image.caption.trim(),
          };
        })
      );

      const photoData = {
        galleryTitle: data.galleryTitle.trim(),
        images: uploadedImages,
        guestWriterName: data.guestWriterName.trim(),
        guestWriterDesignation:
          data.guestWriterDesignation.trim(),
        articleWriter: data.articleWriter,
        publishedDate: new Date(
          data.publishedDate
        ).toISOString(),
        status: data.status,
        createdAt: new Date().toISOString(),
      };

      const response = await axiosSecure.post(
        "/photos",
        photoData
      );

      if (response.data.success) {
        toast.success("Photo gallery added successfully!");

        selectedImages.forEach((image) =>
          URL.revokeObjectURL(image.preview)
        );

        setSelectedImages([]);

        reset({
          galleryTitle: "",
          guestWriterName: "",
          guestWriterDesignation: "",
          articleWriter: "",
          publishedDate: new Date()
            .toISOString()
            .slice(0, 16),
          status: "Published",
        });
      } else {
        toast.error(
          response.data.message || "Failed to add gallery"
        );
      }
    } catch (error) {
      console.error("Add gallery error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add photo gallery"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">
          Add Photo Gallery
        </h1>

        <a
          href="/dashboard/all-photos"
          className="rounded-md bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          All Galleries
        </a>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3"
      >
        {/* Left section: Gallery and images */}
        <section className="space-y-4 rounded-lg bg-black p-5 shadow-sm lg:col-span-2">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Story Gallery <span className="text-red-500">*</span>
            </label>

            <input
              {...register("galleryTitle", {
                required: true,
              })}
              required
              placeholder="Gallery Title"
              className="w-full rounded-md border  px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          {/* Image cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {selectedImages.map((image, index) => (
              <div
                key={image.id}
                className="rounded-md border  p-2"
              >
                <img
                  src={image.preview}
                  alt={`Gallery image ${index + 1}`}
                  className="h-60 w-full rounded-md border  object-cover"
                />

                <div className="mt-2 flex items-center border border-green-700">
                  <span className="flex-1 truncate px-3 py-2 text-sm text-slate-600">
                    {image.file.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="bg-red-600 px-4 py-2 text-white"
                  >
                    Remove
                  </button>
                </div>

                <textarea
                  value={image.caption}
                  onChange={(event) =>
                    handleCaptionChange(
                      image.id,
                      event.target.value
                    )
                  }
                  placeholder="Story Caption"
                  rows={3}
                  className="mt-2 w-full rounded-md border  px-3 py-2 outline-none focus:border-green-600"
                />
              </div>
            ))}

            {/* Upload control */}
            <label className="flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 p-4 text-center hover:border-green-600">
              <span className="text-4xl text-green-700">+</span>

              <span className="mt-2 font-medium text-slate-700">
                Select image(s)
              </span>

              <span className="mt-1 text-sm text-slate-500">
                JPG, PNG, WEBP · Max 5 MB each
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-sm text-slate-500">
            {selectedImages.length} image(s) selected
          </p>
        </section>

        {/* Right section: Gallery details */}
        <section className="space-y-5 rounded-lg bg-black p-5 shadow-sm">
          <div>
            <label className="mb-2 block text-slate-700">
              Guest Writer Name
            </label>

            <input
              {...register("guestWriterName")}
              placeholder="Writer Name"
              className="w-full rounded-md border  px-3 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-slate-700">
              Guest Writer Designation
            </label>

            <input
              {...register("guestWriterDesignation")}
              placeholder="Writer Designation"
              className="w-full rounded-md border  px-3 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-slate-700">
              Article Writer <span className="text-red-500">*</span>
            </label>

            <select
              {...register("articleWriter", {
               
              })}
              
              className="w-full rounded-md border  bg-black px-3 py-3 outline-none focus:border-green-600"
            >
              <option value="">Select Writer</option>

              {writers.map((writer) => (
                <option
                  key={writer._id || writer.id || writer.name}
                  value={writer._id || writer.id || writer.name}
                >
                  {writer.name || writer.displayName}
                </option>
              ))}
            </select>

            {writers.length === 0 && (
              <p className="mt-1 text-xs text-slate-500">
                Pass your writer list to this component to
                populate the dropdown.
              </p>
            )}
          </div>

          <hr className="" />

          <div>
            <label className="mb-2 block text-slate-700">
              Published Date <span className="text-red-500">*</span>
            </label>

            <input
              type="datetime-local"
              {...register("publishedDate", {
                required: true,
              })}
              required
              className="w-full rounded-md border  px-3 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-slate-700">
              Publish Status
            </label>

            <select
              {...register("status", { required: true })}
              className="w-full rounded-md border bg-black px-3 py-3"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full rounded-md bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading
              ? "Uploading images..."
              : isSubmitting
                ? "Saving gallery..."
                : "Add New Gallery"}
          </button>
        </section>
      </form>
    </div>
  );
};

export default AddPhoto;
