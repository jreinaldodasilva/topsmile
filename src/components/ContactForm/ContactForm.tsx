import React, { useState, FormEvent } from 'react';
import DOMPurify from 'dompurify';
import './ContactForm.css';

interface ContactFormData {
  name: string;
  email: string;
  clinic: string;
  specialty: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  clinic?: string;
  specialty?: string;
  phone?: string;
  general?: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    clinic: '',
    specialty: '',
    phone: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sanitize input function
  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] });
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Remove spaces, dashes, and parentheses for validation
    const phoneRegex = /^[+]?[\d]{1,16}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
  };

  const validateForm = (data: ContactFormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.name) {
      newErrors.name = 'Nome é obrigatório';
    } else if (data.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!data.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Digite um e-mail válido';
    }

    if (!data.clinic) {
      newErrors.clinic = 'Clínica é obrigatória';
    }

    if (!data.specialty) {
      newErrors.specialty = 'Especialidade é obrigatória';
    }

    if (!data.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(data.phone)) {
      newErrors.phone = 'Digite um telefone válido';
    }

    return newErrors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Sanitize all form data
    const sanitizedData: ContactFormData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      clinic: sanitizeInput(formData.clinic),
      specialty: sanitizeInput(formData.specialty),
      phone: sanitizeInput(formData.phone)
    };

    // Validate form
    const formErrors = validateForm(sanitizedData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      console.log('Contact form submitted:', sanitizedData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      setFormData({ name: '', email: '', clinic: '', specialty: '', phone: '' });
    } catch (error) {
      setErrors({ general: 'Falha ao enviar mensagem. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="contact-form__success">
        <h3>Obrigado pelo contato!</h3>
        <p>Retornaremos em até 24 horas.</p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="contact-form__reset-btn"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <section id="contact" className="contact-form-section">
      <h2 className="contact-form-title">Contato</h2>
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        {errors.general && (
          <div className="contact-form__error contact-form__error--general">
            {errors.general}
          </div>
        )}

        <div className="contact-form__field">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nome"
            className={errors.name ? 'contact-input contact-form__input--error' : 'contact-input'}
            disabled={isSubmitting}
            maxLength={100}
            required
          />
          {errors.name && (
            <span className="contact-form__error">{errors.name}</span>
          )}
        </div>

        <div className="contact-form__field">
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="E-mail"
            className={errors.email ? 'contact-input contact-form__input--error' : 'contact-input'}
            disabled={isSubmitting}
            maxLength={255}
            required
          />
          {errors.email && (
            <span className="contact-form__error">{errors.email}</span>
          )}
        </div>

        <div className="contact-form__field">
          <input
            name="clinic"
            value={formData.clinic}
            onChange={handleInputChange}
            placeholder="Clínica"
            className={errors.clinic ? 'contact-input contact-form__input--error' : 'contact-input'}
            disabled={isSubmitting}
            maxLength={100}
            required
          />
          {errors.clinic && (
            <span className="contact-form__error">{errors.clinic}</span>
          )}
        </div>

        <div className="contact-form__field">
          <input
            name="specialty"
            value={formData.specialty}
            onChange={handleInputChange}
            placeholder="Especialidade"
            className={errors.specialty ? 'contact-input contact-form__input--error' : 'contact-input'}
            disabled={isSubmitting}
            maxLength={100}
            required
          />
          {errors.specialty && (
            <span className="contact-form__error">{errors.specialty}</span>
          )}
        </div>

        <div className="contact-form__field">
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Telefone"
            className={errors.phone ? 'contact-input contact-form__input--error' : 'contact-input'}
            disabled={isSubmitting}
            maxLength={20}
            required
          />
          {errors.phone && (
            <span className="contact-form__error">{errors.phone}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="contact-btn"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
