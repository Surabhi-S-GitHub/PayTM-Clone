import { Heading } from '../components/Heading';
import { SubHeading } from '../components/SubHeading';
import { InputBox } from '../components/InputBox';
import { Button } from '../components/Button'; 
import { BottomWarning } from '../components/BottomWarning';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Axios from 'axios';

export const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign Up"} />
          <SubHeading label={"Enter your information to create an account"} />
          
          <InputBox
            placeholder='Surabhi'
            label={'First Name'}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputBox
            placeholder='S'
            label={'Last Name'}
            onChange={(e) => setLastName(e.target.value)}
          />
          <InputBox
            placeholder='surabhi@gmail.com'
            label={'Email'}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputBox
            placeholder='123456'
            label={'Password'}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className='pt-4'>
            <Button
              onClick={async () => {
                try {
                  const response = await Axios.post("http://localhost:3000/api/v1/user/signup", {
                    username,
                    firstName,
                    lastName,
                    password
                  }, {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });

                  const amount = response.data.initialAmount; 
                  localStorage.setItem('token', response.data.token);

                  navigate(`/dashboard?amount=${amount}&firstName=${username[0].toUpperCase()}`);
                } catch (error) {
                  if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                  ) {
                    alert("Signup failed: " + error.response.data.message);
                  } else {
                    alert("Signup failed: " + error.message);
                  }
                  console.error(error);
                }
              }}
              label={"Sign Up"}
            />
          </div>

          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
