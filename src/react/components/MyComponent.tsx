import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import SlideComponent from "./SlideComponent";

const MyComponent = () => {
    const { register, handleSubmit, setError, clearErrors, errors } = useForm();
    const [res, setRes] = useState()
    useEffect((

    ) => { }, [res])

    const onSubmit = async (data) => {
        const { pdf } = data;
        // Check if the file is a valid PDF
        if (!pdf[0] || pdf[0].type !== "application/pdf") {
            setError("pdf", {
                type: "manual",
                message: "Please select a valid PDF file.",
            });
            return;
        }
        const formData = new FormData();
        formData.append("file", pdf[0])

        const requestOptions = {
            method: "POST",
            body: formData,
            redirect: "follow"
        };
        fetch("http://10.91.1.12:3000/pdf/upload", requestOptions)
            .then((response) => {
                // Check if the response is ok (status in the range 200-299)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Parse JSON response

            })
            .then((data) => {
                setRes(data.message)
            })
            .catch((error) => {
                console.error("Error:", error); // Handle errors
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="file"
                    accept="application/pdf"
                    {...register("pdf")}
                />
                <button type="submit">Upload PDF</button>
            </form>
            <p style={{ color: 'red' }}>
                {errors?.pdf?.message}
            </p>
            <SlideComponent props={res} />
        </div>
    );
};

export default MyComponent;