import React, {useState} from "react";

const Uploadtest = () => {
    const [image, setImage] = useState("");
    const covertTobase64 = (event) =>{
        console.log(event)
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () =>{
            console.log(reader.result);
            setImage(reader.result);
        };
        reader.onerror = error =>{
            console.log("Error:" , error);
        };
    } 
    return (
        <div>
            <input accept="image/*" type="file" onChange={covertTobase64}/>
            {image=="" || image==null?"": <img width={100} height={100} src={image}/>}
        </div>
    );
};

export default Uploadtest;