# YomuMangás - Images

Este projeto foi feito para ser um servidor de imagens local, mas **é recomendado usar um servidor externo** para guardar as imagens como o **Amazon S3**.

> ATENÇÃO: Todas as rotas exeto a `GET /` e `GET /manga` são protegidas por autenticação e necessitam do header **authorization**.

> \* = Obrigatório

</br>
</br>

## Rotas
* [**Imagens Padrão**](#imagens-padrão) `GET /:mangaId/:imageName` (Cover & Banner)
* [**Imagens Capítulos**](#imagens-capítulos): `GET /:mangaId/:chapterId/:imageName` (Páginas)
* [**Upload de Imagens**](#upload-de-imagens): `POST /image`
* [**Deletar Imagens**](#deletar-imagens): `DELETE /image`

</br>
</br>

## Imagens Padrão
`GET /:mangaId/:imageName`

| Parametro     | Tipo     | Descrição      | Obrigatório | Local  |
| ------------- | -------- | -------------- | ----------- | ------ |
| **mangaId**   | `number` | ID do manga    | Sim         | Params |
| **imageName** | `string` | Nome da imagem | Sim         | Params |

</br>

**Exemplo**: `GET /1/848fdjf29s-cover.png`

</br>
</br>

## Imagens Capítulos
`GET /:mangaId/:chapterId/:imageName`

| Parametro     | Tipo     | Descrição      | Obrigatório | Local  |
| ------------- | -------- | -------------- | ----------- | ------ |
| **mangaId**   | `number` | ID do manga    | Sim         | Params |
| **chapterId** | `number` | ID do capítulo | Sim         | Params |
| **imageName** | `string` | Nome da imagem | Sim         | Params |

</br>

**Exemplo**: `GET /1/22/83j8ejff2d-01.png`

</br>
</br>

## Upload de Imagens
`POST /image`

| Parametro     | Tipo      | Descrição                   | Obrigatório | Local     |
| ------------- | --------- | --------------------------- | ----------- | --------- |
| **file**      | `file`    | Imagem a ser enviada        | Sim         | Body      |
| **mangaId**   | `number`  | ID do manga                 | Sim         | URL Query |
| **chapterId** | `number`  | ID do capítulo              | Não         | URL Query |
| **key**       | `string`  | Nome da imagem              | Não         | URL Query |
| **default**   | `boolean` | Se a imagem é padrão ou não | Não         | URL Query |

> Caso não seja informado o **key**, o nome da imagem será o nome do arquivo + hash.

</br>

**Exemplo 1**: `POST /image?mangaId=1&chapterId=22`

**Exemplo 2**: `POST /image?mangaId=1&default=true&key=cover.png`

</br>
</br>

## Deletar Imagens
`DELETE /image`

| Parametro     | Tipo      | Descrição                                               | Obrigatório | Local     |
| ------------- | --------- | ------------------------------------------------------- | ----------- | --------- |
| **file**      | `string`  | Imagem a ser deletada                                   | Sim         | URL Query |
| **mangaId**   | `number`  | ID do manga                                             | Sim         | URL Query |
| **chapterId** | `number`  | ID do capítulo                                          | Não         | URL Query |
| **default**   | `boolean` | Se a imagem é padrão ou não                             | Não         | URL Query |
| **type**      | `string`  | Tipo de deletação (**manga**, **chapter** ou **image**) | Não         | URL Query |

> Caso não seja informado o **key**, o nome da imagem será o nome do arquivo + hash.

</br>

**Exemplo 1**: `DELETE /image?mangaId=1&chapterId=22&file=83j8ejff2d-01.png`

**Exemplo 2**: `DELETE /image?mangaId=1&type=image&default=true&file=848fdjf29s-cover.png`

**Exemplo 3**: `DELETE /image?mangaId=1&type=manga`

**Exemplo 4**: `DELETE /image?mangaId=1&type=chapter&chapterId=22`

</br>
</br>

## Extra
* Desenvolvido por [Vitu2002](https://github.com/Vitu2002)
* Contato: [contato@yomumangas.com](mailto:contato@yomumangas.com)
* Website: [www.yomumangas.com](http://yomumangas.com)