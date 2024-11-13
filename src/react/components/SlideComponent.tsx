import React, { useEffect, useState } from 'react';

interface ImageItem {
    name: string;
    path: string;
}

interface SlideComponentProps {
    props: ImageItem[];
}

const SlideComponent: React.FC<SlideComponentProps> = ({ props }) => {
    const [imagePaths, setImagePaths] = useState<ImageItem[]>([]);
    const [imageSelect, setImageSelect] = useState<{ name: string; url: string } | null>(null);

    useEffect(() => {
        if (props && props.length) {
            setImagePaths(props);
        }
    }, [props]);

    const selectImage = (name: string, url: string) => {
        setImageSelect({ name, url });
    };

    const renderImage = (name: string, url: string) => {
        return (
            <div key={name}> {/* Use a unique key for each item */}
                <img

                    onClick={() => selectImage(name, url)} // Pass a function reference
                    src={url}
                    alt={name}
                    style={{
                        cursor: 'pointer',
                        width: "auto",
                        height: `calc(${(100 / imagePaths.length)}vh - 9.5px)`,
                        border: "1px solid", "padding-bottom": "5px"
                    }} // Optional: add pointer cursor
                />
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', height: "100vh", gap: "10px" }}>
            <div>
                {imagePaths.map((item) => renderImage(item.name, `http://10.91.1.12:3000${item.path}`))}
            </div>
            <div>
                {imageSelect && imageSelect.url ? ( // Ensure imageSelect is not null
                    <img style={{ height: "100vh", border: "1px solid" }} src={imageSelect.url} alt={imageSelect.name} />
                ) : (
                    <p>No image selected</p> // Fallback for no selected image
                )}
            </div>
        </div>
    );
};

export default SlideComponent;