"use client"; // Ensure this component is a Client Component


import * as React from 'react';
import Card from '@mui/material/Card';
import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import { z as zod } from 'zod';
import {useState} from "react";
import {CompaniesFilters} from "@/components/dashboard/integrations/integrations-filters";

const schema = zod.object({
  file: zod
    .instanceof(File) // Ensure it's an instance of File
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: 'File size must be less than 2 MB',
    })
    .refine((file) => file.type === 'application/pdf', { // Allow only PDF files
      message: 'Only PDF files are allowed',
    }),
});

type Values = zod.infer<typeof schema>;
const defaultValues: Values = {file: null}; // Initialize with null for file

const styles = {
  label: {
    display: 'inline-block',
    cursor: 'pointer',
    margin: '10px 0',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3', // Change to your preferred color
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    textAlign: 'center',
    transition: 'background-color 0.3s',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745', // Green color for submit
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }
};

export function IntegrationCard(): React.JSX.Element {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: {errors},
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});
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
    const {files} = event.target;
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
    <Card sx={{p: 2}}>
      <input type="file" style={{ display: 'none' }} onChange={handleFileChange} id="file-upload" />
      <label htmlFor="file-upload" style={styles.label}>
        <span style={styles.button}>Upload File</span>
      </label>
      {loading && <p>waiting...</p>} {/* Loading indicator */}
      <CompaniesFilters props={res}></CompaniesFilters>
    </Card>
  );
}
