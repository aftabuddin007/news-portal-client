
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import useAxiosSecure from "../../contexts/useAxiosSecure";
import { imageUpload } from "../../utils";

const UpdatePhoto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [photo, setPhoto] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // Fetch existing gallery
  useEffect(() => {
    let active = true;

    const fetchPhoto = async () => {
      try {
        setLoading(true);

        const response = await axiosSecure.get(`/photos/${id}`);
        const data = response.data;

        if (!data?._id) {
          if (active) toast.error("Gallery not found");
          return;
        }

        if (!active) return;

        setPhoto(data);

        setImages(
          (data.images || []).map((image) => ({
            ...image,
            caption: image.caption || "",
          }))
        );

        reset({
          galleryTitle: data.galleryTitle || "",
          guestWriterName: data.guestWriterName || "",
          guestWriterDesignation:
            data.guestWriterDesignation || "",
          publishedDate: data.publishedDate
            ? new Date(data.publishedDate)
                .toISOString()
                .slice(0, 16)
            : "",
          status: data.status || "Published",
        });
      } catch (error) {
        console.error("Fetch gallery error:", error);

        if (active) {
          toast.error(
            error.response?.data?.message ||
              "Failed to load photo gallery"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) fetchPhoto();

    return () => {
      active = false;
    };
  }, [id, reset]);

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

    setNewImages((previous) => [
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

  // Edit existing image caption
  const handleCaptionChange = (index, caption) => {
    setImages((previous) =>
      previous.map((image, i) =>
        i === index ? { ...image, caption } : image
      )
    );
  };

  // Edit new image caption
  const handleNewCaptionChange = (imageId, caption) => {
    setNewImages((previous) =>
      previous.map((image) =>
        image.id === imageId ? { ...image, caption } : image
      )
    );
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    setImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  // Remove newly selected image
  const removeNewImage = (imageId) => {
    setNewImages((previous) => {
      const target = previous.find(
        (image) => image.id === imageId
      );

      if (target) URL.revokeObjectURL(target.preview);

      return previous.filter((image) => image.id !== imageId);
    });
  };

  // Submit updated gallery
  const onSubmit = async (data) => {
    if (!data.galleryTitle?.trim()) {
      toast.error("Gallery title is required");
      return;
    }

    if (!data.publishedDate) {
      toast.error("Published date is required");
      return;
    }

    try {
      setUploading(true);

      // Keep existing URLs and updated captions
      const existingImages = images.map((image) => ({
        imageUrl: image.imageUrl,
        caption: image.caption.trim(),
      }));

      // Upload newly selected images
      const uploadedImages = await Promise.all(
        newImages.map(async (image) => {
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

      const finalImages = [
        ...existingImages,
        ...uploadedImages,
      ];

      if (finalImages.length === 0) {
        toast.error("At least one image is required");
        return;
      }

      const updateData = {
        galleryTitle: data.galleryTitle.trim(),
        images: finalImages,
        guestWriterName: data.guestWriterName.trim(),
        guestWriterDesignation:
          data.guestWriterDesignation.trim(),
        publishedDate: new Date(
          data.publishedDate
        ).toISOString(),
        status: data.status,
      };

      const response = await axiosSecure.patch(
        `/photos/${id}`,
        updateData
      );

      if (response.data.success) {
        toast.success("Photo gallery updated successfully!");

        newImages.forEach((image) =>
          URL.revokeObjectURL(image.preview)
        );

        navigate("/dashboard/all-photos");
      }
    } catch (error) {
      console.error("Update photo error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update photo gallery"
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading photo gallery...</p>;
  }

  if (!photo) {
    return <p className="p-6">Photo gallery not found.</p>;
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Update Photo Gallery
        </h1>

        <button
          type="button"
          onClick={() => navigate("/all-photo")}
          className="rounded-md bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
        >
          All Galleries
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3"
      >
        {/* Gallery title and images */}
        <section className="space-y-5 rounded-lg  bg-black p-5 shadow-sm lg:col-span-2">
          <div>
            <label className="mb-2 block font-medium">
              Gallery Title *
            </label>

            <input
              {...register("galleryTitle", { required: true })}
              required
              placeholder="Gallery Title"
              className="w-full rounded-md border   px-4 py-3 focus:border-green-600 focus:outline-none"
            />
          </div>

          <h2 className="font-medium text-slate-800">
            Gallery Images & Captions
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((image, index) => (
              <div
                key={`${image.imageUrl}-${index}`}
                className="rounded-lg border   p-3"
              >
                <img
                  src={image.imageUrl}
                  alt={image.caption || "Gallery image"}
                  className="h-60 w-full rounded-md object-cover"
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
                  placeholder="Image description"
                  rows={3}
                  className="mt-2 w-full rounded-md border   p-3 focus:border-green-600 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove image
                </button>
              </div>
            ))}

            {newImages.map((image) => (
              <div
                key={image.id}
                className="rounded-lg border border-green-300 p-3"
              >
                <img
                  src={image.preview}
                  alt="New gallery image"
                  className="h-60 w-full rounded-md object-cover"
                />

                <label className="mt-3 block text-sm font-medium">
                  Story Caption
                </label>

                <textarea
                  value={image.caption}
                  onChange={(event) =>
                    handleNewCaptionChange(
                      image.id,
                      event.target.value
                    )
                  }
                  placeholder="Image description"
                  rows={3}
                  className="mt-2 w-full rounded-md border   p-3"
                />

                <button
                  type="button"
                  onClick={() => removeNewImage(image.id)}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove image
                </button>
              </div>
            ))}

            <label className="flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 p-4 text-center hover:border-green-600">
              <span className="text-4xl text-green-700">+</span>

              <span className="mt-2 font-medium">
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
            {images.length + newImages.length} image(s) selected
          </p>
        </section>

        {/* Gallery metadata */}
        <section className="space-y-5 rounded-lg  bg-black p-5 shadow-sm">
          <div>
            <label className="mb-2 block font-medium">
              Guest Writer Name
            </label>

            <input
              {...register("guestWriterName")}
              placeholder="Writer Name"
              className="w-full rounded-md border   px-3 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Guest Writer Designation
            </label>

            <input
              {...register("guestWriterDesignation")}
              placeholder="Writer Designation"
              className="w-full rounded-md border   px-3 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Published Date *
            </label>

            <input
              type="datetime-local"
              {...register("publishedDate", { required: true })}
              required
              className="w-full rounded-md border   px-3 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Publish Status
            </label>

            <select
              {...register("status", { required: true })}
              className="w-full rounded-md border  bg-black px-3 py-3"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full rounded-md bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading
              ? "Uploading / Updating..."
              : isSubmitting
                ? "Updating..."
                : "Update Gallery"}
          </button>
        </section>
      </form>
    </div>
  );
};

export default UpdatePhoto;
