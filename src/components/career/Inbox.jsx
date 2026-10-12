import { useEffect, useState } from "react";
import useAxiosSecure from "../../contexts/useAxiosSecure";
import { toast } from "react-toastify";
// import toast from "react-hot-toast";

const Inbox = () => {
    const axiosSecure = useAxiosSecure();

    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // Get all careers
    useEffect(() => {
        let active = true;

        const fetchCareers = async () => {
            try {
                const res = await axiosSecure.get("/careers");

                if (active) {
                    setCareers(res.data);
                }
            } catch (error) {
                console.error(error);
                if (active) {
                    setError("Failed to load careers");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchCareers();

        return () => {
            active = false;
        };
    }, [axiosSecure]);

    // Delete career
    const handleDelete = async (id) => {
        try {
            setDeletingId(id);

            const res = await axiosSecure.delete(`/careers/${id}`);

            if (res.data.deletedCount > 0) {
                // Update UI without refetching
                setCareers((prevCareers) =>
                    prevCareers.filter((career) => career._id !== id)
                );

                toast.success("Career deleted successfully!");
            } else {
                toast.error("Career could not be deleted.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete career.");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-5">
                Total Careers: {careers.length}
            </h2>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {careers.map((career, index) => (
                            <tr key={career._id}>
                                <td>{index + 1}</td>
                                <td>{career.title}</td>
                                <td>{career.company}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(career._id)}
                                        disabled={deletingId !== null}
                                        className="btn btn-error btn-sm"
                                    >
                                        {deletingId === career._id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {careers.length === 0 && (
                    <p className="text-center py-5">
                        No careers found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Inbox;