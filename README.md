# Descrição

Seu primeiro projeto back-end será a construção da API que completará seu projeto do bate-papo UOL!

Caso queira testar com um front-end (recomendamos!), você pode usar seu próprio projeto do Bate-Papo UOL ou utilizar a versão que fizemos juntos no live-coding, que está nesse repositório: [https://github.com/bootcamp-ra/bate-papo-uol-front](https://github.com/bootcamp-ra/bate-papo-uol-front)

Repositório de referência para o back: [https://github.com/bootcamp-ra/10-api-bate-papo-uol](https://github.com/bootcamp-ra/10-api-bate-papo-uol)

# Requisitos

- Geral
    - [x]  A porta utilizada pelo seu servidor deve ser a 3000
    - [x]  Seu projeto deverá ser desenvolvido utilizando Git e GitHub
    - [x]  Para isso, comece fazendo um **fork** **privado** do projeto de referência: [https://github.com/bootcamp-ra/10-api-bate-papo-uol](https://github.com/bootcamp-ra/10-api-bate-papo-uol)
    - [x]  **A cada requisito implementado** faça um commit com uma mensagem descritiva do que você evoluiu
    - [x]  Caso queira dividir um requisito em vários commits, não há problema. Mas evite colocar mais de um requisito no mesmo commit
- POST "/participants"
    - [x]  Deve receber (pelo body da request), um parâmetro **name**, contendo o nome do participante a ser cadastrado
    - [x]  Sanitizar esse parâmetro **name** (remover possíveis tags HTML por segurança)

        **Dica**: pesquise por uma lib chamada **string-strip-html**

    - [x]  Validar se o parâmetro **name** não é uma string vazia. Caso seja, retornar status 400.
    - [x]  Salvar o participante em memória, no formato

        ```jsx
        {name: 'xxx', lastStatus: Date.now()}
        ```

        **Dica**: este `Date.now()` gera um **timestamp**, que é o número de milissegundos passados desde 01/01/1970 00:00:00 até o exato momento. É bem útil pra fazer contas matemáticas com data e será útil nos próximos requisitos (para expulsar usuários inativos do chat)

    - [x]  Salvar em memória uma mensagem no formato:

        ```jsx
        {from: 'xxx', to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'}
        ```

        **Dica**: para gerar o horário nesse formato, pesquise por uma biblioteca chamada **day.js**

    - [x]  Retornar status 200
- GET "/messages"
    - [x]  Retornar as últimas 100 mensagens em JSON
- POST "/messages"
    - [x]  Deve receber (pelo body da request), os parâmetros **from**, **to**, **text** e **type**
    - [x]  Sanitizar os parâmetros (remover possíveis tags HTML por segurança)
    - [x]  Remover possíveis espaços em branco no início e fim das strings (pesquise por **trim**)
    - [x]  Validar: (caso algum erro seja encontrado, retornar status 400)
        - [x]  **from**, **to** e **text** devem ser strings não vazias
        - [x]  **type** só pode ser 'message' ou 'private_message'
        - [x]  **from** deve ser um participante existente em memória
    - [x]  Salvar a mensagem em memória
    - [x]  Ao salvar essa mensagem, deve ser acrescentado o atributo **time**, contendo a hora atual no formato HH:MM:SS
    - [x]  Retornar status 200
- GET "/participants"
    - [x]  Retornar a lista de todos os participantes em JSON
- POST "/status"
    - [x]  Deve receber (pelo body da request), um parâmetro **name**, contendo o nome do participante a ser cadastrado
    - [x]  Caso este participante não conste na lista de participantes, deve ser retornado um status 400
    - [x]  Atualizar o atributo **lastStatus** do participante informado para o timestamp atual, utilizando `Date.now()`
    - [x]  Retornar status 200
- Remoção automática de usuários inativos
    - [x]  A cada 15 segundos, remova da lista de participantes os participantes que possuam um **lastStatus** de mais de 10 segundos atrás
    - [x]  Para cada participante removido, salve uma nova mensagem em memória, no formato:

        ```jsx
        {from: 'xxx', to: 'Todos', text: 'sai da sala...', type: 'status', time: 'HH:MM:SS'}
        ```

# Bônus (opcional)

- Filtragem de mensagens privadas no back-end
    - [x]  Nos requests para buscar mensagens (GET "/messages"), filtre as mensagens privadas que não se destinem ao usuário que está pedindo as mensagens
    - [x]  Para saber o usuário que está pedindo as mensagens, adicione no front (na hora de disparar o request do axios) e receba no back um header de nome 'user-name', contendo o nome do usuário que está pedindo as mensagens
    - [x]  Remova do front a lógica de filtragem de mensagens privadas
- Persistência
    - [x]  Leia e persista os dados de participantes e mensagens utilizando arquivos
