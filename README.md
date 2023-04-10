# Typescript-express boilerplate
Typescript-express boilerplate to quickly get your project started!


## Project Setup
* Clone repository to local environment

```
git clone https://github.com/Samuel-Ngwarai/xxx
```

* Install Dependencies

```
npm i
```

* Build Component

```
npm run build
```

* Start Component

```
npm start
```


Listed below are the other cli options you have for interacting with the component

```
# set start component in watch mode
npm run watch

# creates the swagger file and sets log level to debug
npm run start:dev

# run the existing test suite
npm test

# run "docker-compose build && docker-compose up"
npm run start:docker
```

## Configuration

Parts of the components behaviour can be adjusted via environment variables as listed below
  
  
| Variable                           | type    | default                                                             | description                                                                    |
|------------------------------------|---------|---------------------------------------------------------------------|--------------------------------------------------------------------------------|
| PORT                               | number  | 3001                                                                | component port                                                                 |
| LOG\_LEVEL                          | string  | info                                                                | logger log level                                                               |
| CREATE\_SWAGGER\_FILE                | boolean | false                                                               | Whether or not to create the swagger file                                      |

## Considerations
... to be added