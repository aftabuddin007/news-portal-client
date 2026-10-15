


import { useForm } from "react-hook-form";
import useAxiosSecure from "../../contexts/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { toast } from "react-toastify";
import { imageUpload } from "../../utils";


const categories = [
  "Travel",
  "Lifestyle",
  "Technology",
  "Education",
  "Sports",
  "Entertainment",
  "Other",
];

const AddStory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      publishedDate: new Date().toISOString().slice(0, 16),
      status: "Published",
    },
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

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
        caption: "",
        preview: URL.createObjectURL(file),
      })),
    ]);

    // Same file can be selected again after removal.
    event.target.value = "";
  };

  const updateCaption = (id, caption) => {
    setSelectedImages((previous) =>
      previous.map((image) =>
        image.id === id ? { ...image, caption } : image
      )
    );
  };

  const removeImage = (id) => {
    setSelectedImages((previous) => {
      const target = previous.find((image) => image.id === id);

      if (target) URL.revokeObjectURL(target.preview);

      return previous.filter((image) => image.id !== id);
    });
  };

  const onSubmit = async (formData) => {
    if (!user) {
      toast.error("Please login before adding a story");
      return;
    }

    if (selectedImages.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      setUploading(true);

      // Upload every selected image to ImageBB.
      const uploadedImages = await Promise.all(
        selectedImages.map(async (image) => {
          const response = await imageUpload(image.file);

          // Adjust this line if your imageUpload utility
          // returns the URL in a different format.
          const imageUrl =
            typeof response === "string"
              ? response
              : response?.data?.display_url ||
                response?.data?.url ||
                response?.display_url ||
                response?.url;

          if (!imageUrl) {
            throw new Error("Image upload did not return a URL");
          }

          return {
            imageUrl,
            caption: image.caption.trim(),
          };
        })
      );

      const storyData = {
        title: formData.title.trim(),
        authorName:
          user.displayName || user.name || user.email,
        authorEmail: user.email,
        category: formData.category,
        publishedDate: new Date(
          formData.publishedDate
        ).toISOString(),
        status: formData.status,
        images: uploadedImages,
      };

      const response = await axiosSecure.post(
        "/stories",
        storyData
      );

      if (response.data.success) {
        toast.success("Story added successfully!");

        selectedImages.forEach((image) =>
          URL.revokeObjectURL(image.preview)
        );

        setSelectedImages([]);
        reset({
          title: "",
          category: "",
          publishedDate: new Date()
            .toISOString()
            .slice(0, 16),
          status: "Published",
        });
      } else {
        toast.error(response.data.message || "Failed to add story");
      }
    } catch (error) {
      console.error("Add story error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add story"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">
          New Story
        </h1>

        <button
          type="button"
          onClick={() =>
            (window.location.href = "/dashboard/all-stories")
          }
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          All Stories
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3"
      >
        {/* Left: Story title and images */}
        <section className="rounded-lg bg-black p-5 shadow-sm lg:col-span-2">
          <label className="mb-2 block font-medium">
            Story Title <span className="text-red-500">*</span>
          </label>

          <input
            {...register("title", { required: true })}
            required
            placeholder="Story Title"
            className="mb-5 w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {selectedImages.map((image, index) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-md border border-slate-200 p-2"
              >
                <img
                  src={image.preview}
                  alt={`Story image ${index + 1}`}
                  className="h-64 w-full rounded object-cover"
                />

                <div className="mt-3">
                  <label className="mb-1 block text-sm font-medium">
                    Image {index + 1} Caption
                  </label>

                  <input
                    value={image.caption}
                    onChange={(event) =>
                      updateCaption(image.id, event.target.value)
                    }
                    placeholder="Write a caption"
                    className="w-full rounded border border-slate-300 px-3 py-2"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            ))}

            {/* Add another image */}
            <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 p-4 text-center hover:border-green-600">
              <span className="text-4xl text-green-700">+</span>
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
                className="sr-only"
              />
            </label>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {selectedImages.length} image(s) selected
          </p>
        </section>

        {/* Right: Story metadata */}
        <section className="space-y-4 rounded-lg bg-black p-5 shadow-sm">
          <div>
            <label className="mb-2 block font-medium">
              Author Name
            </label>
            <input
              value={
                user?.displayName ||
                user?.name ||
                "Not logged in"
              }
              readOnly
              className="w-full rounded-md border bg-black px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Story Category *
            </label>
            <select
              {...register("category", { required: true })}
              required
              className="w-full rounded-md border border-slate-300 bg-black px-3 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Published Date *
            </label>
            <input
              type="datetime-local"
              {...register("publishedDate", { required: true })}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Publish Status
            </label>
            <select
              {...register("status", { required: true })}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || uploading || !user}
            className="w-full rounded-md bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading
              ? "Uploading images..."
              : isSubmitting
                ? "Saving story..."
                : "Save New Story"}
          </button>
        </section>
      </form>
    </div>
  );
};

export default AddStory;
