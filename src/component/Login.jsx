import React, { useState } from 'react';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import axios from 'axios'; // Added for API calls
// NOTE: The following imports are placeholders for a full app structure.
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../component/store/userSlice'
import {BaseUrl} from '../utils/constants';
import { validateAuthForm } from '../utils/authValidation'

 
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // State for form data, validation errors, and API errors
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const toggleFormType = () => {
    setIsSignInForm(!isSignInForm);
    setErrors({}); 
    setApiError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");  
    const validationErrors = validateAuthForm(formData, isSignInForm);
    setErrors(validationErrors);
 
    if (Object.keys(validationErrors).length === 0) { 
      try {
        const payload = isSignInForm
          ? { emailId: formData.email, password: formData.password }
          : { firstName: formData.firstName, lastName: formData.lastName, emailId: formData.email, password: formData.password };
        
        const response = await axios.post(
          `${BaseUrl}/${isSignInForm ? "login" : "signup"}`,
          payload,
          { withCredentials: true }
        );
        dispatch(addUser(response.data));
        navigate("/");  
      } catch (err) {
        console.error("API Error:", err);
        setApiError(err?.response?.data?.error || "An unexpected error occurred. Please try again.");
      }
    } else {
      console.log("Validation failed:", validationErrors);
    }
  };

  // --- STYLES ---
  const glassStyle = "bg-[#2c1857]/30 border border-white/20 text-white backdrop-blur-lg shadow-2xl rounded-2xl";
  const baseInputStyle = "w-full rounded-lg border bg-black/20 py-3 pl-12 pr-4 text-white placeholder-white/70 focus:outline-none focus:ring-1";
  const normalInputStyle = `${baseInputStyle} border-white/30 focus:border-[#cb83ff] focus:ring-[#cb83ff]`;
  const errorInputStyle = `${baseInputStyle} border-red-500/70 focus:border-red-500 focus:ring-red-500`;
  const iconStyle = "absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50";

  return (
    <div className="relative flex h-screen w-full items-center justify-center font-sans">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=2755&auto-format&fit=crop')" }}
      />
      <div className="absolute inset-0 w-full h-full bg-black/70 backdrop-blur-sm" />

      <div className={`relative z-10 w-[90vw] max-w-md p-6 sm:p-8 ${glassStyle}`}>
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          {isSignInForm ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignInForm && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-1/2">
                <Person className={iconStyle} />
                <input name="firstName" type="text" placeholder="First Name" className={errors.firstName ? errorInputStyle : normalInputStyle} value={formData.firstName} onChange={handleInputChange} />
                {errors.firstName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.firstName}</p>}
              </div>
              <div className="relative w-full sm:w-1/2">
                <Person className={iconStyle} />
                <input name="lastName" type="text" placeholder="Last Name" className={errors.lastName ? errorInputStyle : normalInputStyle} value={formData.lastName} onChange={handleInputChange} />
                {errors.lastName && <p className="text-red-400 text-xs mt-1 ml-1">{errors.lastName}</p>}
              </div>
            </div>
          )}

          <div className="relative">
            <Email className={iconStyle} />
            <input name="email" type="email" placeholder="Email" className={errors.email ? errorInputStyle : normalInputStyle} value={formData.email} onChange={handleInputChange} />
            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <Lock className={iconStyle} />
            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" className={errors.password ? errorInputStyle : normalInputStyle} value={formData.password} onChange={handleInputChange} />
            <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
              {showPassword ? <VisibilityOff sx={{width: 20, height: 20}} /> : <Visibility sx={{width: 20, height: 20}} />}
            </button>
            {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>

          {isSignInForm && (
            <div className="text-right">
              <a href="#" className="text-sm text-purple-300 hover:underline">
                Forgot Password?
              </a>
            </div>
          )}
          
          {apiError && <p className="text-red-400 text-sm text-center">{apiError}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#5f36a0] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#2c1857] hover:shadow-lg hover:shadow-[#5f36a0]/50 mt-6"
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-t border-white/20" />
          <span className="mx-4 text-sm text-white/60">OR</span>
          <hr className="flex-grow border-t border-white/20" />
        </div>
        
        <div className="text-center text-white">
            <p className="text-sm">
              {isSignInForm ? "Don't have an account?" : "Already have an account?"}
              <button onClick={toggleFormType} className="ml-2 font-semibold text-purple-300 hover:underline">
                {isSignInForm ? "Sign Up" : "Sign Up"}
              </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

