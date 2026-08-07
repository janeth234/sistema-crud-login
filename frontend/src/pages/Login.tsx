import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const accessToken = response.data.data.accessToken;

      localStorage.setItem("accessToken", accessToken);

      setMessage("Inicio de sesión correcto");

      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ??
            "Error al iniciar sesión",
        );
      } else {
        setMessage("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Sistema CRUD</h1>

        <p>Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit}>
          <label>
            Correo electrónico

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="usuario@correo.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Contraseña

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>
        </form>

        {message && (
          <p className="message">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}