import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Card from "../../components/card/Card";
import { SpinnerImg } from "../../components/loader/Loader";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { SET_NAME, SET_USER } from "../../redux/features/auth/authSlice";
import { getUser } from "../../services/authService";
import "./Profile.scss";

const Profile = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Getting use");
    setIsLoading(true);
    async function getUserData() {
      const data = await getUser();
      console.log(data);

      setProfile(data);
      setIsLoading(false);
      await dispatch(SET_USER(data));
      await dispatch(SET_NAME(data.name));
    }
    getUserData();
  }, [dispatch]);

  return (
    <div className="profile">
      {isLoading ? (
        <SpinnerImg />
      ) : profile === null ? (
        <Card cardClass={"card"}>
          <p className="error-message">
            Something went wrong. Please try refreshing the page.
          </p>
        </Card>
      ) : (
        <Card cardClass={"card"}>
          <div className="profile-content">
            <div className="profile-photo">
              <img 
                src={profile?.photo || '/default-avatar.png'} 
                alt={profile?.name || 'User'} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/default-avatar.png';
                }}
              />
            </div>
            <div className="profile-data">
              <p>
                <b>Name</b>
                <span>{profile?.name || 'Not provided'}</span>
              </p>
              <p>
                <b>Email</b>
                <span>{profile?.email || 'Not provided'}</span>
              </p>
              <p>
                <b>Phone</b>
                <span>{profile?.phone || 'Not provided'}</span>
              </p>
              <p>
                <b>Bio</b>
                <span>{profile?.bio || 'No bio available'}</span>
              </p>
              <div className="action-buttons">
                <Link to="/edit-profile" className="--btn --btn-primary">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;
