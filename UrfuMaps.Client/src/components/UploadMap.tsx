import {
  MouseEvent,
  FormEvent,
} from 'react';
import './UploadMap.css';

type UploadMapProps = {
  setCoords: Function;
  link: string;
  setLink: Function;
};

const UploadMap = ({ setCoords, link, setLink }: UploadMapProps) => {
  // async function handleImage(img: ImageListType) {
  //   setImages(img);
  // }

  function handleLinkChange(event: FormEvent<HTMLInputElement>) {
    setLink(event.currentTarget.value);
  }

  function handleClick(event: MouseEvent<HTMLImageElement>) {
    const offset = event.currentTarget.getBoundingClientRect();
    setCoords({
      x: (((event.clientX - offset.left) * 100) / offset.width).toFixed(4),
      y: (((event.clientY - offset.top) * 100) / offset.height).toFixed(4),
    });
  }

  return (
    <div>
      <label>Link: </label>
      <input value={link} onChange={handleLinkChange} />
      <br />
      {link.length !== 0 ? (
        <img
          className="edited-map-image"
          alt=""
          src={link}
          onClick={handleClick}
        />
      ) : null}
      {/* <ImageUploading value={images} onChange={handleImage} maxNumber={1}>
        {({ imageList, onImageUpload, onImageUpdate, onImageRemove }) => (
          <div className="upload-wrapper">
            <button onClick={onImageUpload}>Upload Image</button>
            <br />
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.dataURL} alt="" onClick={handleClick} />
                <div className="image-item-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading> */}
    </div>
  );
};

export default UploadMap;
