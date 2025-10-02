
import { createUser, getUserByEmail } from '../Models/user.model.js';
import { generateToken } from '../Utils/userUtils.js';
import bcrypt from 'bcrypt';


export const signUpController = async (req, res) => {
    try {

        /*
          extract the data from the body
          check if the user exists
          prepare new user data
          create the user in the database
          generates the token
          send a success return statement withour the password

        */
        const { name, email, password, phone } = req.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json(
                {
                    success: false,
                    message: 'User with this email already exists'
                }
            );
        };

        const newUser = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            phone: phone ? phone.trim() : null
        }

        const userId = await createUser(newUser);

        const token = generateToken(userId, newUser.email);



        return res.status(200).json(
            {
                success: true,
                message: 'Account created successfully',
                token: token,
                userData: {
                    id: userId,
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone
                }
            }
        );

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json(
                {
                    success: false,
                    message: 'Email address already exists'
                }
            );
        }
        console.error('signing up Error', error.message);

        return res.status(500).json(
            {
                success: false,
                message: `Internal server error during sign up, error${error.message}`
            }
        );
    };
};


export const logInController = async (req, res) => {
    try {

        /*
           extract the data from the body
           check if the user already signed up
           check if the password correct
           Generate JWT token for successful login
           Return success response (without password)

        */

        const { email, password } = req.body;

        // Basic validation:
        if (!email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Email and password are required",
                }
            );
        };

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Invalid email or password",
                }
            );
        };

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json(
                {
                    success: false,
                    message: "invalid email or password"
                }
            );
        };

        const token = generateToken(user.id, user.email);

        return res.status(200).json(
            {
                success: true,
                message: "User logged in successfully",
                token: token,
                userData: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            }
        );


    } catch (error) {
        console.error('Login Error', error.message);
        return res.status(500).json(
            {
                success: false,
                message: `Internal server error during login, error: ${error.message}`,
            }
        );
    };
};
