"use client";

import React, {useState} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
// import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface FileUploadProps {
    onUpload: (file: File) => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
    const [uploadStatus, setUploadStatus] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadStatus('Uploading...');
            try {
                await onUpload(file);
                setUploadStatus('Upload successful');
            } catch (error) {
                setUploadStatus('Upload failed');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <label htmlFor="file-upload" className="custom-file-upload">
                <FontAwesomeIcon icon={faUpload} /> Upload File
            </label>
            <input id="file-upload" type="file" onChange={handleUpload} style={{ display: 'none' }} />
            <p>{uploadStatus}</p>
        </div>
    );
}

export default FileUpload;