# Guia do Usuário - Gerenciamento de Pacientes

**Versão:** 1.0  
**Data:** 2024  
**Público:** Administradores, Gerentes, Recepcionistas  

## Visão Geral

O sistema de gerenciamento de pacientes permite visualizar, editar e gerenciar todas as informações clínicas e administrativas dos pacientes em um único local.

## Acessando Informações do Paciente

### 1. Navegando para o Paciente

1. Acesse o menu **Pacientes**
2. Localize o paciente na lista
3. Clique no nome do paciente
4. Você será direcionado para a página de detalhes

**Atalho:** Use a URL direta `/admin/patients/[ID]`

### 2. Visão Geral da Página

A página possui 5 abas principais:
- **Visão Geral** - Informações básicas do paciente
- **Odontograma** - Mapa dental interativo
- **Plano de Tratamento** - Planos de tratamento ativos
- **Notas Clínicas** - Histórico de consultas
- **Histórico Médico** - Condições médicas e alergias

## Aba: Visão Geral

### Visualizando Informações

**Informações Exibidas:**
- Nome completo
- Email e telefone
- Data de nascimento
- Gênero
- CPF
- Status (ativo/inativo)
- Endereço completo

### Editando Informações do Paciente

**Passo a Passo:**

1. Clique no botão **Editar** (canto superior direito)
2. Os campos se tornarão editáveis
3. Modifique as informações necessárias:
   - Nome
   - Sobrenome
   - Email
   - Telefone
   - CPF
   - Data de nascimento
   - Gênero
4. Clique em **Salvar** para confirmar
5. Ou clique em **Cancelar** para descartar alterações

**Validações:**
- Nome e sobrenome são obrigatórios
- Email deve ter formato válido
- Todos os campos são validados antes de salvar

**Mensagens:**
- ✅ Sucesso: Dados salvos automaticamente
- ❌ Erro: Mensagem específica será exibida

### Campos Opcionais

Se um campo não estiver preenchido, será exibido "Não informado". Você pode adicionar essas informações editando o paciente.

## Aba: Odontograma

### Visualizando o Mapa Dental

**Recursos:**
- Visualização completa dos dentes
- Marcações de condições existentes
- Histórico de alterações
- Anotações clínicas

### Sistemas de Numeração

**Alternar entre sistemas:**
1. Localize os botões de opção no topo
2. Selecione **FDI** (padrão internacional)
3. Ou selecione **Universal** (sistema americano)

### Marcando Condições

1. Clique em um dente no diagrama
2. Selecione o tipo de condição
3. Escolha a superfície afetada
4. Defina a severidade
5. Salve a marcação

### Visualizando Histórico

1. Clique em **Mostrar Histórico**
2. Veja todas as versões anteriores
3. Selecione uma versão para visualizar
4. Compare alterações ao longo do tempo

### Adicionando Anotações

1. Use o campo de notas na parte inferior
2. Digite observações relevantes
3. Clique em **Salvar Notas**

### Exportando

**Opções disponíveis:**
- **Imprimir** - Imprime o odontograma atual
- **Exportar PDF** - Gera arquivo PDF (em desenvolvimento)

## Aba: Plano de Tratamento

### Visualizando Planos

**Informações exibidas:**
- Título do plano
- Status (Rascunho, Proposto, Aceito, Em Andamento, Concluído)
- Fases do tratamento
- Procedimentos por fase
- Custos detalhados

### Entendendo as Fases

Cada plano é dividido em fases:
- **Número da Fase** - Ordem de execução
- **Título** - Nome descritivo
- **Status** - Pendente, Em Andamento, Concluído
- **Procedimentos** - Lista de procedimentos incluídos

### Detalhes dos Procedimentos

Para cada procedimento você verá:
- **Código CDT** - Código do procedimento
- **Descrição** - Nome do procedimento
- **Dente** - Dente afetado (se aplicável)
- **Custo** - Valor do procedimento

### Resumo Financeiro

**Valores exibidos:**
- **Custo Total** - Valor total do plano
- **Cobertura do Seguro** - Valor coberto
- **Responsabilidade do Paciente** - Valor a pagar

### Modo Apresentação

1. Clique em **Modo Apresentação**
2. Visualização em tela cheia
3. Ideal para apresentar ao paciente
4. Clique em **Sair da Apresentação** para voltar

### Estado Vazio

Se não houver planos, você verá:
"Nenhum plano de tratamento encontrado."

## Aba: Notas Clínicas

### Visualizando Notas

**Formato de Timeline:**
- Notas mais recentes no topo
- Ordenadas por data
- Ícones indicam tipo e status

### Tipos de Notas

**Identificados por badges:**
- **SOAP** - Nota estruturada (Subjetivo, Objetivo, Avaliação, Plano)
- **Progresso** - Nota de acompanhamento
- **Consulta** - Registro de consulta
- **Procedimento** - Documentação de procedimento
- **Outro** - Outros tipos

### Informações Exibidas

Para cada nota:
- **Tipo** - Badge colorido
- **Data e Hora** - Formato brasileiro (dd/mm/aaaa hh:mm)
- **Profissional** - Nome do dentista/higienista
- **Preview** - Primeiras 100 caracteres
- **Status** - 🔒 indica nota bloqueada

### Visualizando Detalhes

1. Clique em **Ver Detalhes**
2. Você será direcionado para a página completa da nota
3. Lá você pode ver todo o conteúdo

### Notas Bloqueadas

Notas com ícone 🔒 estão bloqueadas e não podem ser editadas. Isso garante a integridade do registro clínico.

### Estado Vazio

Se não houver notas:
"Nenhuma nota clínica registrada"

## Aba: Histórico Médico

### Visualizando Histórico

**Seções do formulário:**
1. Queixa Principal
2. Condições Médicas
3. Histórico Odontológico
4. Alergias
5. Medicações
6. Histórico Social

### Queixa Principal

Campo de texto livre para descrever o motivo da consulta ou preocupação principal do paciente.

### Condições Médicas

**Checkboxes para condições comuns:**
- Diabetes
- Hipertensão
- Doenças cardíacas
- E outras...

Marque todas as condições que se aplicam ao paciente.

### Histórico Odontológico

**Procedimentos anteriores:**
- Canal radicular
- Extrações
- Ortodontia
- E outros...

Marque os procedimentos que o paciente já realizou.

### Gerenciando Alergias

**Adicionar alergia:**
1. Digite o nome do alérgeno
2. Selecione a severidade (Leve, Moderada, Grave)
3. Clique em adicionar

**Remover alergia:**
- Clique no ícone de remover ao lado da alergia

**⚠️ IMPORTANTE:** Alergias são exibidas como alertas em todo o sistema!

### Gerenciando Medicações

**Adicionar medicação:**
1. Nome do medicamento
2. Dosagem (ex: 500mg)
3. Frequência (ex: 2x/dia)
4. Clique em adicionar

**Remover medicação:**
- Clique no ícone de remover

### Histórico Social

**Tabagismo:**
- Nunca
- Ex-fumante
- Fumante

**Álcool:**
- Nunca
- Ocasional
- Regular

### Salvando Alterações

1. Preencha/edite as informações
2. Clique em **Salvar Histórico Médico**
3. Aguarde confirmação
4. Mensagem de sucesso será exibida

## Tratamento de Erros

### Mensagens de Erro

**Tipos de erro:**
- **Vermelho** - Erro crítico
- **Fundo rosa** - Área de erro destacada

### Erro de Carregamento

**Se os dados não carregarem:**
1. Verifique sua conexão
2. Clique em **Tentar Novamente**
3. Se persistir, contate o suporte

### Erro ao Salvar

**Se não conseguir salvar:**
1. Verifique os campos obrigatórios
2. Corrija erros de validação
3. Tente novamente
4. Se persistir, anote a mensagem de erro

### Paciente Não Encontrado

**Se o paciente não existir:**
- Mensagem: "Paciente não encontrado"
- Clique em **Voltar** para retornar à lista
- Verifique o ID do paciente

## Estados de Carregamento

### Indicadores

**Mensagens de carregamento:**
- "Carregando..." - Dados do paciente
- "Carregando planos..." - Planos de tratamento
- "Carregando notas..." - Notas clínicas
- "Carregando histórico..." - Histórico médico
- "Salvando..." - Operação de salvamento

**Aguarde** até que o carregamento seja concluído antes de realizar outras ações.

## Navegação

### Botão Voltar

- Localizado no topo da página
- Símbolo: ← Voltar
- Retorna para a lista de pacientes

### Alternando Abas

1. Clique no nome da aba desejada
2. A aba ativa fica destacada em azul
3. Dados são carregados automaticamente

## Dicas e Boas Práticas

### ✅ Faça

- Sempre salve alterações antes de sair
- Verifique informações antes de salvar
- Use o botão Voltar para navegar
- Aguarde mensagens de confirmação
- Revise alergias regularmente

### ❌ Não Faça

- Não feche a página durante salvamento
- Não ignore mensagens de erro
- Não edite sem necessidade
- Não deixe campos obrigatórios vazios

## Atalhos de Teclado

- **Tab** - Navegar entre campos
- **Enter** - Confirmar em formulários
- **Esc** - Cancelar edição (quando disponível)

## Perguntas Frequentes

**P: Como adiciono um novo paciente?**
R: Use a lista de pacientes e clique em "Novo Paciente".

**P: Posso deletar informações?**
R: Não. O sistema mantém histórico completo. Você pode marcar como inativo.

**P: Como imprimo as informações?**
R: Use a função de impressão do navegador (Ctrl+P).

**P: As alterações são salvas automaticamente?**
R: Não. Você deve clicar em "Salvar" para confirmar.

**P: Posso editar notas clínicas?**
R: Apenas notas não bloqueadas podem ser editadas.

**P: Como sei se salvou com sucesso?**
R: Uma mensagem de confirmação será exibida.

## Suporte

**Em caso de problemas:**
1. Verifique sua conexão com a internet
2. Atualize a página (F5)
3. Limpe o cache do navegador
4. Contate o suporte técnico

**Informações para o suporte:**
- Mensagem de erro exata
- Ação que estava realizando
- ID do paciente (se aplicável)
- Navegador utilizado
