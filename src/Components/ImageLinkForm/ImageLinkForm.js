import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({onInputChange, onButtonSubmit, name, entries}) => {
    return(
            <div>
                <p className="f4 fw9">
                    {name} 
                </p>
                <p className="f4 fw9 i">
                    Entries: {entries} 
                </p>
                <p className="f3">
                    This Magic Brain will detect faces in your pictures
                </p>
                <div className="pa4 br3 shadow-5 w-50 center form">
                    <input className="w-70 " type="text" placeholder ="Copy your url here : " onChange={onInputChange}/>
                    <button className="w-30 detect pointer" onClick= {onButtonSubmit}>Detect</button>
                </div>
            </div>
    );
}
export default ImageLinkForm;