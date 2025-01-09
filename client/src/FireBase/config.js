// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import parseJwt from "../components/DesenciptarJWT";

const firebaseConfig = {
  apiKey: "AIzaSyBIGj7B660kgZC8pXD0vpdF4NifZSMwhWk",
  authDomain: "react-proyecto-13dd8.firebaseapp.com",
  projectId: "react-proyecto-13dd8",
  storageBucket: "react-proyecto-13dd8.appspot.com",
  messagingSenderId: "431308490875",
  appId: "1:431308490875:web:82762ac69832225f563ade"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)



export async function upLoadFile(file){
    const id = parseJwt(localStorage.getItem("token")).id
    const storageRef = ref(storage, `perfil/${"id:"+id}`)
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return url
}

export async function upLoadFileUser(file) {
  try {
      const id = parseJwt(localStorage.getItem("token")).id;
      const storageRef = ref(storage, `documentos/${"id:" + id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      return url;
  } catch (error) {
      console.error("Error al subir el archivo a Firebase:", error);
      throw error; // Lanza el error para que se pueda manejar en el componente
  }
}

export async function upLoadFileLibro(file) {
  try {
      const id = parseJwt(localStorage.getItem("token")).id;
      const storageRef = ref(storage, `libros/${"id:" + id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      return url;
  } catch (error) {
      console.error("Error al subir el archivo a Firebase:", error);
      throw error; // Lanza el error para que se pueda manejar en el componente
  }
}