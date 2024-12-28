const API_URL = "smth";

interface UploadResponse {
    file_id: string;
}

interface ErrorResponse {
    error: string
}

export const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            // Attempt to parse error message
            const errorData = (await response.json().catch(() => ({}))) as ErrorResponse;
            console.error('File upload failed:', errorData.error ?? 'Unknown error');
            throw new Error(errorData.error ?? 'Unknown error occurred');
        }
        const data = (await response.json()) as UploadResponse;
        console.log('File uploaded succesfully: ', data)
        return data.file_id;
    } catch (error) {
        console.error('Error uploading file: ', error);
        throw error;
    }  
};