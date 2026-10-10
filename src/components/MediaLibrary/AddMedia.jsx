
import { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../contexts/useAxiosSecure";
import { imageUpload } from "../../utils";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { auth } from "../../firebase/firebase.init";

const AddMedia = () => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
const {user}=useAuth()
// console.log(user.displayName)

 const handleFileChange = async (data) => {
    const file = data.file?.[0];

    if (!file) {
      toast.error("Please select an image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be 2MB or smaller");
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload image to imgbb
      const imageUrl = await imageUpload(file);
console.log("Uploaded image URL:", imageUrl);
      // Step 2: Prepare media information
      const newsData = {
        fileName: file.name,
        imageUrl,
        fileType: file.type,
        fileSize: file.size,
        uploadedBy: {
          name: currentUser.displayName || "Unknown",
          email: currentUser.email,
          uid: currentUser.uid,
        },
        uploadedAt: new Date(),
      };

      // Step 3: Save data to MongoDB through backend
      const res = await axiosSecure.post("/news", newsData);

    //   console.log("Server response:", res.data);

      toast.success("Media uploaded successfully");
      reset();
    } catch (error) {
      console.error(
        "Upload error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to upload media"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-bold mb-5">
        Add Media
      </h2>

      <form onSubmit={handleSubmit(handleFileChange)}>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">
            Pick an image
          </legend>

          <input
            type="file"
            accept="image/*"
            className="file-input w-full"
            {...register("file", {
              required: "Please select an image",
            })}
          />

          <label className="label">
            Maximum size: 2MB
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-neutral mt-4"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default AddMedia;
