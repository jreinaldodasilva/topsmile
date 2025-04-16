import React from 'react';
import './Features.css';

const Features: React.FC = () => {
  return (
    <section className="features" id="recursos">
      <div className="container">
        <h3>Recursos do OnDoctor</h3>
        <div className="features-grid">
          <div className="feature-item">
            <img src="path_to_image.jpg" alt="Agenda Online" />
            <h4>Agenda Online</h4>
            <p>
              Com a agenda online do OnDoctor, sua equipe gerencia os agendamentos, diminui as faltas por meio do envio de lembretes automáticos via SMS e WhatsApp e ganha tempo para realizar o que realmente importa: o atendimento ao paciente.
            </p>
          </div>
          <div className="feature-item">
            <img src="path_to_image.jpg" alt="Prontuário Eletrônico" />
            <h4>Prontuário Eletrônico</h4>
            <p>
              Registre todas as informações dos atendimentos com facilidade e segurança, com modelos personalizáveis, anexo de imagens e documentos, e acesso rápido ao histórico do paciente.
            </p>
          </div>
          <div className="feature-item">
            <img src="path_to_image.jpg" alt="Telemedicina" />
            <h4>Telemedicina</h4>
            <p>
              Realize atendimentos online com segurança, diretamente pelo OnDoctor. Emita receitas e atestados com assinatura digital, de forma simples e prática.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
