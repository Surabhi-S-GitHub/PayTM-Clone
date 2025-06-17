import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate('/signin');
      return;
    }

    axios.get("http://localhost:3000/api/v1/user/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      navigate(`/dashboard?amount=${response.data.intialAmount}&firstName=${response.data.username[0].toUpperCase()}`);
    })
    .catch((error) => {
      // Token is invalid or server error
      navigate('/signin');
    });

  }, []); // empty dependency array = run once on mount

  return null; // or a loading screen/spinner if you want
}
