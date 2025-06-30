import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', clinic: '', specialty: '', phone: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert('Enviado!'); };

  return (
    <section id="contact" className="contact-form-section">
      <h2 className="contact-form-title">Contato</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        {['name','email','clinic','specialty','phone'].map(n => (
          <input key={n} name={n} value={(form as any)[n]} onChange={handleChange}
                 placeholder={n.charAt(0).toUpperCase() + n.slice(1)}
                 className="contact-input" required />
        ))}
        <button type="submit" className="contact-btn">Enviar</button>
      </form>
    </section>
  );
};

export default ContactForm;
