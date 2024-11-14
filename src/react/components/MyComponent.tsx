import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import SlideComponent from './SlideComponent'; // Assuming this is the correct import

const MyComponent = () => {
    const { register, setError, clearErrors, errors } = useForm();
    const [res, setRes] = useState();
    const [loading, setLoading] = useState(false); // Loading state


    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const requestOptions = {
            method: "POST",
            body: formData,
            redirect: "follow"
        };

        setLoading(true); // Set loading to true before the request

        try {
            const response = await fetch("http://10.91.1.12:3000/pdf/upload", requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRes(data.message);
        } catch (error) {
            console.error("Error:", error); // Handle errors
        } finally {
            setLoading(false); // Set loading to false after the request completes
        }
    };

    const handleFileChange = async (event) => {
        const { files } = event.target;
        // Check if the file is a valid PDF
        if (!files[0] || files[0].type !== "application/pdf") {
            setError("pdf", {
                type: "manual",
                message: "Please select a valid PDF file.",
            });
            return;
        }

        clearErrors("pdf"); // Clear any previous errors
        await uploadFile(files[0]) // Upload the file immediately
    };

    return (
        <div>
            <form>
                <input
                    type="file"
                    accept="application/pdf"
                    {...register("pdf")}
                    onChange={handleFileChange} // Trigger upload on file change
                />
            </form>
            <p style={{ color: 'red' }}>
                {errors?.pdf?.message}
            </p>
            {loading && <p>waiting...</p>} {/* Loading indicator */}
            <SlideComponent props={res} />
        </div>
    );
};

export default MyComponent;