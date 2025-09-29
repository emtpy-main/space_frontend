import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  ListItemIcon,
  Button,
} from "@mui/material";
import {
  Mail,
  Notifications,
  Person,
  MoreHoriz,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { addRequest, removeRequest } from "./store/requestSlice";
import { useDispatch, useSelector } from "react-redux";
import { BaseUrl } from "../utils/constants";
import axios from "axios";
import {removeUser} from './store/userSlice' 

export const AppHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store)=>store.user);
  const reviewrequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BaseUrl + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };
  const fetchRequest = async () => {
    try {
      const res = await axios.get(BaseUrl + "/user/request/received", {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.data || []));
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };
  useEffect(() => {
    fetchRequest();
  }, []);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  }; 
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

const handleLogout = async () => {
  try { 
    dispatch(removeUser()); 
    await axios.post(
      `${BaseUrl}/logout`,
      {}, 
      { withCredentials: true }
    ); 
    navigate("/explore");
    console.log("User has been logged out successfully.");

  } catch (err) {
    console.error("Logout failed:", err); 
    
  } finally { 
    handleMenuClose();
  }
};
const handleProfilepage= async()=>{
  try{
    if(!user){
      return;
    }
    dispatch(removeUser());
    navigate('/profile');
  }catch(err){
    console.log(err);
  }
}
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={handleMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            bgcolor: "rgba(44, 24, 87, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "rgba(44, 24, 87, 0.8)",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
    > 
        <MenuItem onClick={handleProfilepage}>
          <ListItemIcon>
            <Person fontSize="small" sx={{ color: "white" }} />
          </ListItemIcon>
          Profile
        </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" sx={{ color: "white" }} />
        </ListItemIcon>
        LogOut
      </MenuItem>
    </Menu>
  );
  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      open={isNotificationMenuOpen}
      onClose={handleNotificationMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            width: 340,
            bgcolor: "rgba(44, 24, 87, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "rgba(44, 24, 87, 0.8)",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Connection Requests
        </Typography>
      </Box>
      {requests.length > 0 ? (
        requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, about } =
            request.fromUserId;
          return (
            <MenuItem
              key={request._id}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={photoUrl} alt={`${firstName} ${lastName}`} />
                <Typography variant="body2">{`${firstName} ${lastName}`}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => reviewrequest("accepted", request._id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => reviewrequest("rejected", request._id)}
                >
                  Reject
                </Button>
              </Box>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem disabled>
          <Typography sx={{ p: 2, textAlign: "center", width: "100%" }}>
            No new requests
          </Typography>
        </MenuItem>
      )}
    </Menu>
  ); 
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "rgba(44, 24, 87, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
          },
        },
      }}
    >
      <MenuItem component={Link} to="/chat">
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <Mail />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem onClick={handleNotificationMenuOpen}>
        <IconButton
          size="large"
          aria-label={`show ${requests.length} new notifications`}
          color="inherit"
        >
          <Badge badgeContent={requests.length} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          color="inherit"
        >
          <Avatar sx={{ width: 28, height: 28 }}/>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(44, 24, 87, 0.3)",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "block", sm: "block" }, fontWeight: "bold" }}
          >
            Space
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
               component={Link} to="/chat"
            >
              <Badge badgeContent={4} color="error">
                <Mail />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label={`show ${requests.length} new notifications`}
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={requests.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                src="https://i.pinimg.com/736x/d5/07/49/d50749f9c34b1ba48297e5a724577392.jpg"
              />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreHoriz />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotificationMenu}
    </Box>
  );
};

export default AppHeader;
