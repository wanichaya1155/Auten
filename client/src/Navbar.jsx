import React from 'react';

const Navbar = () => {
    const username = "John Doe"; // ใส่ชื่อผู้ใช้ที่ต้องการแสดง

    const handleLogout = () => {
        // สร้างการจัดการออกจากระบบที่นี่
        // เช่น เรียกใช้ API เพื่อทำการออกจากระบบ
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <a href="index.html">
                    <img src="img/logo.png" alt="Logo" />
                </a>
            </div>
            <div className="element-right">
                <form method="post" action="testindex.php" className="search-bar">
                    <input type="text" name="search" placeholder="Search..." />
                    <button type="submit">Search</button>
                </form>
                <div className="cart">
                    <a href="shopping_cart2.html">
                        <img src="img/cart.png" alt="Cart" />
                    </a>
                </div>
                <div className="user-profile">
                    <img src="img/profilephoto.png" alt="Profile" />
                    <p>{username}</p>
                    <div className="dropdown-content">
                        <a href="#">การซื้อของฉัน</a>
                        <a href="#" onClick={handleLogout}>ออกจากระบบ</a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
