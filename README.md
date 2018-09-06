# Minestrone-Please Agent Bot

Bot de Telegram que verifica em um restaurante o cardápio do dia e informa se tem um prato específico.


## Pré-Requisito

### Token

Para executar a aplicação é necessário criar um arquivo token.json, na pasta /config, com o conteúdo:

```json
{
  "token": {
    "telegram": "Telegram bot key"
  },
  "user": {
    "Telegram User Id": 000000
  }
}
```

### Firebase

Para carregar os usuários do Firebase é necessário criar um arquivo firebase.json, na pasta /config, com o conteúdo:

```
{
  "apiKey": "<apiKey>",
  "authDomain": "<authDomain>",
  "databaseURL": "<databaseURL>",
  "projectId": "<projectId>",
  "storageBucket": "<storageBucket>",
  "messagingSenderId": "<messagingSenderId>"
}
```

Estas informações são adquiridas no painel de projeto do Firebase.

### Node version e dependências

Para instalar a versão correta do Node, rode os seguintes comandos na pasta raiz do projeto:

```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
$ source ~/.bashrc
$ nvm install
$ nvm use
$ npm i
```

---

## Execução

Para executar em **Desenvolvimento** rode o comando:

```bash
$ npm run serve:dev
```

Para executar em **Produção** rode o comando:

```bash
$ npm run serve:prod
```
