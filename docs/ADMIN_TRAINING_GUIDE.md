# Guia de Treinamento - Administradores

**Versão:** 1.0  
**Data:** 2024  
**Público:** Administradores e Gerentes  
**Duração:** 2 horas  

## Módulo 1: Visão Geral do Sistema (15 min)

### Objetivos
- Compreender a arquitetura do sistema
- Conhecer os principais recursos
- Entender fluxos de trabalho

### Arquitetura

**Frontend:**
- React 18.2 com TypeScript
- Interface responsiva
- Atualização em tempo real

**Backend:**
- Node.js + Express
- MongoDB para dados
- Redis para cache

**Segurança:**
- Autenticação JWT
- MFA (autenticação multifator)
- Controle de acesso baseado em funções

### Recursos Principais

1. **Gerenciamento de Pacientes** ✅
2. **Agendamento de Consultas**
3. **Documentação Clínica**
4. **Planos de Tratamento**
5. **Faturamento**

## Módulo 2: Gerenciamento de Pacientes (30 min)

### 2.1 Acessando Pacientes

**Navegação:**
```
Dashboard → Pacientes → Lista de Pacientes
```

**URL Direta:**
```
/admin/patients
```

### 2.2 Visualizando Detalhes

**Passo a Passo:**
1. Localize o paciente na lista
2. Clique no nome
3. Página de detalhes abre com 5 abas

**Atalho de Teclado:**
- Ctrl+Click: Abre em nova aba

### 2.3 Editando Informações

**Campos Editáveis:**
- Nome e sobrenome (obrigatórios)
- Email (validação automática)
- Telefone
- CPF
- Data de nascimento
- Gênero

**Validações:**
- Nome: mínimo 2 caracteres
- Email: formato válido
- Campos obrigatórios destacados

**Processo:**
1. Clique em "Editar"
2. Modifique campos
3. Clique em "Salvar"
4. Aguarde confirmação

### 2.4 Gerenciando Odontograma

**Funcionalidades:**
- Visualizar condições dentárias
- Marcar novos problemas
- Ver histórico de alterações
- Adicionar anotações

**Sistemas de Numeração:**
- FDI (padrão)
- Universal (alternativo)

**Marcação de Condições:**
1. Selecione o dente
2. Escolha tipo de condição
3. Defina superfície
4. Salve alteração

### 2.5 Planos de Tratamento

**Visualização:**
- Lista de todos os planos
- Status de cada plano
- Fases e procedimentos
- Custos detalhados

**Status Possíveis:**
- Rascunho
- Proposto
- Aceito
- Em Andamento
- Concluído
- Cancelado

**Modo Apresentação:**
- Tela cheia
- Ideal para mostrar ao paciente
- Resumo financeiro destacado

### 2.6 Notas Clínicas

**Tipos de Notas:**
- SOAP (Subjetivo, Objetivo, Avaliação, Plano)
- Progresso
- Consulta
- Procedimento

**Timeline:**
- Ordenação cronológica
- Filtros por tipo
- Preview de conteúdo
- Indicador de bloqueio

**Notas Bloqueadas:**
- Não podem ser editadas
- Garantem integridade
- Ícone de cadeado

### 2.7 Histórico Médico

**Seções:**
1. Queixa principal
2. Condições médicas
3. Histórico odontológico
4. Alergias (CRÍTICO)
5. Medicações
6. Histórico social

**⚠️ ALERGIAS:**
- Sempre verificar antes de procedimentos
- Alertas exibidos em todo o sistema
- Atualizar regularmente

## Módulo 3: Tratamento de Erros (20 min)

### 3.1 Tipos de Erros

**Erro de Conexão:**
- Mensagem: "Erro ao carregar dados"
- Ação: Verificar internet, tentar novamente

**Erro de Validação:**
- Mensagem: Campo específico inválido
- Ação: Corrigir campo, salvar novamente

**Erro de Permissão:**
- Mensagem: "Acesso negado"
- Ação: Verificar função do usuário

**Erro de Servidor:**
- Mensagem: "Erro interno"
- Ação: Contatar suporte técnico

### 3.2 Recuperação de Erros

**Botão "Tentar Novamente":**
- Disponível em erros de rede
- Recarrega dados automaticamente
- Não perde alterações não salvas

**Botão "Voltar":**
- Retorna à tela anterior
- Disponível em erros críticos
- Salva estado quando possível

### 3.3 Prevenção de Erros

**Boas Práticas:**
- Salvar frequentemente
- Verificar validações
- Não fechar durante salvamento
- Manter conexão estável

## Módulo 4: Performance e Otimização (15 min)

### 4.1 Carregamento Lazy

**Como Funciona:**
- Dados carregam sob demanda
- Primeira visita à aba: carrega dados
- Visitas subsequentes: usa cache

**Benefícios:**
- Carregamento inicial rápido
- Menos uso de rede
- Melhor experiência

### 4.2 Cache de Dados

**Dados em Cache:**
- Informações do paciente
- Planos de tratamento
- Notas clínicas
- Histórico médico

**Duração:**
- Durante a sessão
- Limpa ao sair
- Atualiza ao salvar

### 4.3 Indicadores de Performance

**Tempos Esperados:**
- Carregamento inicial: <1.2s
- Troca de aba: <0.8s
- Salvamento: <0.6s

**Se mais lento:**
- Verificar conexão
- Limpar cache do navegador
- Verificar carga do servidor

## Módulo 5: Segurança (20 min)

### 5.1 Controle de Acesso

**Funções:**
- Super Admin: Acesso total
- Admin: Gerenciamento completo
- Manager: Operações diárias
- Receptionist: Visualização limitada

**Permissões:**
- Leitura: Ver informações
- Escrita: Editar informações
- Exclusão: Remover registros
- Gerenciamento: Controle total

### 5.2 Autenticação

**Login:**
- Email + senha
- MFA opcional (recomendado)
- Sessão expira em 15 minutos de inatividade

**Tokens:**
- Renovação automática
- Logout em todas as sessões
- Revogação imediata

### 5.3 Auditoria

**Logs Registrados:**
- Todas as alterações
- Quem fez
- Quando fez
- O que mudou

**Acesso aos Logs:**
- Apenas administradores
- Não podem ser editados
- Mantidos permanentemente

### 5.4 Proteção de Dados

**LGPD Compliance:**
- Dados criptografados
- Acesso controlado
- Backup regular
- Direito ao esquecimento

**Dados Sensíveis:**
- Histórico médico
- Informações financeiras
- Documentos pessoais
- Imagens clínicas

## Módulo 6: Solução de Problemas (20 min)

### 6.1 Problemas Comuns

**Problema: Página não carrega**
- Verificar URL
- Atualizar página (F5)
- Limpar cache
- Verificar autenticação

**Problema: Não consigo salvar**
- Verificar campos obrigatórios
- Verificar validações
- Verificar conexão
- Tentar novamente

**Problema: Dados não aparecem**
- Aguardar carregamento
- Verificar permissões
- Tentar novamente
- Verificar filtros

**Problema: Erro ao trocar aba**
- Aguardar carregamento anterior
- Atualizar página
- Verificar conexão

### 6.2 Ferramentas de Diagnóstico

**Console do Navegador:**
- F12 para abrir
- Aba "Console" para erros
- Aba "Network" para requisições

**Informações Úteis:**
- Mensagem de erro completa
- Código de status HTTP
- Tempo de resposta

### 6.3 Quando Contatar Suporte

**Situações:**
- Erro persiste após tentativas
- Dados inconsistentes
- Performance muito lenta
- Funcionalidade não disponível

**Informações para Fornecer:**
- Mensagem de erro exata
- Passos para reproduzir
- Navegador e versão
- Horário do problema

## Módulo 7: Melhores Práticas (20 min)

### 7.1 Fluxo de Trabalho Eficiente

**Rotina Diária:**
1. Login no sistema
2. Verificar agenda
3. Preparar fichas dos pacientes
4. Atualizar informações após consultas
5. Revisar pendências

**Organização:**
- Manter dados atualizados
- Documentar imediatamente
- Revisar regularmente
- Arquivar adequadamente

### 7.2 Qualidade dos Dados

**Entrada de Dados:**
- Completa e precisa
- Verificar ortografia
- Usar formatos padrão
- Evitar abreviações

**Manutenção:**
- Atualizar contatos
- Verificar alergias
- Revisar medicações
- Confirmar endereços

### 7.3 Comunicação com Pacientes

**Informações Sensíveis:**
- Não compartilhar por email
- Usar portal do paciente
- Confirmar identidade
- Documentar comunicações

### 7.4 Backup e Recuperação

**Sistema Automático:**
- Backup diário
- Retenção de 30 dias
- Recuperação sob demanda

**Responsabilidade do Usuário:**
- Não deletar dados importantes
- Marcar como inativo ao invés de deletar
- Documentar mudanças significativas

## Exercícios Práticos (20 min)

### Exercício 1: Editar Paciente
1. Acesse um paciente de teste
2. Edite nome e email
3. Salve alterações
4. Verifique confirmação

### Exercício 2: Visualizar Odontograma
1. Acesse aba Odontograma
2. Alterne entre FDI e Universal
3. Visualize histórico
4. Adicione uma anotação

### Exercício 3: Revisar Plano de Tratamento
1. Acesse aba Plano de Tratamento
2. Visualize detalhes
3. Use modo apresentação
4. Saia do modo apresentação

### Exercício 4: Gerenciar Histórico Médico
1. Acesse aba Histórico Médico
2. Adicione uma alergia
3. Adicione uma medicação
4. Salve alterações

### Exercício 5: Tratamento de Erro
1. Simule erro de rede (desconecte)
2. Tente carregar dados
3. Use botão "Tentar Novamente"
4. Reconecte e verifique

## Avaliação (10 min)

### Checklist de Competências

- [ ] Consigo acessar detalhes do paciente
- [ ] Consigo editar informações básicas
- [ ] Consigo navegar entre as abas
- [ ] Consigo visualizar odontograma
- [ ] Consigo ver planos de tratamento
- [ ] Consigo acessar notas clínicas
- [ ] Consigo gerenciar histórico médico
- [ ] Sei como tratar erros comuns
- [ ] Entendo os indicadores de carregamento
- [ ] Sei quando contatar suporte

## Recursos Adicionais

### Documentação
- Guia do Usuário completo
- Guia de API
- Guia de Componentes

### Suporte
- Email: suporte@topsmile.com
- Telefone: (11) 1234-5678
- Chat: Disponível no sistema

### Atualizações
- Notas de versão
- Novos recursos
- Correções de bugs

## Certificação

**Após completar o treinamento:**
- Pratique por 1 semana
- Revise documentação
- Tire dúvidas com suporte
- Solicite certificação

**Renovação:**
- Anual
- Após grandes atualizações
- Mudança de função
