import styles from "./styles.module.css";
import { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom"; // นำเข้า Link จาก react-router-dom


function Home(userDetails) {
	// const [userName, setUserName] = useState(user.name);
	// const [email, setEmail] = useState(user.email);
	const user = userDetails.user;
	const [formData, setFormData] = useState({
        custname: '',
        username: `${user.name}`,
        password: '',
        sex: '',
        address: '',
        tel: '',
        email: `${user.email}`
    });
	const logout = () => {
		window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
	};
	const product = () => {
		// window.open(`${process.env.REACT_APP}/product`, "_self");
		window.open(`http://localhost:3000/product`, "_self");
	};
	const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
	const signup_insert = () => {
        axios.post('http://localhost:8080/register', formData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
			console.log('Registration successful:');
            //alert('Registration successful');
			axios.post('http://localhost:8080/login', formData, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			})
			.then(loginResponse  => {
				alert('login successful');
				const responseData = loginResponse .data;
				const token = responseData.token;
				
				// เก็บ token ใน sessionStorage
				sessionStorage.setItem('token', token);
				window.open(`http://localhost:3000/product`, "_self");
			})
			.catch(error => {
				console.error('Error:', error);
				alert('Failed to login');
			});
			window.open(`http://localhost:3000/product`, "_self");
			
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to register');
        });
    };
	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Home</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img className={styles.img} src="./images/profile.jpg" alt="login" />
				</div>
				<div className={styles.right}>
					<h2 className={styles.from_heading}>Profile</h2>
					<img
						src={user.picture}
						alt="profile"
						className={styles.profile_img}
					/>
					<input
						type="text"
						name="custname"
						className={styles.input}
						placeholder="Custname"
						onChange={handleChange}
					/>
					<input
						type="text"
						name="username"
						defaultValue={user.name}
						className={styles.input}
						placeholder="UserName"
						onChange={handleChange}
					/>
					<input
						type="text"
						name="email"
						defaultValue={user.email}
						className={styles.input}
						placeholder="Email"
						onChange={handleChange}
					/>
					<input
						type="text"
						name="password"
						className={styles.input}
						placeholder="Password"
						onChange={handleChange}
					/>
					<input
						type="text"
						name="sex"
						className={styles.input}
						placeholder="Sex"
						onChange={handleChange}
					/>
					<input
						type="text"
						name="address"
						className={styles.input}
						placeholder="Address"
						onChange={handleChange}
					/>
					<input
						type="text"
						name="tel"
						className={styles.input}
						placeholder="Tel"
						onChange={handleChange}
					/>
					<button className={styles.btn} onClick={signup_insert}>
						ลงทะเบียน
					</button>
					<button className={styles.btn} onClick={product}>
						product
					</button>
					<button className={styles.btn} onClick={logout}>
						Log Out
					</button>
					{/* <button className={styles.btn} onClick={linkto_home}>
						ยืนยัน
					</button> */}
				</div>
			</div>
		</div>
	);
}

export default Home;