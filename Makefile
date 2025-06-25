install-backend:
	chmod +x backend/install.sh
	chmod +x backend/run.sh
	cd backend && ./install.sh

install-frontend:
	chmod +x frontend/install.sh
	chmod +x frontend/run.sh
	cd frontend && ./install.sh

install: install-backend install-frontend

run-backend:
	cd backend && ./run.sh

run-frontend:
	cd frontend && ./run.sh

.DEFAULT_GOAL := install

Task 1

Desenvolver o Painel de Administrador para Gestão de Planos de Assi
Description

Desenvolver uma área de administração para gerenciar os planos de assinatura das empresas. Isso inclui a criação de diferentes níveis de planos (ex: Básico, Premium) e a capacidade de um administrador atribuir um plano a cada empresa.

Critérios de Aceitação:

    Uma nova página de "Painel de Administrador" é criada e acessível apenas para usuários com o perfil de administrador.
    O painel de admin lista todas as empresas cadastradas.
    O administrador pode visualizar e alterar o plano de assinatura de cada empresa (ex: de Básico para Premium).
    O banco de dados é atualizado para incluir tabelas para plans e company_subscriptions.

task 2 

Implementar o Funil de Geração de Leads

Criar um sistema completo para que instaladores possam solicitar orçamentos diretamente aos fornecedores, gerando um lead qualificado. A funcionalidade deve incluir um botão "Solicitar Orçamento" na página de perfil da empresa, um formulário para o instalador preencher os detalhes da sua necessidade e uma nova seção no dashboard do fornecedor para visualizar e gerenciar os leads recebidos.

Critérios de Aceitação:

    Um instalador pode enviar uma solicitação de orçamento a partir da página de um fornecedor.
    A solicitação é registrada como um "lead" no banco de dados, associada ao instalador e ao fornecedor.
    O fornecedor pode ver uma lista de leads recebidos em seu dashboard.
    O fornecedor é notificado (ex: por e-mail) sobre um novo lead.

task 3 

Integração de Pagamentos para Planos de Assinatura

Integrar um gateway de pagamento (ex: Stripe, Lemon Squeezy) para permitir que as empresas (fornecedores) assinem e paguem por planos premium de forma autônoma. A solução deve incluir uma página de checkout segura e um webhook para atualizar automaticamente o status do plano da empresa no banco de dados após a confirmação do pagamento.

**Critérios de Aceitação:**
- Fornecedores podem clicar em um botão "Upgrade" em seu dashboard.
- Uma página de checkout é exibida, permitindo o pagamento seguro.
- Após o pagamento bem-sucedido, o plano da empresa é atualizado para "Premium" automaticamente.
- A plataforma lida com a renovação de assinaturas (mensal/anual).