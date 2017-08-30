# Minestrone-Please Agent Bot

Aplicação middleware para interpretação e execução de relatórios.


## Pré-Requisito

### Token

Para executar a aplicação é necessário criar um arquivo token.json, na pasta /config, com o conteúdo:

```json
{
  "token": {
    "telegram": "Telegram bot key",
    "apiai": "Api.ai Account key"
  },
  "user": {
    "Telegran User Id": 000000
  }
}
```

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
