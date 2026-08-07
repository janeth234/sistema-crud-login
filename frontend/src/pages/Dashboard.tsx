import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import UserForm from "../components/UserForm";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] =
    useState<User | null>(null);

  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const response = await api.get("/users");

      setUsers(response.data.data);
      setMessage("");
    } catch {
      setMessage("No se pudieron cargar los usuarios");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Aunque falle la petición,
      // eliminamos la sesión local.
    }

    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este usuario?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);

      setMessage("Usuario eliminado correctamente");

      await loadUsers();
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ??
          "No se pudo eliminar el usuario",
      );
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Sistema CRUD</h1>
          <p>Administración de usuarios</p>
        </div>

        <button onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <section className="dashboard-card">
        <div className="dashboard-title">
          <h2>Usuarios registrados</h2>

          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
          >
            + Nuevo usuario
          </button>
        </div>

        {message && <p>{message}</p>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>

                  <td>
                    {new Date(
                      user.createdAt,
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(user.id)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <UserForm
          user={editingUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingUser(null);
            loadUsers();
          }}
        />
      )}
    </main>
  );
}