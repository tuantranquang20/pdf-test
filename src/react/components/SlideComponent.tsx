import React, {useEffect, useState} from 'react';

interface ImageItem {
    name: string;
    path: string;
}

interface SlideComponentProps {
    props: ImageItem[];
}

const SlideComponent: React.FC<SlideComponentProps> = ({props}) => {
    const [imagePaths, setImagePaths] = useState<ImageItem[]>([]);
    const [imageSelect, setImageSelect] = useState<{ name: string; url: string } | null>(null);
    const [imagesSelected, setImagesSelect] = useState<string[]>([]);

    useEffect(() => {
        if (props && props.length) {
            setImagePaths(props);
        }
    }, [props]);

    const selectImage = (name: string, url: string) => {
        setImageSelect({name, url});
        setImagesSelect(prev => toggleValueInArray(prev, url));
    };

    const toggleValueInArray = (arr: string[], value: string) => {
        const index = arr.indexOf(value);
        if (index !== -1) {
            return arr.filter(item => item !== value); // Remove value
        } else {
            return [...arr, value]; // Add value
        }
    };

    const addClassSelectedImage = (url: string) => {
        return imagesSelected.includes(url)
            ? {image: "active-image", div: "active-container"}
            : {image: "", div: ""};
    };

    const renderImage = (item: ImageItem) => {
        const {name, path} = item;
        const url = `http://10.91.1.12:3000${path}`;
        const classes = addClassSelectedImage(url);

        return (
            <div key={name} className={classes.div}>
                <img
                    onClick={() => selectImage(name, url)}
                    src={url}
                    alt={name}
                    className={classes.image}
                    style={{
                        cursor: 'pointer',
                        width: "auto",
                        height: `calc(${(100 / imagePaths.length)}vh - 9.5px)`,
                        border: "1px solid",
                        paddingBottom: "5px"
                    }}
                />
            </div>
        );
    };

    return (
        <div>
            <div style={{display: 'flex', height: "100vh", gap: "10px"}}>
                <div style={{width: "10%", paddingTop: "25px"}}>
                    {imagePaths.map(renderImage)} {/* Pass the item directly */}
                </div>
                <div>
                    <div style={{
                        height: "20px",
                        marginBottom: "5px",
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <div>{ imagePaths.length ?`Total Pages: ${imagePaths.length}`: ''}</div>
                        <div>{imagesSelected.length ? `Number of Pages Selected: ${imagesSelected.length}`: ''}</div>
                        <div>{imagesSelected.length ? `AI Process`: '' }</div>
                    </div>
                    {imageSelect ? (
                        <img style={{height: "100vh", border: "1px solid"}} src={imageSelect.url}
                             alt={imageSelect.name}/>
                    ) : (
                        <p></p> // Fallback message
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlideComponent;