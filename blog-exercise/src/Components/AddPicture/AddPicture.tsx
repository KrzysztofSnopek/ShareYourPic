import { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { ref, listAll, uploadString, getDownloadURL } from "firebase/storage";
import { auth, db } from "../../firebase";
import { observer } from "mobx-react";
import { v4 } from "uuid";
import { url } from "inspector";

export const AddPicture = observer(() => {
  // const [myImage, setMyImage] = useState(null);
  const [filebase64, setFileBase64] = useState<string>("");
  const [pictureList, setPictureList] = useState([]);
  const userName = auth.currentUser?.displayName;
  const pictureListRef = ref(storage, `projectFiles/${userName}`);
  console.log({ pictureListRef });

  const handleImageUpload = async (e: any) => {
    e.preventDefault();

    if (filebase64 === "") return;

    const imageRef = ref(storage, `projectFiles/${userName}/${v4()}`);

    await uploadString(imageRef, filebase64, "base64").then(() => {
      alert("uploaded to the storage");
    });
  };

  function convertFile(files: FileList | null): void {
    if (files) {
      const fileRef = files[0] || "";
      const fileType: string = fileRef.type || "";
      console.log("This file upload is of type:", fileType);
      const reader = new FileReader();
      reader.readAsBinaryString(fileRef);
      reader.onload = (e: any) => {
        // convert it to base64
        setFileBase64(`${btoa(e.target.result)}`);
      };
    }
  }

  useEffect(() => {
    listAll(pictureListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setPictureList((prev): any => [...prev, url]);
          console.log(pictureList);
        });
      });
    });
  }, []);

  console.log(pictureList);

  return (
    <div>
      <h1 className="font-bold p-2">Share your pictures with others here!</h1>

      <form onSubmit={handleImageUpload} className="p-2 bg-orange-300">
        <input type="file" onChange={(e) => convertFile(e.target.files)} />
        <button type="submit">Share your picture!</button>
      </form>

      {pictureList.map((url) => {
        return <img src={url} key={url} />;
      })}
    </div>
  );
});
