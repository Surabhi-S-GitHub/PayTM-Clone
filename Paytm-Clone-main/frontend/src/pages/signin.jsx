import { Heading } from '../components/Heading';
import { SubHeading } from '../components/SubHeading';
import { InputBox } from '../components/InputBox';
import { Button } from '../components/Button'; 
import { BottomWarning } from '../components/BottomWarning';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Axios from 'axios';

export const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign In"} />
          <SubHeading label={"Enter your credentials to access your account"} />

          <InputBox
            placeholder='johnDoe@gmail.com'
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
              label={"Sign In"}
              onClick={async () => {
                try {
                  const response = await Axios.post('http://localhost:3000/api/v1/user/signin', {
                    username,
                    password
                  });

                  localStorage.setItem('token', response.data.token);

                  // Correct key: use 'initialAmount' instead of 'intialAmount'
                  const amount = response.data.initialAmount; // Make sure your backend sends this correctly
                  const firstNameInitial = response.data.firstName?.[0]?.toUpperCase() || username[0]?.toUpperCase();

                  navigate(`/dashboard?amount=${amount}&firstName=${firstNameInitial}`);
                } catch (error) {
                  if (
                    error.response &&
                    error.response.data &&
                    error.response.data.message
                  ) {
                    alert("Signin failed: " + error.response.data.message);
                  } else {
                    alert("Signin failed: " + error.message);
                  }
                  console.error(error);
                }
              }}
            />
          </div>

          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
