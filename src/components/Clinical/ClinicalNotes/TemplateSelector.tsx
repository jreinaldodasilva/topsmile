// src/components/Clinical/ClinicalNotes/TemplateSelector.tsx
import React, { useState, useEffect } from 'react';
import './TemplateSelector.css';

interface Template {
  id: string;
  name: string;
  noteType: string;
}

interface TemplateSelectorProps {
  noteType: string;
  onSelect: (template: any) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ noteType, onSelect }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch(`/api/clinical-notes/templates/type/${noteType}`)
      .then(res => res.json())
      .then(data => setTemplates(data.data));
  }, [noteType]);

  const handleSelect = async (templateId: string) => {
    const res = await fetch(`/api/clinical-notes/templates/${templateId}`);
    const data = await res.json();
    if (data.success) {
      onSelect(data.data);
    }
    setShowDropdown(false);
  };

  return (
    <div className="template-selector">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="template-btn"
      >
        📋 Usar Template
      </button>

      {showDropdown && (
        <div className="template-dropdown">
          {templates.length === 0 ? (
            <div className="no-templates">Nenhum template disponível</div>
          ) : (
            templates.map(template => (
              <div
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className="template-item"
              >
                {template.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
