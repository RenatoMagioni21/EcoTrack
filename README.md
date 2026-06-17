# EcoTrack 🌿

O **EcoTrack** é uma ferramenta desenvolvida para ajudar os usuários a monitorarem sua pegada de carbono mensal. Através de cálculos baseados no consumo de energia e quilometragem rodada, o sistema fornece um diagnóstico do impacto ambiental e mantém um histórico para acompanhamento.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

### Frontend
- **HTML5**: Estrutura das páginas.
- **CSS3**: Estilização com design moderno e responsivo.
- **JavaScript (Vanilla)**: Lógica de front-end e integração com a API.

### Backend
- **Node.js**: Ambiente de execução.
- **Express.js**: Framework para construção da API REST.
- **MySQL**: Banco de dados relacional para persistência dos dados.
- **Body-parser**: Middleware para manipulação de JSON e requisições.

## ✨ Funcionalidades

- **Cadastro e Login**: Sistema de autenticação de usuários.
- **Cálculo de Pegada de Carbono**: Baseado em KM rodados e consumo de energia (kWh).
- **Histórico Persistente**: Salva os cálculos realizados no banco de dados.
- **Dashboard de Resultados**: Exibição imediata do impacto com indicadores visuais (Baixo, Moderado, Alto).

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado.
- [XAMPP](https://www.apachefriends.org/) (ou qualquer servidor MySQL).

### Passo 1: Configurar o Banco de Dados
Crie um banco de dados chamado `ecotrack` e execute os seguintes comandos SQL para criar as tabelas:

```sql
CREATE DATABASE ecotrack;

USE ecotrack;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE historico_calculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    km_rodados DECIMAL(10,2),
    energia_kwh DECIMAL(10,2),
    total_co2 DECIMAL(10,2),
    nivel VARCHAR(50),
    calculado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

### Passo 2: Instalar Dependências
No terminal, na raiz do projeto, execute:
```bash
npm install
```

### Passo 3: Iniciar o Servidor
Execute o comando:
```bash
node server.js
```
O servidor estará rodando em `http://localhost:3000`.

---
Desenvolvido com foco em sustentabilidade e tecnologia. 🌎
