import axios from 'axios';

export const uploadImage = async (file: File) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw new Error('Недопустимый формат файла. Пожалуйста, загрузите изображение в формате JPG, JPEG, PNG или GIF.');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(import.meta.env.VITE_IMGBB_UPLOAD_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        params: {
            key: import.meta.env.VITE_IMGBB_API_KEY,
        },
    });

    return response.data.data.url;
};