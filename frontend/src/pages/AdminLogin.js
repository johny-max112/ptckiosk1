import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('ptc_token', res.data.token);
      nav('/admin/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth:400, margin: 'auto', padding:20 }}>
      <h2>Admin Login</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /><br/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" /><br/>
      <button type="submit">Login</button>
    </form>
  );
}