"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.config";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify'; // Importa toast y ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toast

// Spinner Component
const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de carga
  const db = getFirestore(); // Instancia de Firestore
  const router = useRouter(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Establece carga a verdadero
    setError(null);

    try {
      // Buscar el correo electrónico asociado al nombre de usuario
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No se encontró un usuario con ese nombre.");
        toast.error("No se encontró un usuario con ese nombre."); // Muestra el toast
        setLoading(false); // Establece carga a falso
        return;
      }

      // Obtener el correo electrónico del usuario encontrado
      const userData = querySnapshot.docs[0].data();
      const email = userData.email;
      const role = userData.role; // Obtener el rol del usuario

      // Intentar iniciar sesión con el correo electrónico asociado
      await signInWithEmailAndPassword(auth, email, password);
      
      // Redirigir al dashboard adecuado basado en el rol del usuario
      if (role === 'admin') {
        router.push("/dashboard"); // Redirige al dashboard de administrador
      } else if (role === 'waiter') {
        router.push("/main"); // Redirige al dashboard de camarero
      } else {
        setError("Rol de usuario desconocido.");
        toast.error("Rol de usuario desconocido."); // Muestra el toast
        setLoading(false);
      }

    } catch (error) {
      setError("Falló el inicio de sesión. Verifique sus credenciales.");
      toast.error("Falló el inicio de sesión. Verifique sus credenciales."); // Muestra el toast
    } finally {
      setLoading(false); // Establece carga a falso en ambos casos de éxito y error
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <ToastContainer /> {/* Agrega el ToastContainer aquí */}
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-sm">
        <div className="flex items-center justify-center mb-6">
          <Image src="/favicon.ico" alt="Logo" width={50} height={50} className="mr-5" />
          <h2 className="text-2xl font-bold text-gray-700">Order Now</h2>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <Spinner />} {/* Muestra el spinner cuando está cargando */}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg 
            hover:from-purple-600 hover:to-pink-500 hover:shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
