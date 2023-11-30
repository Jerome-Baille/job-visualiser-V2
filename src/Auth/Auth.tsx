import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Card, CardBody, CardFooter } from '@chakra-ui/react'

function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <Card>
            <CardBody>
                {isLogin ? <LoginForm /> : <RegisterForm />}
            </CardBody>
            <CardFooter>
                <span>
                    {isLogin ? 'Need an account? ' : 'Already have an account? '}
                    <a href="#" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Register' : 'Login'}
                    </a>
                </span>
            </CardFooter>
        </Card>
    );
}

export default Auth;