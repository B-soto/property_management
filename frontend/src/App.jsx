// Added Login and Register components for user authentication
// Added AuthProvider for global authentication state management
// Added ProtectedRoute for route guards
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import About from "./components/About";
import Create from "./components/Create";
import Projects from "./components/Projects";
import PropertyDetail from "./components/PropertyDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import Delete from "./components/Delete";
import Edit from "./components/Edit";

function App() {
  const myWidth = 220;
  return (
    <AuthProvider>
      <div className="App">
        <NavBar
          drawerWidth={myWidth}
          content={
            <Routes>
              {/* Public Routes - No authentication required */}
              <Route path="" element={<Home />}></Route>
              <Route path="/about" element={<About />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              
              {/* Protected Routes - Authentication required */}
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }></Route>
              <Route path="/property/:propertyId/*" element={
                <ProtectedRoute>
                  <PropertyDetail />
                </ProtectedRoute>
              }></Route>
              <Route path="/create" element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              }></Route>
              <Route path="/edit/:id" element={
                <ProtectedRoute>
                  <Edit />
                </ProtectedRoute>
              }></Route>
              <Route path="/delete/:id" element={
                <ProtectedRoute>
                  <Delete />
                </ProtectedRoute>
              }></Route>
            </Routes>
          }
        />
      </div>
    </AuthProvider>
  );
}

export default App;
