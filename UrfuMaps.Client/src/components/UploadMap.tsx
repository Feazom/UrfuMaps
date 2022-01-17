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
      <div className="link-insert">
        <label>Ссылка: </label>
        <input value={link} onChange={handleLinkChange} />
      </div>
      <br />
      {link.length !== 0 ? (
        <img
          className="edited-map-image"
          alt=""
          src={link}
          onClick={handleClick}
        />
      ) : null}
    </div>
  );
};

export default UploadMap;
