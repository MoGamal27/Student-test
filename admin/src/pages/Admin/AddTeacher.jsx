import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function AddTeacher() {
    const [teachImg, setTeachImg] = useState(null); // For teacher image
    const [teachVideo, setTeachVideo] = useState(null); // For teacher video
    const [name, setName] = useState('');
    const [old, setOld] = useState(''); // Age (old) field
    const [bio, setBio] = useState(''); // Bio field
    const { backendUrl, token } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!teachImg) {
                return toast.error('Image Not Selected');
            }
            if (!teachVideo) {
                return toast.error('Video Not Selected');
            }

            const formData = new FormData();
            formData.append('image', teachImg); // Image file
            formData.append('video', teachVideo); // Video file
            formData.append('name', name); // Teacher's name
            formData.append('old', old); // Teacher's age
            formData.append('bio', bio); // Teacher's bio

            // Log form data for debugging
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            // API call to create teacher
            const { data } = await axios.post(backendUrl, formData, {
                headers: { token, 'Content-Type': 'multipart/form-data' },
            });

            if (data.success) {
                toast.success(data.message);
                // Clear form
                setTeachImg(null);
                setTeachVideo(null);
                setName('');
                setOld('');
                setBio('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Add Teacher</p>

            <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-scroll">
                <div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="teach-img">
                        <img
                            className="w-16 bg-gray-100 rounded-full cursor-pointer"
                            src={teachImg ? URL.createObjectURL(teachImg) : assets.upload_area}
                            alt=""
                        />
                    </label>
                    <input onChange={(e) => setTeachImg(e.target.files[0])} type="file" id="teach-img" hidden />
                    <p>Upload Teacher <br /> picture</p>
                </div>

                <div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="teach-video">
                        <span className="cursor-pointer text-blue-500">Upload Video</span>
                    </label>
                    <input onChange={(e) => setTeachVideo(e.target.files[0])} type="file" id="teach-video" hidden />
                    <p>Upload Teacher <br /> introduction video</p>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600 ">
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <p>Teacher Name</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="border rounded px-3 py-2"
                                type="text"
                                placeholder="Name"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Teacher Age</p>
                            <input
                                onChange={(e) => setOld(e.target.value)}
                                value={old}
                                className="border rounded px-3 py-2"
                                type="number"
                                placeholder="Age"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>About Teacher</p>
                            <textarea
                                onChange={(e) => setBio(e.target.value)}
                                value={bio}
                                className="w-full px-4 pt-2 border rounded"
                                placeholder="Write about teacher"
                                rows={5}
                                required
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">
                    Add Teacher
                </button>
            </div>
        </form>
    );
}
