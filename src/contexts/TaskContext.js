import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// URL base de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Crear el contexto de tareas
export const TaskContext = createContext();

// Hook personalizado para usar el contexto de tareas
export const useTask = () => useContext(TaskContext);

// Proveedor del contexto de tareas
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  // Cargar tareas cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, statusFilter, searchTerm]);

  // Función para obtener todas las tareas
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir URL con parámetros de filtro
      let url = `${API_URL}/tasks`;
      const params = new URLSearchParams();
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await axios.get(url);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      setError(error.response?.data?.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  // Función para crear una nueva tarea
  const createTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/tasks`, taskData);
      
      // Actualizar la lista de tareas
      setTasks(prevTasks => [response.data.task, ...prevTasks]);
      
      return response.data.task;
    } catch (error) {
      console.error('Error al crear tarea:', error);
      setError(error.response?.data?.message || 'Error al crear la tarea');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar una tarea
  const updateTask = async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData);
      
      // Actualizar la lista de tareas
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? response.data.task : task
        )
      );
      
      return response.data.task;
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      setError(error.response?.data?.message || 'Error al actualizar la tarea');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para marcar una tarea como completada
  const completeTask = async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.patch(`${API_URL}/tasks/${taskId}/complete`);
      
      // Actualizar la lista de tareas
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? response.data.task : task
        )
      );
      
      return response.data.task;
    } catch (error) {
      console.error('Error al completar tarea:', error);
      setError(error.response?.data?.message || 'Error al completar la tarea');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una tarea
  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      
      // Actualizar la lista de tareas
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      return true;
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      setError(error.response?.data?.message || 'Error al eliminar la tarea');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar el filtro de estado
  const filterByStatus = (status) => {
    setStatusFilter(status);
  };

  // Función para buscar tareas
  const searchTasks = (term) => {
    setSearchTerm(term);
  };

  const value = {
    tasks,
    loading,
    error,
    statusFilter,
    searchTerm,
    fetchTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    filterByStatus,
    searchTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};