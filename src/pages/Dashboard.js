import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TaskProvider } from '../contexts/TaskContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import '../styles/Task.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const navigate = useNavigate();

  // Función para mostrar formulario de creación de tarea
  const handleCreateTask = () => {
    setCurrentTask(null);
    setShowTaskForm(true);
  };

  // Función para mostrar formulario de edición de tarea
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setShowTaskForm(true);
  };

  // Función para cerrar formulario
  const handleCloseForm = () => {
    setShowTaskForm(false);
    setCurrentTask(null);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <TaskProvider>
      <div className="dashboard">
        {/* Header */}
        <header className="dashboard-header">
          <div className="container">
            <div className="dashboard-header-content">
              <h1>Gestor de Tareas</h1>
              <div className="flex align-center">
                <span className="mr-2">
                  Hola, <strong>{user?.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="dashboard-main">
          <div className="container">
            {/* Cards with task stats */}
            <div className="stats-container">
              <div className="stat-card">
                <h2 className="stat-title">Pendientes</h2>
                <p className="stat-value pending">0</p>
              </div>
              <div className="stat-card">
                <h2 className="stat-title">En Progreso</h2>
                <p className="stat-value in-progress">0</p>
              </div>
              <div className="stat-card">
                <h2 className="stat-title">Completadas</h2>
                <p className="stat-value completed">0</p>
              </div>
            </div>

            {/* Task list */}
            <TaskList 
              onCreateTask={handleCreateTask} 
              onEditTask={handleEditTask} 
            />
          </div>
        </main>

        {/* Task form modal */}
        {showTaskForm && (
          <TaskForm 
            task={currentTask} 
            onClose={handleCloseForm} 
          />
        )}
      </div>
    </TaskProvider>
  );
};

export default Dashboard;