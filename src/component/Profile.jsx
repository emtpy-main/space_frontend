import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "./ui/muiTheme";
import { VisuallyHiddenInput } from "./ui/visuallyHiddenInput";
import { CustomButton } from "./ui/Button";
import { validateProfile } from "../utils/FormValidation";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../utils/constants";
import { addUser } from "./store/userSlice";

// --- Header Component ---
const Header = () => (
  <header className="p-4 bg-[#2c1857]/30 backdrop-blur-lg text-center shadow-lg z-10 flex-shrink-0 flex justify-center items-center border-b border-white/20">
    <h1 className="text-3xl font-bold text-white tracking-wider">Profile</h1>
  </header>
); 

const Toast = ({ message, show, type = 'success' }) => {
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div
      className={`
        fixed top-5 left-1/2 -translate-x-1/2 z-50
        transform transition-all duration-300 ease-out
        ${bgColor} text-white font-semibold py-2 px-5 rounded-md shadow-xl
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}
    >
      <span>{type === 'success' ? '✔' : '✖'}</span> {message}
    </div>
  );
};
 
const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    photoUrl: "",
    age: "",
    gender: "",
    bio: "",
    about: "",
    skills: [],
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);
  
  // UPDATED: State for toast visibility and message
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (user && Object.keys(user).length > 0) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(BaseUrl + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res?.data));
      } catch (err) {
        console.log("Error during fetching data: " + err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        photoUrl: user.photoUrl || "",
        age: user.age || "",
        gender: user.gender || "",
        // bio: user.bio || "",
        about: user.about || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");
    const validationErrors = validateProfile(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await axios.patch(
          BaseUrl + "/profile/edit",
          formData,
          { withCredentials: true }
        );
        dispatch(addUser(res?.data?.data)); 
        setToastMessage("Profile saved successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        setApiError(err.response?.data?.message || "An error occurred.");
        console.error("Profile save failed:", err);
      }
    } else {
      console.log("Form validation failed:", validationErrors);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1a0e36]">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="relative w-full min-h-screen font-sans">
        {/* NEW: Render the Toast component here */}
        <Toast message={toastMessage} show={showToast} />
        
        <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500 bg-[url('/app_bg.jpeg')]" />
        <div className="absolute inset-0 w-full h-full bg-black/70" />
        <div className="relative w-full min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow p-4 overflow-y-auto">
            <div className="w-full h-full flex flex-col md:flex-row gap-4">
              <section
                className={`w-full md:w-1/4 p-6 flex flex-col items-center justify-start self-start transition-colors duration-500 ${"bg-[#2c1857]/30 border border-white/20 text-white backdrop-blur-lg shadow-2xl rounded-2xl"} `}
              >
                <img
                  src={formData.photoUrl || "https://via.placeholder.com/150"}
                  alt="User Avatar"
                  className="h-40 w-40 md:h-48 md:w-48 object-cover rounded-full border-4 mb-4 shadow-lg border-white/50"
                />
                <h1 className="text-2xl font-bold m-2">
                  {formData.firstName || "User Name"}
                </h1>
                <p className="text-sm mb-6 text-slate-300">Pro Member</p>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput type="file" />
                </Button>
              </section>
              <section
                className={`w-full md:w-3/4 p-6 transition-colors duration-500 ${"bg-[#2c1857]/30 border border-white/20 text-white backdrop-blur-lg shadow-2xl rounded-2xl"}`}
              >
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  className="space-y-8"
                  onSubmit={handleSubmit}
                >
                  {/* Form fields remain the same... */}
                  <div>
                    <h2 className="text-xl font-bold mb-6 border-b pb-2 border-white/20">
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField required id="first-name" name="firstName" label="First Name" value={formData.firstName} onChange={handleInputChange} error={!!errors.firstName} helperText={errors.firstName}/>
                      <TextField required id="last-name" name="lastName" label="Last Name" value={formData.lastName} onChange={handleInputChange} error={!!errors.lastName} helperText={errors.lastName}/>
                      <TextField required id="photo-url" name="photoUrl" label="Photo URL" value={formData.photoUrl} onChange={handleInputChange} error={!!errors.photoUrl} helperText={errors.photoUrl}/>
                      <TextField required id="age" name="age" label="Age" type="number" value={formData.age} onChange={handleInputChange} error={!!errors.age} helperText={errors.age}/>
                      <FormControl fullWidth error={!!errors.gender}>
                        <InputLabel id="gender-select-label">Gender</InputLabel>
                        <Select labelId="gender-select-label" id="gender" name="gender" value={formData.gender} label="Gender" onChange={handleInputChange}>
                          <MenuItem value={"Male"}>Male</MenuItem>
                          <MenuItem value={"Female"}>Female</MenuItem>
                          <MenuItem value={"Other"}>Other</MenuItem>
                        </Select>
                        {errors.gender && (<FormHelperText>{errors.gender}</FormHelperText>)}
                      </FormControl>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-6 border-b pb-2 border-white/20">
                      Profile Information
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                      {/* <TextField id="bio" name="bio" label="Bio (short description)" multiline rows={3} value={formData.bio} onChange={handleInputChange} error={!!errors.bio} helperText={errors.bio || `${formData.bio.length}/280`} inputProps={{ maxLength: 280 }}/> */}
                      <TextField id="about" name="about" label="About Section" multiline minRows={4} value={formData.about} onChange={handleInputChange} placeholder="Tell us more about yourself..."/>
                      <TextField id="skills" name="skills" label="Skills (comma-separated)" value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills} onChange={(e) => handleInputChange({ target: { name: 'skills', value: e.target.value.split(',').map(skill => skill.trim()) } })} error={!!errors.skills} helperText={errors.skills || "e.g., React, Node.js, UI/UX"}/>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <CustomButton type="submit">Save Changes</CustomButton>
                  </div>
                  {apiError && <p className="text-red-500 text-right mt-2">{apiError}</p>}
                  {/* REMOVED: Old toast message <p> tag is no longer needed */}
                </Box>
              </section>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Profile;