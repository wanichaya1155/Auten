import { useState } from 'react';
import axios from 'axios';
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
function Login() {
	const googleAuth = () => {
		window.open(
			`${process.env.REACT_APP_API_URL}/auth/google/callback`,
			"_self"
		);
	};
	const [formData, setFormData] = useState({
		//const { username, password } = req.body;
		username: '',
		password: ''
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const login_query = () => {
		axios.post('http://localhost:8080/login', formData, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => {
			alert('login successful');
			const responseData = response.data;
			const token = responseData.token;
			
			// เก็บ token ใน sessionStorage
			sessionStorage.setItem('token', token);
			window.open(`http://localhost:3000/product`, "_self");
		})
		.catch(error => {
			console.error('Error:', error);
			alert('Failed to login');
		});
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Log in Form</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img className={styles.img} src="./images/login.jpg" alt="login" />
				</div>
				<div className={styles.right}>
					<h2 className={styles.from_heading}>Members Log in</h2>
					<input type="text" name="username" className={styles.input} placeholder="Email Or UserName" onChange={handleChange} />
					<input type="password" name="password" className={styles.input} placeholder="Password" onChange={handleChange} />
					<button className={styles.btn} onClick={login_query}>Log In</button>
					<p className={styles.text}>or</p>
					<button className={styles.google_btn} onClick={googleAuth}>
						<img src="./images/google.png" alt="google icon" />
						<span>Sing in with Google</span>
					</button>
					<p className={styles.text}>
						New Here ? <Link to="/signup">Sing Up</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
