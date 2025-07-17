import React, { useState } from 'react';

export const ContactForm: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', clinic: '', specialty: '', phone: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert('Enviado!'); };

  return (
    <section id="contact" className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Contato</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        {['name','email','clinic','specialty','phone'].map(n => (
          <input key={n} name={n} value={(form as any)[n]} onChange={handleChange}
                 placeholder={n.charAt(0).toUpperCase() + n.slice(1)}
                 className="w-full px-4 py-2 border rounded" required />
        ))}
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">Enviar</button>
      </form>
    </section>
  );
};
