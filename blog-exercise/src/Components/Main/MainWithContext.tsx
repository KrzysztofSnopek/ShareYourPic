import { useState, useEffect } from "react";
import { listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { onSnapshot } from "@firebase/firestore";
import { Loader } from "../../Helpers/Loader";
import { LikedPhotos, UploadedImage } from "../../Helpers/PhotoRepository";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { usePhotoStore } from "../../Helpers/PhotoStore";
import { observer } from "mobx-react";
import {
  likedPhotosCollectionRef,
  pictureListRef,
} from "../../Helpers/StorageReferences";
import Masonry from "@mui/lab/Masonry";
import { SinglePhotoPanel } from "./SinglePhotoPanel";

export const MainWithContext = observer(() => {
  const photoStore = usePhotoStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(likedPhotosCollectionRef, (doc) => {
      if (doc.data() !== undefined) {
        const newPhotoData = doc.data() as LikedPhotos;
        const likedPhotos = Object.values(newPhotoData);
        photoStore.setLikedPhotos(likedPhotos[0]);
      }
    });

    return () => unsubscribe();
  }, [photoStore]);

  useEffect(() => {
    listAll(pictureListRef).then((response) => {
      const promises = response.items.map((item) =>
        Promise.all([getDownloadURL(item), getMetadata(item)])
      );

      Promise.all(promises).then((results) => {
        const imageData: UploadedImage[] = [];

        results.forEach(([url, metadata]) => {
          const alt = metadata?.customMetadata?.imageName ?? "";
          const likeCount = metadata.customMetadata.likeCount;
          const storagePathElement = metadata.customMetadata.storagePathElement;
          imageData.push({
            url,
            alt,
            storagePathElement,
            likeCount,
          });
        });

        photoStore.setPictureList(imageData);
        setIsLoading(false);
      });
    });
  }, [photoStore]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div
        className={
          photoStore.isImgFullScreen
            ? "w-full min-h-screen fixed top-0 left-0 flex justify-center items-center bg-slate-900 bg-opacity-20 backdrop-blur-xl shadow-xl z-10"
            : "hidden"
        }
      >
        <div className="h-5/6">
          <img
            src={photoStore.tempImgURL}
            className="cursor-pointer max-h-screen"
            alt=""
            onClick={() => photoStore.setIsImgFullScreen(false)}
          />
        </div>
        <div
          className="cursor-pointer text-slate-600 hover:text-orange-500 fixed top-4 right-4"
          onClick={() => photoStore.setIsImgFullScreen(false)}
        >
          <DisabledByDefaultOutlinedIcon fontSize="large" color="inherit" />
        </div>
      </div>

      <div className="flex flex-wrap bg-slate-400 justify-center gap-6">
        <Masonry columns={4} spacing={1}>
          {photoStore.pictureList?.map((item, index) => {
            return (
              <SinglePhotoPanel index={index} item={item} key={item.url} />
            );
          })}
        </Masonry>
      </div>
    </div>
  );
});
