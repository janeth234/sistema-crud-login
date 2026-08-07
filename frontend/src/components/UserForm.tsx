import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import api from "../api/axios";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Props = {
  user?: User | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function UserForm({
  user,
  onSuccess,
  onCancel,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(user);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setPassword("");
    }
  }, [user]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (isEditing && user) {
        await api.put(`/users/${user.id}`, {
          name,
          email,
        });
      } else {
        await api.post("/auth/register", {
          name,
          email,
          password,
        });
      }

      onSuccess();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ??
            "No se pudo guardar el usuario",
        );
      } else {
        setMessage("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-overlay">
      <section className="user-form-card">
        <h2>
          {isEditing
            ? "Editar usuario"
            : "Nuevo usuario"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </label>

          <label>
            Correo
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </label>

          {!isEditing && (
            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />
            </label>
          )}

          {message && (
            <p className="message">
              {message}
            </p>
          )}

          <div className="user-form-actions">
            <button
              type="button"
              onClick={onCancel}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Guardando..."
                : isEditing
                  ? "Actualizar"
                  : "Guardar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}